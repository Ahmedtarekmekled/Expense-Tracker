import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CURRENCIES = ['$', '€', '£', '₺', '﷼'];

const OnboardingScreen = () => {
  const { updateProfile } = useAppContext();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('$');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const nextStep = () => {
    if (step === 0 && !name.trim()) return;
    
    Animated.timing(slideAnim, {
      toValue: -(step + 1) * width,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setStep(step + 1));
  };

  const finish = async () => {
    await updateProfile({
      name: name.trim(),
      currency,
      isOnboarded: true,
    });
  };

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="account-outline" size={40} color={colors.accent} />
      </View>
      <Text style={styles.title}>What's your name?</Text>
      <Text style={styles.subtitle}>Let's personalize your expense tracking experience.</Text>
      
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={colors.textMuted}
        autoFocus
      />
      
      <TouchableOpacity 
        style={[styles.button, !name.trim() && styles.buttonDisabled]} 
        onPress={nextStep}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="currency-usd" size={40} color={colors.accent} />
      </View>
      <Text style={styles.title}>Choose Currency</Text>
      <Text style={styles.subtitle}>Select the primary currency you'll use for tracking.</Text>
      
      <View style={styles.currencyGrid}>
        {CURRENCIES.map((symbol) => (
          <TouchableOpacity
            key={symbol}
            style={[
              styles.currencyCard,
              currency === symbol && styles.currencyCardActive,
            ]}
            onPress={() => setCurrency(symbol)}
          >
            <Text style={[
              styles.currencySymbol,
              currency === symbol && styles.currencySymbolActive
            ]}>
              {symbol}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={finish}>
        <Text style={styles.buttonText}>Get Started</Text>
        <MaterialCommunityIcons name="check" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(step + 1) * 50}%` }]} />
          </View>
        </View>

        <Animated.View 
          style={[
            styles.slides, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {renderStep0()}
          {renderStep1()}
        </Animated.View>
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
    padding: spacing.xl,
    alignItems: 'center',
  },
  progressContainer: {
    height: 4,
    width: 100,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  slides: {
    flexDirection: 'row',
    width: width * 2,
    flex: 1,
  },
  stepContainer: {
    width: width,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.displayLarge,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    color: colors.text,
    ...typography.displayMedium,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.full,
    gap: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.bodyLarge,
    color: '#FFF',
    fontFamily: 'DMSans_700Bold',
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  currencyCard: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyCardActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  currencySymbol: {
    ...typography.displayMedium,
    fontSize: 28,
    color: colors.text,
  },
  currencySymbolActive: {
    color: '#FFF',
  },
});

export default OnboardingScreen;
