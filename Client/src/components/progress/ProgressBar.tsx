import React from 'react';

interface ProgressProps {
  value: number; // value from 0 to 100
}

export const ProgressBar: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
