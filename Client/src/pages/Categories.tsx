import React from 'react';
import CategoryList from '../components/categories/CategoryList';

const Categories: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-500 mb-6">Manage Categories</h1>
      <CategoryList />
    </div>
  );
};

export default Categories;