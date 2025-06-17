import React, { createContext, useContext, useState } from 'react';

interface SavingsContextType {
  currentSavings: number;
  setCurrentSavings: (amount: number) => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSavings, setCurrentSavings] = useState(0);

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