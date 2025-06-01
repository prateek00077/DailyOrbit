import React, { useState } from 'react';
import { Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import TaskList from '../tasks/TaskList';
import AddTaskForm from '../tasks/AddTaskForm';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isExpanded: boolean;
  onExpand: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isExpanded, onExpand }) => {
  const { tasks, removeCategory, user } = useApp();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const isDarkMode = user?.preferences?.darkMode ?? false;

  const categoryTasks = tasks.filter(task => task.categoryId === category.id);
  const completedTasks = categoryTasks.filter(task => (task.status === 'completed')).length;
  const totalTasks = categoryTasks.length;

  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Folder;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}" and all its tasks?`)) {
      removeCategory(category.id);
    }
  };

  return (
    <div
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
      style={{ borderTop: `3px solid ${category.color}` }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent size={20} style={{ color: category.color }} />
            </div>
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{category.name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className={`p-1.5 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/20'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              } rounded-lg transition-colors`}
              title="Delete category"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onExpand}
              className={`p-1.5 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/20'
                  : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'
              } rounded-lg transition-colors`}
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-slideDown">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className={`w-full py-2 px-3 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                } text-sm rounded-lg transition-colors text-center`}
              >
                + Add Task
              </button>
            ) : (
              <AddTaskForm
                categoryId={category.id}
                onCancel={() => setIsAddingTask(false)}
              />
            )}

            <TaskList categoryId={category.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;