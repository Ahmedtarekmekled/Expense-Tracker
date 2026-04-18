import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, UserProfile } from '../types';

const STORAGE_KEY = '@expense_tracker_transactions';
const PROFILE_KEY = '@expense_tracker_profile';

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = async (txs: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const loadProfile = async (): Promise<UserProfile> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { name: '', currency: '$', isOnboarded: false };
  } catch (error) {
    console.error('Error loading profile:', error);
    return { name: '', currency: '$', isOnboarded: false };
  }
};

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};
