import React from 'react';
import WelcomeMessage from '../components/dashboard/WelcomeMessage';
import DashboardStats from '../components/dashboard/DashboardStats';
import CategoryList from '../components/categories/CategoryList';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { tasks, categories } = useApp();
  
  // Get the most recent tasks (up to 3)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <WelcomeMessage />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Categories</h2>
            
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.slice(0, 4).map((category) => {
                  const categoryTasks = tasks.filter(task => task.categoryId === category.id);
                  const completedTasks = categoryTasks.filter(task => task.completed).length;
                  
                  return (
                    <div 
                      key={category.id}
                      className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors"
                      style={{ borderLeft: `3px solid ${category.color}` }}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{category.name}</p>
                        <p className="text-sm text-gray-500">
                          {completedTasks} of {categoryTasks.length} completed
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No categories found. Create your first category!</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
            
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map(task => {
                  const category = categories.find(c => c.id === task.categoryId);
                  
                  return (
                    <div 
                      key={task.id}
                      className="bg-gray-50 rounded-lg p-3 flex items-start"
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {task.title}
                        </p>
                        {category && (
                          <p className="text-xs mt-1">
                            <span 
                              className="inline-block w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: category.color }}
                            ></span>
                            <span className="text-gray-500">{category.name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;