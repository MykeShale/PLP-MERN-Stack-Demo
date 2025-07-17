export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
} 