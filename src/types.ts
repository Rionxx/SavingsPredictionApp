export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'INVALID_INPUT' | 'USERNAME_EXISTS' | 'EMAIL_EXISTS' | 'INVALID_PASSWORD' | 'INVALID_EMAIL';
  message: string;
}

export interface SavingsData {
  date: string;
  amount: number;
}

export interface PredictionResult {
  predictedAmount: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
} 