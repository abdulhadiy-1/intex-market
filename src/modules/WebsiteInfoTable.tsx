import { useState, useEffect } from 'react';
import WebsiteInfoItem from '../components/WebsiteInfoItem';
import EditInfoModal from '../components/EditInfoModal';

interface WebsiteInfo {
  id: string;
  label: string;
  value: string;
  link?: string;
}

interface ApiResponse {
  entities: Array<{
    id: number;
    phone: string;
    address: string;
    time: string;
    telegram_link: string;
    instagram_link: string;
  }>;
}

const API_URL = 'http://13.61.23.60/info';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzUzMjg5MTUxLCJleHAiOjE3NTMyOTI3NTF9.62rAL01UTf03pkaq4MQO6jfUcin9NrkK5n4D3J3bifQ';

const WebsiteInfoTable = () => {
  const [infoItems, setInfoItems] = useState<WebsiteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{id: string; label: string; value: string} | null>(null);

  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить информацию о сайте');
        }

        const data: ApiResponse = await response.json();
        setInfoItems([
            { id: 'phone', label: 'Телефонный номер', value: data[0]?.phone },
            { id: 'address', label: 'Адрес', value: data[0]?.address },
            { id: 'workingHours', label: 'Рабочее время', value: data[0]?.time },
            { id: 'telegram', label: 'Телеграм', value: '@NRQ_1', link: data[0]?.telegram_link },
            { id: 'instagram', label: 'Инстаграм', value: 'your_profile', link: data[0]?.instagram_link },
        ]);
        console.log(infoItems)
      } catch (err) {
        setError(err instanceof Error ? err?.message : 'Произошла ошибка при загрузке данных');
        console.error('Ошибка при загрузке информации о сайте:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteInfo();
  }, []);

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

      // Map UI labels to API field names
      const fieldMap: Record<string, string> = {
        'Телефонный номер': 'phone',
        'Адрес': 'address',
        'Рабочее время': 'time'
      };

      const fieldName = fieldMap[item.label];
      if (!fieldName) return;

      // Get the current values from the API response
      const currentData = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      }).then(res => res.json());

      if (!currentData || !currentData[0]) {
        throw new Error('Failed to fetch current data');
      }

      // Prepare the data with all fields, updating only the changed field
      const updatedData = {
        phone: item.label === 'Телефонный номер' ? newValue : currentData[0].phone,
        address: item.label === 'Адрес' ? newValue : currentData[0].address,
        time: item.label === 'Рабочее время' ? newValue : currentData[0].time,
        telegram_link: currentData[0].telegram_link,
        instagram_link: currentData[0].instagram_link
      };

      // Send PATCH request with all fields
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Failed to update');
      
      // Update local state on success
      setInfoItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, value: newValue } : item
        )
      );
      
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      // TODO: Show error message to user
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[200px] bg-red-50 p-4 rounded-lg text-red-700">
        <p>Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mt-[200px] mx-auto">
        {infoItems.map((item) => (
          <WebsiteInfoItem
            key={item.id}
            label={item.label}
            value={item.value}
            link={item.link}
            onEdit={() => handleEdit(item.id)}
          />
        ))}
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
