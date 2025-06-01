// ProgressList.tsx
import React from 'react';
import { useApp } from '../../context/AppContext';
import ProgressCard from './ProgressCard';

const ProgressList: React.FC = () => {
  const { categories, tasks } = useApp();

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Progress Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const tasksForCategory = tasks.filter(t => t.categoryId === category.id);
          return (
            <ProgressCard key={category.id} category={category} tasks={tasksForCategory} />
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-300">No categories to show progress.</p>
        </div>
      )}
    </div>
  );
};

export default ProgressList;
