import React, { useState } from 'react';
import { Trash2, CheckCircle, Circle} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { removeTask, updateTaskStatus, user } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [taskStatus,setTaskStatus] = useState(task.status);
  const isDarkMode = user?.preferences?.darkMode??false;
  
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    removeTask(task._id);
  };

  const handleTaskStatus =()=>{
    let newStatus = "";
    if(task.status === "pending"){
      newStatus = "completed";
    }else{
      newStatus = "pending";
    }

    setTaskStatus(newStatus);
    updateTaskStatus(task._id,newStatus);
  }

  return (
    <div 
      className={`${
        isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-50 hover:bg-gray-100'
      } rounded-lg p-3 transition-all duration-200 hover:shadow-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {(taskStatus === 'completed') ? (
            <CheckCircle onClick={handleTaskStatus} cursor="pointer" size={20} className="text-green-500" />
          ) : (
            <Circle onClick={handleTaskStatus} cursor="pointer" size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-300'} />
          )}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className={`text-sm font-medium ${
            (task.status === 'completed') 
              ? isDarkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
              : isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {task.title}
          </p>
          {/** Task description was here */}
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
            {formattedDate}
          </p>
        </div>
        <div className={`flex-shrink-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleDelete}
            className={`p-1 ${
              isDarkMode 
                ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/20' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            } rounded-lg transition-colors`}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;