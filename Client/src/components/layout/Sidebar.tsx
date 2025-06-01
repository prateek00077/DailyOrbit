import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, CheckSquare, Settings, X} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GiProgression } from "react-icons/gi";

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useApp();
  const isDarkMode = user?.preferences?.darkMode??false;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { path: '/categories', icon: <Folder size={20} />, text: 'Categories' },
    { path: '/tasks', icon: <CheckSquare size={20} />, text: 'Tasks' },
    { path: '/progress', icon: <GiProgression size={20} />,text: 'Progress'},
    { path: '/settings', icon: <Settings size={20} />, text: 'Settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg z-30 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="absolute top-4 right-4 md:hidden">
          <button
            onClick={closeSidebar}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:bg-gray-100'
            } transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="mb-8 mt-2">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Main Menu
            </p>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    closeSidebar();
                  }
                }}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.path)
                    ? isDarkMode 
                      ? 'bg-gray-700 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-600'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`${
                  isActive(item.path) 
                    ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.icon}
                </span>
                <span className="ml-3 font-medium">{item.text}</span>
                {isActive(item.path) && (
                  <span className={`ml-auto w-1.5 h-5 ${
                    isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                  } rounded-full`}></span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;