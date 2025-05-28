import React from 'react';
import CategoryList from '../components/categories/CategoryList';

const Categories: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h1>
      <CategoryList />
    </div>
  );
};

export default Categories;