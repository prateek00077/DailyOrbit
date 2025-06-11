import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Task, User } from '../types';

interface AppContextType {
  user: User | null;
  categories: Category[];
  tasks: Task[];

  deleteUser: () => Promise<void>;
  addNewTask: (task: Omit<Task, '_id' | 'createdAt'>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, taskStatus: string) => Promise<void>;
  addNewCategory: (category: Omit<Category, 'id'> & { description?: string }) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));

  // Map backend category to frontend Category type (add icon/color defaults if needed)
  const mapCategory = (cat: any): Category => {
    // Try to find the icon from localStorage (frontend-only)
    const icons = JSON.parse(localStorage.getItem('categoryIcons') || '{}');
    return {
      id: cat._id,
      name: cat.title || cat.name || '',
      icon: icons[cat._id] || '📁', // fallback to default if not found
      color: cat.colorCode || cat.color || '#6366f1',
    };
  };

  // Map backend task to frontend Task type
  const mapTask = (task: any): Task => ({
    _id: task._id,
    title: task.title,
    categoryId: task.categoryId,
    status: task.status,
    createdAt: task.date || task.createdAt || new Date().toISOString(),
  });

  // Fetch user, categories, and tasks after login or on refresh if authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (isAuthenticated && token) {
      // Fetch user info from localStorage
      if (storedUser) setUser(JSON.parse(storedUser));

      // Fetch categories from backend and map to frontend type
      fetch('/api/category/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : { categories: [] })
        .then(data => setCategories(
          (data.categories || []).map(mapCategory)
        ));

      // Fetch tasks from backend and map to frontend type
      fetch('/api/task/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : { tasks: [] })
        .then(data => setTasks(
          (data.tasks || []).map(mapTask)
        ));
    } else {
      setUser(null);
      setCategories([]);
      setTasks([]);
      localStorage.removeItem('user');
      localStorage.removeItem('categoryIcons');
    }
  }, [isAuthenticated]);

  // Dark mode effect (frontend only)
  useEffect(() => {
    if (user?.preferences?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences?.darkMode]);

  // API calls for CRUD
  const addNewTask = async (task: Omit<Task, '_id' | 'createdAt'>) => {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/task/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  if (res.status === 409) {
    const data = await res.json();
    throw new Error(data.message || 'Duplicate task');
  }
  if (!res.ok) {
    throw new Error('Failed to add task');
  }
  const created = await res.json();
  setTasks(prev => [...prev, mapTask(created)]);
};

  const removeTask = async (taskId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/task/delete/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setTasks(prev => prev.filter(task => task._id !== taskId));
    }
  };

  // function for updating the task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/task/update/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error('Failed to update task');
    }
    const updatedTask = await res.json();
    setTasks(prev =>
      prev.map(task =>
        task._id === taskId ? { ...task, ...updates, ...updatedTask } : task
      )
    );
  };

  const updateTaskStatus = async (taskId: string, taskStatus: string) => {
    const token = localStorage.getItem('token');
    // Find the task to update
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate) throw new Error('Task not found');
    // Update the status
    const updatedTask = { ...taskToUpdate, status: taskStatus };
    const res = await fetch(`/api/task/update/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedTask),
    });
    if (res.ok) {
      setTasks(prev =>
      prev.map(task =>
        task._id === taskId ? { ...task, status: taskStatus } : task
      )
      );
    }
  };
  
  const addNewCategory = async (category: Omit<Category, 'id'> & { description?: string }) => {
  const token = localStorage.getItem('token');
  const backendCategory = {
    title: category.name,
    colorCode: category.color,
    description: category.description || '',
  };
  const res = await fetch('/api/category/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(backendCategory),
  });
  if (res.ok) {
    const created = await res.json();
    // Save icon mapping in localStorage
    const icons = JSON.parse(localStorage.getItem('categoryIcons') || '{}');
    icons[created._id] = category.icon || '📁';
    localStorage.setItem('categoryIcons', JSON.stringify(icons));
    setCategories(prev => [
      ...prev,
      {
        id: created._id,
        name: created.title,
        icon: category.icon || '📁',
        color: created.colorCode,
      }
    ]);
  } else {
    // Optionally handle error
    const error = await res.json();
    throw new Error(error.message || 'Failed to create category');
  }
};

  const removeCategory = async (categoryId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/category/delete/${categoryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      setTasks(prev => prev.filter(task => task.categoryId !== categoryId));
      // Remove icon from localStorage
      const icons = JSON.parse(localStorage.getItem('categoryIcons') || '{}');
      delete icons[categoryId];
      localStorage.setItem('categoryIcons', JSON.stringify(icons));
    }
  };

  // Preferences are frontend only
  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    setUser(prevUser =>
      prevUser
        ? {
            ...prevUser,
            preferences: {
              ...prevUser.preferences,
              ...preferences,
            },
          }
        : null
    );
  };

  // Login and logout
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('token', data.token || data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
  const token = localStorage.getItem('token');
  await fetch('/api/user/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('categoryIcons');
  setIsAuthenticated(false);
  setUser(null);
  setCategories([]);
  setTasks([]);
  };

  const deleteUser = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/user/delete', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('categoryIcons');
    setIsAuthenticated(false);
    setUser(null);
    setCategories([]);
    setTasks([]);
  } else {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        categories,
        tasks,
        addNewTask,
        removeTask,
        updateTask,
        updateTaskStatus,
        addNewCategory,
        removeCategory,
        updateUserPreferences,
        isAuthenticated,
        login,
        logout,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};