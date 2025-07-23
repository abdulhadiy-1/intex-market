import { useEffect, useState } from 'react';
import type { CategoryType } from '../types/category';
import CategoryItem from '../components/CategoryItem';
import { useCookies } from 'react-cookie';

const CategoryTable = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cookie] = useCookies(["accessToken"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://13.61.23.60/category', {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить категории');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        console.error('Ошибка при загрузке категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category: CategoryType) => {
    // TODO: Implement edit functionality
    console.log('Edit category:', category);
  };

  const handleDelete = (id: number) => {
    // TODO: Implement delete functionality
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      console.log('Delete category with id:', id);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.nameUzb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700">
        <p>Ошибка при загрузке категорий: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full py-5 px-12  font-medium bg-white rounded-[30px]">
        <div className="w-[40%]">Название</div>
        <div className="w-[40%]">На узбекском</div>
        <div className="w-[20%]">Действия</div>
      </div>
      
      <div className="space-y-3 py-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryItem 
              key={category.id} 
              category={category} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Категории не найдены' : 'Категории не найдены'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
