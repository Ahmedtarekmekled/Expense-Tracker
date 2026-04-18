import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  { symbol: '₹', code: 'INR' },
  { symbol: '₪', code: 'ILS' },
  { symbol: '₺', code: 'TRY' },
  { symbol: '﷼', code: 'SAR' },
  { symbol: '₽', code: 'RUB' },
  { symbol: '₩', code: 'KRW' },
  { symbol: 'A$', code: 'AUD' },
  { symbol: 'C$', code: 'CAD' },
];

const SettingsScreen = () => {
  const { profile, updateProfile } = useAppContext();
  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [isSaved, setIsSaved] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({ 
        ...profile,
        name: name.trim(), 
        currency 
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={[
              styles.input,
              isInputFocused && styles.inputFocused
            ]}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyRow}>
            {CURRENCIES.map((item) => {
              const isSelected = currency === item.symbol;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.pill,
                    isSelected ? styles.pillSelected : styles.pillUnselected
                  ]}
                  onPress={() => setCurrency(item.symbol)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pillText,
                    isSelected ? styles.pillTextSelected : styles.pillTextUnselected
                  ]}>
                    {item.symbol}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.debugButton} 
          onPress={async () => {
            await updateProfile({ ...profile, isOnboarded: false });
            Alert.alert('Reset', 'Onboarding has been reset. Please restart the app or reload.');
          }}
        >
          <Text style={styles.debugButtonText}>Reset Onboarding (Debug)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Saved!' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  header: {
    ...typography.displayMedium,
    color: colors.text,
    textAlign: 'left',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.income,
  },
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: 'rgba(46, 207, 168, 0.15)',
    borderColor: colors.income,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 18,
    fontFamily: 'DMSans_500Medium',
  },
  pillTextUnselected: {
    color: colors.textMuted,
  },
  pillTextSelected: {
    color: colors.income,
  },
  saveButton: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.income,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    color: colors.background,
    fontFamily: 'DMSans_700Bold',
  },
  debugButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    alignSelf: 'center',
  },
  debugButtonText: {
    ...typography.labelMedium,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
