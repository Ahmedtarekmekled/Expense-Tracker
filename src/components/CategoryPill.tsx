import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';

interface CategoryPillProps {
  label: string;
  icon: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  icon,
  color,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected ? color : 'transparent',
          borderColor: selected ? color : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={18}
        color={selected ? '#FFFFFF' : colors.textMuted}
      />
      <Text
        style={[
          styles.label,
          { color: selected ? '#FFFFFF' : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.labelMedium,
    marginLeft: spacing.xs,
    fontFamily: 'DMSans_500Medium',
  },
});
