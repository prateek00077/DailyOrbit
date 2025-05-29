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