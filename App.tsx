import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts, Syne_700Bold, Syne_600SemiBold } from '@expo-google-fonts/syne';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_700Bold,
    Syne_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const navTheme = {
    dark: true,
    colors: {
      primary: '#7C6FE0',
      background: '#0F0F14',
      card: '#1A1A24',
      text: '#FFFFFF',
      border: '#2A2A3C',
      notification: '#7C6FE0',
    },
    fonts: {
      regular: { fontFamily: 'DMSans_400Regular', fontWeight: '400' as const },
      medium: { fontFamily: 'DMSans_500Medium', fontWeight: '500' as const },
      bold: { fontFamily: 'Syne_700Bold', fontWeight: '700' as const },
      heavy: { fontFamily: 'Syne_700Bold', fontWeight: '900' as const },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <AppProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AppProvider>
    </NavigationContainer>
  );
}
