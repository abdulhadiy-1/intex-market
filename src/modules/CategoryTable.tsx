import { useState } from 'react';
import type { CategoryType } from '../types/category';
import CategoryItem from '../components/CategoryItem';
import EditCategoryModal from '../components/EditCategoryModal';
import { useCategories, useDeleteCategory, useUpdateCategory } from '../service/CategoryApi';

const CategoryTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const { data: categories = [], isLoading: loading, error: queryError } = useCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  // Extract error message from the query error
  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Произошла ошибка') : null;

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
  };

  const handleCloseEditModal = () => {
    setEditingCategory(null);
  };

  const handleUpdateCategory = (values: { id: number; name: string; nameUzb: string }) => {
    updateCategory.mutate(values, {
      onSuccess: () => {
        console.log('Category updated successfully');
        setEditingCategory(null);
      },
      onError: (error) => {
        console.error('Error updating category:', error);
        alert('Не удалось обновить категорию. Пожалуйста, попробуйте еще раз.');
      }
    });
  };

  // Disable buttons when mutations are in progress
  const isUpdating = updateCategory.isPending;
  const isDeleting = deleteCategory.isPending;

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      deleteCategory.mutate(id, {
        onSuccess: () => {
          console.log('Category deleted successfully');
        },
        onError: (error) => {
          console.error('Error deleting category:', error);
          alert('Не удалось удалить категорию. Пожалуйста, попробуйте еще раз.');
        }
      });
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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск категорий..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Категории не найдены' : 'Категории не найдены'}
          </div>
        )}
      </div>

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateCategory}
        />
      )}
    </div>
  );
};

export default CategoryTable;
