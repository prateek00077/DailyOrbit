import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Footer: React.FC = () => {
  const { user } = useApp();
  const isDarkMode = user.preferences.darkMode;

  return (
    <footer className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-t py-6 mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              &copy; {new Date().getFullYear()} DailyOrbit. All rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
              Handcrafted by{' '}
              <span className="font-medium text-indigo-600 ml-1">Prateek Pandey</span>
              <Heart size={14} className="ml-1 text-red-500 inline animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;