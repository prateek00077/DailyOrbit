import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import TaskItem from '../components/tasks/TaskItem';

const SharedTasks: React.FC = () => {
  const { getSharedTasks, updateSharedTaskStatus } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedTasks().then(t => {
      setTasks(t);
      setLoading(false);
    });
  }, []);

  // Optional: update UI immediately after status change
  const handleStatusChange = async (taskId: string, status: string) => {
    await updateSharedTaskStatus(taskId, status);
    setTasks(prev =>
      prev.map(task =>
        task._id === taskId ? { ...task, status } : task
      )
    );
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-500 text-gray-800">Shared Tasks</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  hideShareDelete={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No shared tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedTasks;