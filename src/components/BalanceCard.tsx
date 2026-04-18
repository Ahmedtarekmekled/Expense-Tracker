import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../context/AppContext';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, income, expenses }) => {
  const { profile } = useAppContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.label}>Total Balance</Text>
      <Text
        style={[
          styles.balance,
          { color: balance >= 0 ? colors.income : colors.expense },
        ]}
      >
        {balance < 0 ? '-' : ''}
        {formatCurrency(balance, profile.currency)}
      </Text>

      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(46, 207, 168, 0.1)' }]}>
            <MaterialCommunityIcons name="arrow-up" size={16} color={colors.income} />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.incomeAmount}>{formatCurrency(income, profile.currency)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={statStyle.stat}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
            <MaterialCommunityIcons name="arrow-down" size={16} color={colors.expense} />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>{formatCurrency(expenses, profile.currency)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  balance: {
    ...typography.displayLarge,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statLabel: {
    ...typography.labelMedium,
    color: colors.textMuted,
  },
  incomeAmount: {
    ...typography.bodyLarge,
    fontFamily: 'DMSans_700Bold',
    color: colors.income,
  },
  expenseAmount: {
    ...typography.bodyLarge,
    fontFamily: 'DMSans_700Bold',
    color: colors.expense,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});

const statStyle = StyleSheet.create({
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    }
})
