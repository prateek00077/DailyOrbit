import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const WelcomeMessage: React.FC = () => {
  const { quote } = useApp();
  const { user } = useApp();
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    setGreeting(getCurrentGreeting());
  }, []);

  const handleButton = ()=>{
    navigate('/tasks')
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting}, {user?.fullname}!
          </h1>
          <p className="text-indigo-100 mt-2">
            {quote ? quote : "keep going..."}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleButton} className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;