export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    compactView: boolean;
  }
}