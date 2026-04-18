import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { AppContextType, Transaction, UserProfile, TransactionType } from '../types';
import { loadTransactions, saveTransactions, loadProfile, saveProfile } from '../storage/storage';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', currency: '$' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [storedTxs, storedProfile] = await Promise.all([
        loadTransactions(),
        loadProfile(),
      ]);
      setTransactions(storedTxs);
      setProfile(storedProfile);
      setIsLoading(false);
    };
    init();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const editTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    const updated = transactions.map((tx) => 
      tx.id === id ? { ...tx, ...updates } : tx
    );
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const deleteAllByType = async (type: TransactionType) => {
    const updated = transactions.filter((tx) => tx.type !== type);
    setTransactions(updated);
    await saveTransactions(updated);
  };

  const updateProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveProfile(newProfile);
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'income')
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const value: AppContextType = {
    transactions,
    profile,
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteAllByType,
    updateProfile,
    totalIncome,
    totalExpenses,
    balance,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppContext };
