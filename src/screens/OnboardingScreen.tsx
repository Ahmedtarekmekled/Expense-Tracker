import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
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

// Animated Pixel Background component to simulate the "Pixel Blast" effect in React Native
const PixelBackground = () => {
  const pixels = Array.from({ length: 40 }).map(() => ({
    id: Math.random().toString(),
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 10 + 4,
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
  }));

  useEffect(() => {
    const animations = pixels.map((p, i) => {
      const animate = () => {
        Animated.sequence([
          Animated.delay(Math.random() * 4000),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: Math.random() * 0.4 + 0.1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(p.scale, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(p.scale, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animate());
      };
      animate();
      return null;
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {pixels.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.pixel,
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              transform: [{ scale: p.scale }],
            },
          ]}
        />
      ))}
    </View>
  );
};

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
    <ScrollView 
      style={styles.stepContainer} 
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
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
        selectionColor={colors.accent}
      />
      
      <TouchableOpacity 
        style={[styles.button, !name.trim() && styles.buttonDisabled]} 
        onPress={nextStep}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep1 = () => (
    <ScrollView 
      style={styles.stepContainer} 
      contentContainerStyle={styles.stepContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="currency-usd" size={40} color={colors.accent} />
      </View>
      <Text style={styles.title}>Choose Currency</Text>
      <Text style={styles.subtitle}>Select the primary currency you'll use for tracking.</Text>
      
      <View style={styles.currencyGrid}>
        {CURRENCIES.map((item) => (
          <TouchableOpacity
            key={item.code}
            style={[
              styles.currencyCard,
              currency === item.symbol && styles.currencyCardActive,
            ]}
            onPress={() => setCurrency(item.symbol)}
          >
            <Text style={[
              styles.currencySymbol,
              currency === item.symbol && styles.currencySymbolActive
            ]}>
              {item.symbol}
            </Text>
            <Text style={[
              styles.currencyCode,
              currency === item.symbol && styles.currencyCodeActive
            ]}>
              {item.code}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={finish}>
        <Text style={styles.buttonText}>Get Started</Text>
        <MaterialCommunityIcons name="check" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <PixelBackground />
      <SafeAreaView style={{ flex: 1 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pixel: {
    position: 'absolute',
    backgroundColor: colors.accent,
    borderRadius: 2,
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
  },
  stepContent: {
    padding: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xxl,
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
    color: colors.text,
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
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  currencyCard: {
    width: (width - spacing.xl * 2 - spacing.sm * 3) / 4,
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyCardActive: {
    backgroundColor: 'rgba(46, 207, 168, 0.15)',
    borderColor: colors.income,
  },
  currencySymbol: {
    ...typography.displayMedium,
    fontSize: 24,
    color: colors.text,
  },
  currencySymbolActive: {
    color: colors.income,
  },
  currencyCode: {
    ...typography.labelMedium,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  currencyCodeActive: {
    color: colors.income,
  },
});

export default OnboardingScreen;
