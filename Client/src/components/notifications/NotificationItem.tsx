import React from 'react';
import { CheckCircle, Share2, Edit, CheckSquare, X } from 'lucide-react';
import { Notification } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'task_shared':
        return <Share2 size={16} className="text-blue-500" />;
      case 'task_updated':
        return <Edit size={16} className="text-yellow-500" />;
      case 'task_completed':
        return <CheckSquare size={16} className="text-green-500" />;
      default:
        return <CheckCircle size={16} className="text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'task_shared':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'task_updated':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'task_completed':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-l-4 ${getTypeColor()} ${
        !notification.isRead ? 'opacity-100' : 'opacity-75'
      } hover:opacity-100 transition-opacity cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatTime(notification.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
          )}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
