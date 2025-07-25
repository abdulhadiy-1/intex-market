import { useState } from 'react';
import WebsiteInfoItem from '../components/WebsiteInfoItem';
import EditInfoModal from '../components/EditInfoModal';
import { useWebsiteInfo, useUpdateWebsiteInfo, useAddWebsiteInfo } from '../service/WebsiteInfoApi';

interface WebsiteInfo {
  id: string;
  label: string;
  value: string;
  link?: string;
}

const WebsiteInfoTable = () => {
  const [editingItem, setEditingItem] = useState<{id: string; label: string; value: string} | null>(null);

  // Use React Query to fetch website info
  const { 
    data: websiteInfoData, 
    isLoading, 
    error: queryError 
  } = useWebsiteInfo();

  // Mutation hook for updating website info
  const updateWebsiteInfo = useUpdateWebsiteInfo();

  // Mutation hook for adding website info
  const addWebsiteInfo = useAddWebsiteInfo();

  // Transform API data to UI format
  const infoItems: WebsiteInfo[] = websiteInfoData && websiteInfoData[0] ? [
    { id: 'phone', label: 'Телефонный номер', value: websiteInfoData[0].phone },
    { id: 'address', label: 'Адрес', value: websiteInfoData[0].address },
    { id: 'workingHours', label: 'Рабочее время', value: websiteInfoData[0].time },
    { id: 'telegram', label: 'Телеграм', value: '@NRQ_1', link: websiteInfoData[0].telegram_link },
    { id: 'instagram', label: 'Инстаграм', value: 'your_profile', link: websiteInfoData[0].instagram_link },
  ] : [];

  const handleEdit = (id: string) => {
    const item = infoItems.find(item => item.id === id);
    if (item) {
      setEditingItem({
        id: item.id,
        label: item.label,
        value: item.value
      });
    }
  };

  const handleSave = async (id: string, newValue: string) => {
    try {
      const item = infoItems.find(item => item.id === id);
      if (!item) return;

      // Don't allow editing Telegram and Instagram links through this modal
      if (['telegram', 'instagram'].includes(id)) {
        setEditingItem(null);
        return;
      }

      // Map UI IDs to API field names
      const fieldMap: Record<string, string> = {
        'phone': 'phone',
        'address': 'address',
        'workingHours': 'time'
      };

      const fieldName = fieldMap[id];
      if (!fieldName) return;

      // Prepare the data with only the changed field
      const updatedData: Record<string, string> = {};
      updatedData[fieldName] = newValue;

      // Use the mutation hook to update the data
      await updateWebsiteInfo.mutateAsync(updatedData);

      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      // TODO: Show error message to user
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="mt-[200px] bg-red-50 p-4 rounded-lg text-red-700">
        <p>Ошибка: {queryError instanceof Error ? queryError.message : 'Произошла ошибка при загрузке данных'}</p>
      </div>
    );
  }

  // Function to create new website info if it doesn't exist
  const handleCreateWebsiteInfo = async () => {
    try {
      await addWebsiteInfo.mutateAsync({
        phone: "+998901234567",
        address: "123 Main Street, Tashkent, Uzbekistan",
        time: "09:00 - 18:00",
        telegram_link: "https://t.me/your_channel",
        instagram_link: "https://instagram.com/your_profile"
      });
    } catch (error) {
      console.error('Error creating website info:', error);
    }
  };

  return (
    <>
      <div className="space-y-6 mt-[200px] mx-auto">
        {infoItems.length > 0 ? (
          infoItems.map((item) => (
            <WebsiteInfoItem
              key={item.id}
              label={item.label}
              value={item.value}
              link={item.link}
              onEdit={() => handleEdit(item.id)}
            />
          ))
        ) : (
          <div className="text-center">
            <p className="mb-4">Информация о сайте не найдена</p>
            <button
              onClick={handleCreateWebsiteInfo}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={addWebsiteInfo.isPending}
            >
              {addWebsiteInfo.isPending ? 'Создание...' : 'Создать информацию о сайте'}
            </button>
          </div>
        )}
      </div>

      {editingItem && (
        <EditInfoModal
          title={editingItem.label}
          initialValue={editingItem.value}
          onClose={() => setEditingItem(null)}
          onSave={(newValue) => handleSave(editingItem.id, newValue)}
        />
      )}
    </>
  );
};

export default WebsiteInfoTable;
