import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { colors, spacing, radius, typography } from '../constants/theme';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AddTransaction: { transactionId?: string };
};

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onDelete,
}) => {
  const { profile } = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isExpense = transaction.type === 'expense';
  
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const categoryInfo = categories.find((c) => c.id === transaction.category) || categories[categories.length - 1];

  const handleEdit = () => {
    navigation.navigate('AddTransaction', { transactionId: transaction.id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      onLongPress={onDelete}
    >
      <View style={[styles.iconContainer, { backgroundColor: categoryInfo.color + '20' }]}>
        <MaterialCommunityIcons
          name={categoryInfo.icon as any}
          size={22}
          color={categoryInfo.color}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.mainRow}>
          <Text style={styles.categoryLabel}>{categoryInfo.label}</Text>
          <View style={styles.rightContent}>
            <Text
              style={[
                styles.amount,
                { color: isExpense ? colors.expense : colors.income },
              ]}
            >
              {isExpense ? '−' : '+'}
              {formatCurrency(transaction.amount, profile.currency)}
            </Text>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.subRow}>
          <Text style={styles.note} numberOfLines={1}>
            {transaction.note || 'No note'}
          </Text>
          <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: spacing.sm,
    padding: 4,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    ...typography.bodyLarge,
    fontFamily: 'DMSans_700Bold',
    color: colors.text,
  },
  amount: {
    ...typography.bodyLarge,
    fontFamily: 'DMSans_700Bold',
  },
  note: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.md,
  },
  date: {
    ...typography.labelMedium,
    color: colors.textMuted,
  },
});
