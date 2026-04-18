import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { useAppContext } from '../context/AppContext';

interface SummaryBarProps {
  label: string;
  amount: number;
  total: number;
  color: string;
  icon: string;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  label,
  amount,
  total,
  color,
  icon,
}) => {
  const { profile } = useAppContext();
  const percentage = total > 0 ? (amount / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelGroup}>
          <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon as any} size={16} color={color} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.amount}>{formatCurrency(amount, profile.currency)}</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'DMSans_500Medium',
  },
  amount: {
    ...typography.bodyMedium,
    color: colors.text,
    fontFamily: 'DMSans_700Bold',
  },
  track: {
    height: 8,
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
