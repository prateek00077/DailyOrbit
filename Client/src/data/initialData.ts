import { Category, Task, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  preferences: {
    darkMode: false,
    notifications: true,
    compactView: false,
  }
};

export const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Work',
    icon: 'briefcase',
    color: '#4F46E5', // indigo
  },
  {
    id: '2',
    name: 'Personal',
    icon: 'user',
    color: '#0D9488', // teal
  },
  {
    id: '3',
    name: 'Health',
    icon: 'heart',
    color: '#F97316', // orange
  },
  {
    id: '4',
    name: 'Learning',
    icon: 'book-open',
    color: '#8B5CF6', // violet
  },
];

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal for the client meeting',
    completed: false,
    createdAt: new Date(2025, 0, 15).toISOString(),
    categoryId: '1', // Work
  },
  {
    id: '2',
    title: 'Team meeting',
    description: 'Weekly team sync to discuss progress and blockers',
    completed: true,
    createdAt: new Date(2025, 0, 16).toISOString(),
    categoryId: '1', // Work
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Buy groceries for the week',
    completed: false,
    createdAt: new Date(2025, 0, 17).toISOString(),
    categoryId: '2', // Personal
  },
  {
    id: '4',
    title: 'Morning jog',
    description: 'Run for 30 minutes in the park',
    completed: false,
    createdAt: new Date(2025, 0, 18).toISOString(),
    categoryId: '3', // Health
  },
  {
    id: '5',
    title: 'Read React documentation',
    description: 'Study the new React features and hooks',
    completed: false,
    createdAt: new Date(2025, 0, 19).toISOString(),
    categoryId: '4', // Learning
  },
  {
    id: '6',
    title: 'Doctor appointment',
    description: 'Annual health checkup',
    completed: false,
    createdAt: new Date(2025, 0, 20).toISOString(),
    categoryId: '3', // Health
  },
];

// Helper functions for data manipulation
// Note: These functions simulate backend operations

export const generateId = (): string => uuidv4();

// These functions will be replaced with actual API calls in the future
export const addTask = (tasks: Task[], newTask: Omit<Task, 'id' | 'createdAt'>): Task[] => {
  const task: Task = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...newTask,
  };
  return [...tasks, task];
};

export const deleteTask = (tasks: Task[], taskId: string): Task[] => {
  return tasks.filter(task => task.id !== taskId);
};

export const addCategory = (categories: Category[], newCategory: Omit<Category, 'id'>): Category[] => {
  const category: Category = {
    id: generateId(),
    ...newCategory,
  };
  return [...categories, category];
};

export const deleteCategory = (categories: Category[], categoryId: string): Category[] => {
  return categories.filter(category => category.id !== categoryId);
};