import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'testuser',
    password: 'password123', // 実際のアプリケーションではハッシュ化されたパスワードを使用
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'demo',
    password: 'demo123',
    email: 'demo@example.com',
    createdAt: '2024-01-02T00:00:00Z'
  }
]; 