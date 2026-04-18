import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../constants/theme';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { CategoryPill } from '../components/CategoryPill';
import { useAppContext } from '../context/AppContext';
import { TransactionType } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type AddTransactionRouteProp = RouteProp<RootStackParamList, 'AddTransaction'>;

const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddTransactionRouteProp>();
  const { addTransaction, editTransaction, transactions, profile } = useAppContext();

  const transactionId = route.params?.transactionId;
  const isEditing = !!transactionId;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (isEditing && transactionId) {
      const tx = transactions.find((t) => t.id === transactionId);
      if (tx) {
        setType(tx.type);
        setAmount(tx.amount.toString());
        setSelectedCategory(tx.category);
        setNote(tx.note || '');
        setDate(new Date(tx.date));
      }
    }
  }, [isEditing, transactionId, transactions]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      if (isEditing && transactionId) {
        await editTransaction(transactionId, {
          type,
          amount: parseFloat(amount),
          category: selectedCategory as any,
          note: note.trim(),
          date: date.toISOString(),
        });
      } else {
        await addTransaction({
          type,
          amount: parseFloat(amount),
          category: selectedCategory as any,
          note: note.trim(),
          date: date.toISOString(),
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const toggleType = (newType: TransactionType) => {
    setType(newType);
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Type Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                type === 'expense' && styles.activeToggleExpense,
              ]}
              onPress={() => toggleType('expense')}
            >
              <Text style={[styles.toggleText, type === 'expense' && styles.activeToggleText]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                type === 'income' && styles.activeToggleIncome,
              ]}
              onPress={() => toggleType('income')}
            >
              <Text style={[styles.toggleText, type === 'income' && styles.activeToggleText]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>{profile.currency}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              autoFocus={!isEditing}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  label={cat.label}
                  icon={cat.icon}
                  color={cat.color}
                  selected={selectedCategory === cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Note Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional)"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>

          {/* Date Selector (Simplified) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date</Text>
            <TouchableOpacity style={styles.datePickerButton} disabled>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.accent} />
              <Text style={styles.dateText}>
                {isEditing ? date.toLocaleDateString() : 'Today'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || !selectedCategory) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!amount || !selectedCategory}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Transaction' : 'Save Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    position: 'relative',
  },
  title: {
    ...typography.displayMedium,
    color: colors.text,
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: spacing.xl,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  activeToggleExpense: {
    backgroundColor: colors.expense,
  },
  activeToggleIncome: {
    backgroundColor: colors.income,
  },
  toggleText: {
    ...typography.labelMedium,
    color: colors.textMuted,
    fontSize: 14,
  },
  activeToggleText: {
    color: '#FFFFFF',
    fontFamily: 'DMSans_700Bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  currencySymbol: {
    ...typography.displayLarge,
    color: colors.text,
    marginRight: spacing.xs,
  },
  amountInput: {
    ...typography.displayLarge,
    color: colors.text,
    minWidth: 100,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  categoriesScroll: {
    paddingRight: spacing.xl,
  },
  noteInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    ...typography.bodyLarge,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  dateText: {
    ...typography.bodyLarge,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.surfaceElevated,
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    color: '#FFFFFF',
    fontFamily: 'DMSans_700Bold',
  },
});

export default AddTransactionScreen;
