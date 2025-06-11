// ProgressCard.tsx
import React from 'react';
import { Category, Task } from '../../types';
import { ProgressBar } from './ProgressBar.tsx';
import * as LucideIcons from 'lucide-react';

interface Props {
  category: Category;
  tasks: Task[];
}

const ProgressCard: React.FC<Props> = ({ category, tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Dynamically get the icon component from LucideIcons using the icon name stored in category.icon
  const IconComponent = (LucideIcons as any)[category.icon];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {IconComponent ? (
          <IconComponent size={28} color={category.color} />
        ) : (
          <span className="text-2xl" style={{ color: category.color }}>{category.icon}</span>
        )}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{category.name}</h3>
      </div>

      {/* Lines map for each task */}
      <div className="flex flex-col gap-1">
        {tasks.map((task, idx) => (
          <div key={task._id || idx} className="flex items-center gap-2">
            <span
              className={`inline-block w-3 h-3 rounded-full border-2 ${
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500'
                  : task.status === 'in-progress'
                  ? 'bg-yellow-400 border-yellow-400'
                  : 'bg-gray-300 border-gray-300'
              }`}
            ></span>
            <span
              className={`flex-1 h-2 rounded transition-all ${
                task.status === 'completed'
                  ? 'bg-green-400'
                  : task.status === 'in-progress'
                  ? 'bg-yellow-200'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              style={{ minWidth: 0 }}
            ></span>
            <span className="text-xs truncate text-gray-600 dark:text-gray-300">{task.title}</span>
          </div>
        ))}
      </div>

      <ProgressBar value={percentage} />

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {completed} of {total} tasks completed ({percentage}%)
      </p>
    </div>
  );
};

export default ProgressCard;