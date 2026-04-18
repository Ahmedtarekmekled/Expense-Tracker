import { Transaction, TransactionType } from '../types';

export const calcBalance = (txs: Transaction[]) => {
  return txs.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);
};

export const calcTotal = (txs: Transaction[], type: TransactionType) => {
  return txs.filter((tx) => tx.type === type).reduce((acc, tx) => acc + tx.amount, 0);
};

export const groupByCategory = (txs: Transaction[], type: TransactionType) => {
  return txs
    .filter((tx) => tx.type === type)
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);
};

export const filterByPeriod = (txs: Transaction[], period: 'week' | 'month' | 'all') => {
  if (period === 'all') return txs;
  const now = new Date();
  const cutoff = new Date();
  if (period === 'week') cutoff.setDate(now.getDate() - 7);
  if (period === 'month') cutoff.setMonth(now.getMonth() - 1);
  return txs.filter((tx) => new Date(tx.date) >= cutoff);
};

export const getTopCategory = (txs: Transaction[], type: TransactionType) => {
  const grouped = groupByCategory(txs, type);
  const categories = Object.keys(grouped);
  if (categories.length === 0) return null;

  const top = categories.reduce((a, b) => (grouped[a] > grouped[b] ? a : b));
  return { category: top, amount: grouped[top] };
};
