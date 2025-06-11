import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskItem from '../components/tasks/TaskItem';
import AddTaskForm from '../components/tasks/AddTaskForm';

const Tasks: React.FC = () => {
  const { tasks, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedCategoryForNewTask, setSelectedCategoryForNewTask] = useState(categories[0]?.id || '');

  // Filter tasks based on selected category
  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter(task => task.categoryId === selectedCategory);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-500 mb-4 sm:mb-0">All Tasks</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {isAddingTask && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm mb-6 animate-fadeIn">
          <h3 className="font-medium dark:text-white text-gray-800 mb-4">Add New Task</h3>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium dark:text-gray-200 text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategoryForNewTask}
              onChange={(e) => setSelectedCategoryForNewTask(e.target.value)}
              className="w-full px-3 py-2 border dark:bg-gray-800 dark:text-gray-200 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <AddTaskForm
            categoryId={selectedCategoryForNewTask}
            onCancel={() => setIsAddingTask(false)}
          />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const category = categories.find(c => c.id === task.categoryId);
                
                return (
                  <div 
                    key={task._id}
                    className="border border-gray-100 dark:border-gray-500 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="p-4">
                      {category && (
                        <div className="mb-2">
                          <span
                            className="inline-block px-2 py-1 text-xs rounded-md"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      )}
                      <TaskItem task={task} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:bg-gray-800 mb-4">No tasks found</p>
              <button
                onClick={() => setIsAddingTask(true)}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Create your first task</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;