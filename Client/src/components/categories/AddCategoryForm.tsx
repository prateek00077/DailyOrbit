import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import * as LucideIcons from 'lucide-react';

const iconOptions = [
  'Briefcase', 'User', 'Heart', 'BookOpen', 'Calendar', 'Home', 
  'ShoppingCart', 'Star', 'Music', 'Film', 'Coffee', 'Car', 
  'Plane', 'Gift', 'Umbrella', 'Globe', 'Smartphone'
];

const colorOptions = [
  '#4F46E5', // indigo
  '#0D9488', // teal
  '#F97316', // orange
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#10B981', // emerald
  '#EF4444', // red
  '#3B82F6', // blue
  '#F59E0B', // amber
];

interface AddCategoryFormProps {
  onCancel: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCancel }) => {
  const { addNewCategory, user } = useApp();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Briefcase');
  const [color, setColor] = useState('#4F46E5');
  const [description, setDescription] = useState('');
  const isDarkMode = user?.preferences?.darkMode??false;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (name.trim()) {
    addNewCategory({
      name: name.trim(),
      icon,
      color,
      description: description.trim(), // add this line
    });
    onCancel();
  }
};

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-5 shadow-sm mb-6 animate-fadeIn`}>
      <h3 className={`font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Add New Category</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="e.g., Work, Personal, Health"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              isDarkMode
                ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            placeholder="(optional)"
          />
        </div>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Icon
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {iconOptions.map((iconName) => {
              const IconComponent = (LucideIcons as any)[iconName];
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    icon === iconName 
                      ? (isDarkMode 
                          ? 'bg-indigo-900 text-indigo-400 ring-2 ring-indigo-700' 
                          : 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500')
                      : (isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-gray-100 text-gray-600')
                  }`}
                >
                  {IconComponent && <IconComponent size={20} />}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                onClick={() => setColor(colorOption)}
                className={`w-8 h-8 rounded-full ${
                  color === colorOption 
                    ? (isDarkMode 
                        ? 'ring-2 ring-offset-2 ring-gray-600' 
                        : 'ring-2 ring-offset-2 ring-gray-400')
                    : ''
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;