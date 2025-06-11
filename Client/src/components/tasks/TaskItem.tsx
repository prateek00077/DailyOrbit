import React, { useState } from 'react';
import { Trash2, CheckCircle, Circle, Loader2, Share2, Pencil, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  hideShareDelete?: boolean; // <-- add this prop
  onStatusChange?: (taskId: string, status: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, hideShareDelete = false, onStatusChange }) => {
  const { removeTask, updateTaskStatus, user, updateTask } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const isDarkMode = user?.preferences?.darkMode ?? false;

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    removeTask(task._id);
  };

  const handleTaskStatus = async () => {
    let newStatus = '';
    if (taskStatus === 'pending') newStatus = 'in-progress';
    else if (taskStatus === 'in-progress') newStatus = 'completed';
    else newStatus = 'pending';

    setTaskStatus(newStatus);
    if (onStatusChange) {
      await onStatusChange(task._id, newStatus);
    } else {
      updateTaskStatus(task._id, newStatus);
    }
  };

  const handleShare = () => {
    setShowSharePopup(true);
    setShareEmail('');
    setShareError('');
    setShareSuccess('');
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShareLoading(true);
    setShareError('');
    setShareSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/task/share/${task._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: shareEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShareError(data.message || 'Failed to share task');
      } else {
        setShareSuccess('Task shared successfully!');
      }
    } catch {
      setShareError('Failed to share task');
    }
    setShareLoading(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-shrink-0 pt-0.5">
          {taskStatus === 'completed' ? (
            <CheckCircle onClick={handleTaskStatus} cursor="pointer" size={20} className="text-green-500" />
          ) : taskStatus === 'pending' ? (
            <Circle onClick={handleTaskStatus} cursor="pointer" size={20} className={isDarkMode ? 'text-gray-500' : 'text-gray-300'} />
          ) : (
            <Loader2 onClick={handleTaskStatus} cursor="pointer" size={20} className='text-blue-600' />
          )}
        </div>
        <div className="ml-0 sm:ml-3 flex-1 min-w-0 w-full">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className={`text-sm font-medium rounded px-2 py-1 border flex-1 min-w-0 ${
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
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={handleEditSave}
                  className="text-green-600 hover:text-green-800 px-2 py-1 rounded transition-colors bg-green-50 dark:bg-green-900"
                  title="Save"
                >
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-red-500 px-2 py-1 rounded transition-colors bg-red-50 dark:bg-red-900"
                  title="Cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-sm font-medium break-words ${
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
        <div className={`flex-shrink-0 flex items-center gap-1 mt-2 sm:mt-0 sm:ml-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'}`}>
          {!hideShareDelete && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Share Popup */}
      {!hideShareDelete && showSharePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-xs relative`}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              onClick={() => setShowSharePopup(false)}
              title="Close"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Share Task</h3>
            <form onSubmit={handleShareSubmit}>
              <input
                type="email"
                className={`w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                placeholder="Enter user's email"
                value={shareEmail}
                onChange={e => setShareEmail(e.target.value)}
                required
                disabled={shareLoading}
              />
              {shareError && <div className="text-red-500 text-sm mb-2">{shareError}</div>}
              {shareSuccess && <div className="text-green-600 text-sm mb-2">{shareSuccess}</div>}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
                disabled={shareLoading}
              >
                {shareLoading ? 'Sharing...' : 'Share'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;