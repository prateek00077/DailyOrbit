import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AddTaskFormProps {
  categoryId: string;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ categoryId, onCancel }) => {
  const { addNewTask, user } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const isDarkMode = user.preferences.darkMode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      addNewTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        categoryId,
      });
      onCancel();
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 animate-fadeIn`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none
              ${isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className={`px-3 py-1.5 text-xs border rounded-lg transition-colors
              ${isDarkMode 
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;