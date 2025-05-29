import React from 'react';
import { CheckCircle, Clock, ListTodo, CalendarClock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DashboardStats: React.FC = () => {
  const { tasks, user } = useApp();
  const isDarkMode = user?.preferences?.darkMode??false;
  
  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: <ListTodo size={24} className="text-purple-500" />,
      color: 'bg-purple-100',
    },
    {
      title: 'Completed',
      value: tasks.filter(task => task.status === "completed").length,
      icon: <CheckCircle size={24} className="text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Pending',
      value: tasks.filter(task => !(task.status === "completed")).length,
      icon: <Clock size={24} className="text-amber-500" />,
      color: 'bg-amber-100',
    },
    {
      title: 'Today',
      value: tasks.filter(task => {
        const today = new Date().toISOString().split('T')[0];
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === today;
      }).length,
      icon: <CalendarClock size={24} className="text-blue-500" />,
      color: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;