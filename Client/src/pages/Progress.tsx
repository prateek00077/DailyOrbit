import React from 'react';
import ProgressList from '../components/progress/ProgressList';

const Progress: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-500 mb-6">Track Progress</h1>
      <ProgressList />
    </div>
  );
};

export default Progress;
