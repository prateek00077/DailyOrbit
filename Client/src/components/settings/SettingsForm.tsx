import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const SettingsForm: React.FC = () => {
  const { user, deleteUser, updateUserPreferences } = useApp();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Defensive: handle case where user or preferences may be undefined
  const preferences = user?.preferences ?? {
    darkMode: false,
    notifications: false,
    compactView: false,
  };
  const isDarkMode = preferences.darkMode;

  const handleToggle = (key: keyof typeof preferences) => {
    updateUserPreferences({
      [key]: !preferences[key]
    });
  };

  const handleDelete = async () => {
  setDeleting(true);
  setDeleteError(null);
  try {
    await deleteUser();
  } catch (err: any) {
    setDeleteError(err.message || 'Failed to delete account');
  } finally {
    setDeleting(false);
  }
};

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 max-w-2xl mx-auto animate-fadeIn`}>
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Dark Mode</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable dark mode for the application</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.darkMode}
                  onChange={() => handleToggle('darkMode')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Compact View</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reduce spacing for a more compact layout</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.compactView}
                  onChange={() => handleToggle('compactView')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Enable Notifications</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive notifications for task reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preferences.notifications}
                  onChange={() => handleToggle('notifications')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Account</h3>
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="flex items-center">
              {/* Remove avatar and name if not present in user */}
              <div className="ml-4">
                <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{user?.fullname || 'User'}</p>
                {/* If you have email in user, show it */}
                {user?.email && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button onClick={handleDelete} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
            disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
            {deleteError && (
            <div className="mt-2 text-red-500 text-sm">{deleteError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;