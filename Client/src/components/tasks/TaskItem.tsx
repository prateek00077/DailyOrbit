import React, { useState } from 'react';
import { Trash2, CheckCircle, Circle, Loader2, Share2, Pencil } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { removeTask, updateTaskStatus, user, updateTask } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const isDarkMode = user?.preferences?.darkMode ?? false;

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    removeTask(task._id);
  };

  const handleTaskStatus = () => {
    let newStatus = "";
    if (task.status === "pending") {
      newStatus = "in-progress";
    } else if (task.status === "in-progress") {
      newStatus = "completed";
    } else {
      newStatus = "pending";
    }

    setTaskStatus(newStatus);
    updateTaskStatus(task._id, newStatus);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/task/${task._id}`;
    if (navigator.share) {
      navigator.share({
        title: task.title || 'Task',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Task link copied to clipboard!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task._id, { title: editTitle });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

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
          {taskStatus === 'completed' ? (
            <CheckCircle onClick={handleTaskStatus} cursor="pointer" size={20} className="text-green-500" />
          ) : taskStatus === 'pending' ? (
            <Circle onClick={handleTaskStatus} cursor="pointer" size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-300'} />
          ) : (
            <Loader2 onClick={handleTaskStatus} cursor="pointer" size={20} className='text-blue-600' />
          )}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className={`text-sm font-medium rounded px-2 py-1 border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEditSave();
                  if (e.key === 'Escape') handleEditCancel();
                }}
              />
              <button
                onClick={handleEditSave}
                className="text-green-600 hover:text-green-800 px-1"
                title="Save"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-red-500 px-1"
                title="Cancel"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className={`text-sm font-medium ${
                (task.status === 'completed')
                  ? isDarkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                  : isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {task.title}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                {formattedDate}
              </p>
            </>
          )}
        </div>
        <div className={`flex-shrink-0 flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleShare}
            className={`p-1 ${
              isDarkMode
                ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/20'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
            } rounded-lg transition-colors`}
            title="Share task"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleEdit}
            className={`p-1 ${
              isDarkMode
                ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/20'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            } rounded-lg transition-colors`}
            title="Edit task"
            disabled={isEditing}
          >
            <Pencil size={16} />
          </button>
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