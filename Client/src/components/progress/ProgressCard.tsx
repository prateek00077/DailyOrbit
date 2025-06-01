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

      <ProgressBar value={percentage} />

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {completed} of {total} tasks completed ({percentage}%)
      </p>
    </div>
  );
};

export default ProgressCard;