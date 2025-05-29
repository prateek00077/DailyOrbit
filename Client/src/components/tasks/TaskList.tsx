import React from 'react';
import { useApp } from '../../context/AppContext';
import TaskItem from './TaskItem';

interface TaskListProps {
  categoryId?: string;
}

const TaskList: React.FC<TaskListProps> = ({ categoryId }) => {
  const { tasks, user } = useApp();
  const isDarkMode = user?.preferences?.darkMode??false;

  // Filter tasks by category if categoryId is provided
  const filteredTasks = categoryId 
    ? tasks.filter(task => task.categoryId === categoryId)
    : tasks;
  
  if (filteredTasks.length === 0) {
    return (
      <div className={`text-center py-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        No tasks in this category
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-amber-50'} rounded-2xl p-6`}>
      <div className="space-y-2">
        {filteredTasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;