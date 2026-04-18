import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { SummaryBar } from '../components/SummaryBar';
import { filterByPeriod, groupByCategory, getTopCategory, calcTotal } from '../utils/calculations';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';

type Period = 'week' | 'month' | 'all';

const SummaryScreen = () => {
  const { transactions, profile } = useAppContext();
  const [period, setPeriod] = useState<Period>('month');

  const filteredData = useMemo(() => filterByPeriod(transactions, period), [transactions, period]);

  const stats = useMemo(() => {
    const income = calcTotal(filteredData, 'income');
    const expenses = calcTotal(filteredData, 'expense');
    const balance = income - expenses;

    const expenseGroups = groupByCategory(filteredData, 'expense');
    const sortedExpenses = Object.entries(expenseGroups)
      .sort(([, a], [, b]) => b - a)
      .map(([catId, amount]) => {
        const info = EXPENSE_CATEGORIES.find((c) => c.id === catId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
        return { ...info, amount };
      });

    const incomeGroups = groupByCategory(filteredData, 'income');
    const sortedIncome = Object.entries(incomeGroups)
      .sort(([, a], [, b]) => b - a)
      .map(([catId, amount]) => {
        const info = INCOME_CATEGORIES.find((c) => c.id === catId) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
        return { ...info, amount };
      });

    const topExpense = getTopCategory(filteredData, 'expense');
    const topIncome = getTopCategory(filteredData, 'income');

    return {
      income,
      expenses,
      balance,
      sortedExpenses,
      sortedIncome,
      topExpense,
      topIncome,
    };
  }, [filteredData]);

  const renderPeriodFilter = () => (
    <View style={styles.filterBar}>
      {(['week', 'month', 'all'] as const).map((p) => (
        <TouchableOpacity
          key={p}
          style={[
            styles.filterButton,
            period === p && styles.filterButtonActive,
          ]}
          onPress={() => setPeriod(p)}
        >
          <Text
            style={[
              styles.filterText,
              period === p && styles.filterTextActive,
            ]}
          >
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderPeriodFilter()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[styles.summaryBalance, { color: stats.balance >= 0 ? colors.income : colors.expense }]}>
            {stats.balance < 0 ? '-' : ''}{formatCurrency(stats.balance, profile.currency)}
          </Text>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.miniLabel}>Income</Text>
              <Text style={styles.miniAmountIncome}>{formatCurrency(stats.income, profile.currency)}</Text>
            </View>
            <View style={styles.miniDivider} />
            <View>
              <Text style={styles.miniLabel}>Expenses</Text>
              <Text style={styles.miniAmountExpense}>{formatCurrency(stats.expenses, profile.currency)}</Text>
            </View>
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses by Category</Text>
          {stats.sortedExpenses.length > 0 ? (
            stats.sortedExpenses.map((item) => (
              <SummaryBar
                key={item.id}
                label={item.label}
                amount={item.amount}
                total={stats.expenses}
                color={item.color}
                icon={item.icon}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No expenses in this period</Text>
          )}
        </View>

        {/* Income Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income by Source</Text>
          {stats.sortedIncome.length > 0 ? (
            stats.sortedIncome.map((item) => (
              <SummaryBar
                key={item.id}
                label={item.label}
                amount={item.amount}
                total={stats.income}
                color={item.color}
                icon={item.icon}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No income in this period</Text>
          )}
        </View>

        {/* Top Callouts */}
        {(stats.topExpense || stats.topIncome) && (
          <View style={styles.calloutContainer}>
            {stats.topExpense && (
              <View style={styles.callout}>
                <Text style={styles.calloutLabel}>Biggest Expense</Text>
                <Text style={styles.calloutValue}>
                  {stats.topExpense.category} — {formatCurrency(stats.topExpense.amount, profile.currency)}
                </Text>
              </View>
            )}
            {stats.topIncome && (
              <View style={styles.callout}>
                <Text style={styles.calloutLabel}>Top Income Source</Text>
                <Text style={styles.calloutValue}>
                  {stats.topIncome.category} — {formatCurrency(stats.topIncome.amount, profile.currency)}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  summaryBalance: {
    ...typography.displayLarge,
    fontSize: 32,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  miniLabel: {
    ...typography.labelMedium,
    color: colors.textMuted,
    textAlign: 'center',
  },
  miniAmountIncome: {
    ...typography.bodyLarge,
    color: colors.income,
    fontFamily: 'DMSans_700Bold',
  },
  miniAmountExpense: {
    ...typography.bodyLarge,
    color: colors.expense,
    fontFamily: 'DMSans_700Bold',
  },
  miniDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.displayMedium,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  calloutContainer: {
    gap: spacing.md,
  },
  callout: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  calloutLabel: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: 2,
  },
  calloutValue: {
    ...typography.bodyLarge,
    color: colors.text,
    fontFamily: 'DMSans_700Bold',
  },
});

export default SummaryScreen;
