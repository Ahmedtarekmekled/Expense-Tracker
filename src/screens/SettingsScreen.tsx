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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

const CURRENCIES = ['$', '€', '£', '₺', '﷼'];

const SettingsScreen = () => {
  const { profile, updateProfile } = useAppContext();
  const [name, setName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updateProfile({ name: name.trim(), currency });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          <View style={styles.currencyContainer}>
            {CURRENCIES.map((symbol) => (
              <TouchableOpacity
                key={symbol}
                style={[
                  styles.currencyPill,
                  currency === symbol && styles.currencyPillActive,
                ]}
                onPress={() => setCurrency(symbol)}
              >
                <Text
                  style={[
                    styles.currencyText,
                    currency === symbol && styles.currencyTextActive,
                  ]}
                >
                  {symbol}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isSaved ? 'Saved!' : 'Save Settings'}
          </Text>
        </TouchableOpacity>

        {isSaved && (
          <View style={styles.toast}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.income} />
            <Text style={styles.toastText}>Settings updated successfully</Text>
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
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    color: colors.text,
    ...typography.bodyLarge,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  currencyPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  currencyPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  currencyText: {
    ...typography.displayMedium,
    fontSize: 20,
    color: colors.text,
  },
  currencyTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Syne_700Bold',
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    color: '#FFFFFF',
    fontFamily: 'DMSans_700Bold',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  toastText: {
    ...typography.bodyMedium,
    color: colors.income,
  },
});

export default SettingsScreen;
