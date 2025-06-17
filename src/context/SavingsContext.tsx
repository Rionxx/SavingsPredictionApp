import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

interface SavingsContextType {
  currentSavings: number;
  setCurrentSavings: (amount: number) => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

// Calculate initial savings from mockTransactions
const calculateInitialSavings = () => {
  return mockTransactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);
};

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSavings, setCurrentSavings] = useState(calculateInitialSavings());

  return (
    <SavingsContext.Provider value={{ currentSavings, setCurrentSavings }}>
      {children}
    </SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
}; 