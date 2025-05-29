import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useApp } from '../../context/AppContext';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useApp();
  const isDarkMode = user?.preferences?.darkMode ??false;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="pt-16 flex-1 flex flex-col"> {/* Make content area grow */}
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <main
          className={`flex-1 md:ml-64 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
          >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <div className="md:ml-64 transition-all duration-300">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;