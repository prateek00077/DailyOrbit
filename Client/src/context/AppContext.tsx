import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Task, User } from '../types';
import { initialCategories, initialTasks, initialUser, addTask, deleteTask, addCategory, deleteCategory } from '../data/initialData';

interface AppContextType {
  user: User;
  categories: Category[];
  tasks: Task[];
  addNewTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  removeTask: (taskId: string) => void;
  addNewCategory: (category: Omit<Category, 'id'>) => void;
  removeCategory: (categoryId: string) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Apply dark mode when preference changes
    if (user.preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.preferences.darkMode]);

  const addNewTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prevTasks => addTask(prevTasks, task));
  };

  const removeTask = (taskId: string) => {
    setTasks(prevTasks => deleteTask(prevTasks, taskId));
  };

  const addNewCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prevCategories => addCategory(prevCategories, category));
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prevCategories => deleteCategory(prevCategories, categoryId));
    // Also remove all tasks in this category
    setTasks(prevTasks => prevTasks.filter(task => task.categoryId !== categoryId));
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        ...preferences,
      },
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        categories,
        tasks,
        addNewTask,
        removeTask,
        addNewCategory,
        removeCategory,
        updateUserPreferences,
        isAuthenticated,
        logout,
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