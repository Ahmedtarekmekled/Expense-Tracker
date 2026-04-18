import { ExpenseCategory, IncomeCategory } from '../types';
import { colors } from './theme';

export interface CategoryItem<T> {
  id: T;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryItem<ExpenseCategory>[] = [
  { id: 'Food', label: 'Food', icon: 'food-fork-drink', color: '#FF9F43' },
  { id: 'Transport', label: 'Transport', icon: 'car', color: '#54A0FF' },
  { id: 'Shopping', label: 'Shopping', icon: 'shopping', color: '#5F27CD' },
  { id: 'Bills', label: 'Bills', icon: 'lightning-bolt', color: '#FF6B6B' },
  { id: 'Health', label: 'Health', icon: 'heart-pulse', color: '#EE5253' },
  { id: 'Entertainment', label: 'Entertainment', icon: 'gamepad-variant', color: '#00D2D3' },
  { id: 'Other', label: 'Other', icon: 'dots-horizontal', color: colors.textMuted },
];

export const INCOME_CATEGORIES: CategoryItem<IncomeCategory>[] = [
  { id: 'Salary', label: 'Salary', icon: 'briefcase', color: colors.income },
  { id: 'Freelance', label: 'Freelance', icon: 'laptop', color: '#48DBFB' },
  { id: 'Gift', label: 'Gift', icon: 'gift', color: '#F368E0' },
  { id: 'Other', label: 'Other', icon: 'plus-circle', color: colors.textMuted },
];
