import React, { useState, useEffect } from 'react';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MdOutlineMenuOpen } from "react-icons/md";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const isDarkMode = user.preferences.darkMode;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode
          ? scrolled
            ? 'bg-gray-800 shadow-lg'
            : 'bg-gray-800/80 backdrop-blur-md'
          : scrolled
          ? 'bg-white shadow-md'
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              } focus:outline-none md:hidden`}
            >
              {isSidebarOpen ? <MdOutlineMenuOpen size={24}/> : <Menu size={24} />}
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <span className="text-2xl font-bold text-indigo-600">Daily</span>
              <span className="text-2xl font-bold text-teal-600">Orbit</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-full ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:bg-gray-100'
              } transition-colors`}
            >
              <Bell size={20} />
            </button>

            <button
              className={`p-2 rounded-full ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:bg-gray-100'
              } transition-colors`}
              onClick={handleSettingsClick}
              title="Settings"
              aria-haspopup="true"
              aria-expanded={false}
            >
              <Settings size={20} />
            </button>

            <button
              onClick={logout}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:bg-gray-100'
              } transition-colors`}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className={`h-8 w-8 rounded-full object-cover ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } border`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;