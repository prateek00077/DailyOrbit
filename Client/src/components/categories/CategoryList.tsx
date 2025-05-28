import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CategoryCard from './CategoryCard';
import AddCategoryForm from './AddCategoryForm';

const CategoryList: React.FC = () => {
  const { categories } = useApp();
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {isAddingCategory && (
        <div className="mb-6">
          <AddCategoryForm onCancel={() => setIsAddingCategory(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {categories.length === 0 && !isAddingCategory && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-500 mb-4">No categories found</p>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Create your first category</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;