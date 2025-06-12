import { Transaction, Goal, BudgetCategory, ComparisonData } from '../types';

export const mockTransactions: Transaction[] = [
  // 収入データ
  {
    id: '1',
    type: 'income',
    amount: 350000,
    category: '給与',
    description: '基本給',
    date: '2024-01-25',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '2',
    type: 'income',
    amount: 50000,
    category: '副業',
    description: 'フリーランス収入',
    date: '2024-01-30',
    isRecurring: false
  },
  // 支出データ
  {
    id: '3',
    type: 'expense',
    amount: 80000,
    category: '家賃',
    description: 'マンション家賃',
    date: '2024-01-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '4',
    type: 'expense',
    amount: 45000,
    category: '食費',
    description: '食料品・外食',
    date: '2024-01-15',
    isRecurring: false
  },
  {
    id: '5',
    type: 'expense',
    amount: 15000,
    category: '光熱費',
    description: '電気・ガス・水道',
    date: '2024-01-10',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '6',
    type: 'expense',
    amount: 25000,
    category: '交通費',
    description: '定期券・ガソリン代',
    date: '2024-01-05',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '7',
    type: 'expense',
    amount: 30000,
    category: '娯楽費',
    description: '映画・書籍・趣味',
    date: '2024-01-20',
    isRecurring: false
  },
  // 2月のデータ
  {
    id: '8',
    type: 'income',
    amount: 350000,
    category: '給与',
    description: '基本給',
    date: '2024-02-25',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '9',
    type: 'expense',
    amount: 80000,
    category: '家賃',
    description: 'マンション家賃',
    date: '2024-02-01',
    isRecurring: true,
    recurringFrequency: 'monthly'
  },
  {
    id: '10',
    type: 'expense',
    amount: 52000,
    category: '食費',
    description: '食料品・外食',
    date: '2024-02-15',
    isRecurring: false
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: '住宅購入頭金',
    targetAmount: 2000000,
    currentAmount: 1200000,
    targetDate: '2025-03-31',
    priority: 'high',
    category: 'housing'
  },
  {
    id: '2',
    name: '緊急資金',
    targetAmount: 1000000,
    currentAmount: 650000,
    targetDate: '2024-12-31',
    priority: 'high',
    category: 'emergency'
  },
  {
    id: '3',
    name: '海外旅行',
    targetAmount: 500000,
    currentAmount: 180000,
    targetDate: '2024-08-31',
    priority: 'medium',
    category: 'vacation'
  },
  {
    id: '4',
    name: '車購入資金',
    targetAmount: 1500000,
    currentAmount: 400000,
    targetDate: '2025-06-30',
    priority: 'medium',
    category: 'other'
  }
];

export const mockBudgetCategories: BudgetCategory[] = [
  {
    id: '1',
    name: '食費',
    budgetAmount: 50000,
    spentAmount: 45000,
    color: '#FF6B6B',
    icon: 'utensils'
  },
  {
    id: '2',
    name: '交通費',
    budgetAmount: 30000,
    spentAmount: 25000,
    color: '#4ECDC4',
    icon: 'car'
  },
  {
    id: '3',
    name: '娯楽費',
    budgetAmount: 40000,
    spentAmount: 48000,
    color: '#45B7D1',
    icon: 'gamepad-2'
  },
  {
    id: '4',
    name: '光熱費',
    budgetAmount: 20000,
    spentAmount: 15000,
    color: '#96CEB4',
    icon: 'zap'
  },
  {
    id: '5',
    name: '通信費',
    budgetAmount: 15000,
    spentAmount: 12000,
    color: '#FFEAA7',
    icon: 'smartphone'
  },
  {
    id: '6',
    name: '医療費',
    budgetAmount: 10000,
    spentAmount: 3000,
    color: '#DDA0DD',
    icon: 'heart'
  }
];

export const mockComparisonData: ComparisonData[] = [
  {
    category: '食費',
    userAmount: 45000,
    averageAmount: 52000,
    percentile: 35
  },
  {
    category: '交通費',
    userAmount: 25000,
    averageAmount: 28000,
    percentile: 42
  },
  {
    category: '娯楽費',
    userAmount: 48000,
    averageAmount: 35000,
    percentile: 78
  },
  {
    category: '光熱費',
    userAmount: 15000,
    averageAmount: 18000,
    percentile: 28
  },
  {
    category: '貯金額',
    userAmount: 120000,
    averageAmount: 85000,
    percentile: 82
  }
];