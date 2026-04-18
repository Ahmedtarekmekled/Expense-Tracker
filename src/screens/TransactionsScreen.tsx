import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { TransactionItem } from '../components/TransactionItem';
import { TransactionType } from '../types';

const TransactionsScreen = () => {
  const { transactions, deleteTransaction, deleteAllByType } = useAppContext();
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((tx) => tx.type === filter);
  }, [transactions, filter]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (filter === 'all') return;

    const typeLabel = filter === 'expense' ? 'Expenses' : 'Income';
    Alert.alert(
      `Clear all ${typeLabel}`,
      `Are you sure you want to delete all ${typeLabel.toLowerCase()}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => deleteAllByType(filter),
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Transactions</Text>
      {filter !== 'all' && (
        <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterBar = () => (
    <View style={styles.filterBar}>
      {(['all', 'expense', 'income'] as const).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            filter === type && styles.filterButtonActive,
          ]}
          onPress={() => setFilter(type)}
        >
          <Text
            style={[
              styles.filterText,
              filter === type && styles.filterTextActive,
            ]}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFilterBar()}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="history"
              size={64}
              color={colors.surfaceElevated}
            />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.displayMedium,
    color: colors.text,
    fontSize: 24,
  },
  clearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearButtonText: {
    ...typography.labelMedium,
    color: colors.expense,
    fontFamily: 'DMSans_700Bold',
  },
  filterBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    ...typography.labelMedium,
    color: colors.textMuted,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontFamily: 'DMSans_700Bold',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});

export default TransactionsScreen;
