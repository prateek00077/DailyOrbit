import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AddTaskFormProps {
  categoryId: string;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ categoryId, onCancel }) => {
  const { addNewTask, user, categories } = useApp();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = user?.preferences?.darkMode;

  const categoryObj = categories.find(cat => cat.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !categoryObj) return;
    setLoading(true);
    try {
      await addNewTask({
        title: title.trim(),
        categoryId: categoryObj.id,
        status,
      });
      setLoading(false);
      onCancel();
    } catch (err: any) {
      setLoading(false);
      // If addNewTask throws, show error
      if (err?.message?.includes('already exists')) {
        setError('A task with this title already exists in this category.');
      } else {
        setError('Failed to add task. Please try again.');
      }
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
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">in-progress</option>
          </select>
        </div>
        {error && (
          <div className="mb-3 text-red-500 text-sm">{error}</div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className={`px-3 py-1.5 text-xs border rounded-lg transition-colors
              ${isDarkMode 
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;