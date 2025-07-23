import React, { useState } from 'react';
import { Button } from 'antd';
import CategoryTable from '../../modules/CategoryTable';
import AddCategoryModal from '../../components/AddCategoryModal';

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddCategory = (values: { name: string; nameUzb: string }) => {
    console.log('Adding category:', values);
    // Here you would typically make an API call to add the category
    // Example:
    // await api.addCategory(values);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-[var(--clr-bg)] w-full min-h-screen">
      <div className="flex justify-end mb-6">
        <Button 
          type="primary" 
          className="!rounded-[29px] !text-[20px] !font-bold !py-[30px] !px-6 flex items-center"
          onClick={showModal}
        >
          + Добавить категорию
        </Button>
      </div>

      <div className="rounded-2xl p-6">
        <CategoryTable />
      </div>

      {isModalOpen && (
        <AddCategoryModal 
          onClose={handleCancel}
          onAdd={handleAddCategory}
        />
      )}
    </div>
  );
};

export default Category;