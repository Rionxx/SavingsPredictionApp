export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  tags?: string[];
  receiptImage?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  category: 'housing' | 'emergency' | 'vacation' | 'education' | 'retirement' | 'other';
}

export interface PredictionData {
  period: 'short' | 'medium' | 'long';
  months: number;
  predictedAmount: number;
  confidence: number;
  factors: string[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  color: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'achievement' | 'advice';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  savingsGoal: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface ComparisonData {
  category: string;
  userAmount: number;
  averageAmount: number;
  percentile: number;
}

export interface User {
  id: string;
  username: string;
  password: string; // 実際のアプリケーションではハッシュ化されたパスワードを保存
  email: string;
  createdAt: string;
}

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'INVALID_INPUT';
  message: string;
}