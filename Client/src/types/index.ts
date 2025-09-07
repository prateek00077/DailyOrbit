export interface Task {
  _id: string;
  title: string;
  categoryId: string;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  _id: string;
  fullname: string;
  email: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    compactView: boolean;
  }
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'task_shared' | 'task_updated' | 'task_completed' | 'general';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}