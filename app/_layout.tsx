import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PirataOne_400Regular } from '@expo-google-fonts/pirata-one';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { GameProvider } from '@/context/GameContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { APIWarmingService } from '@/services/apiWarming';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'PirataOne-Regular': PirataOne_400Regular,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Hook para fonts
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Hook para API Warming - se ejecuta una vez al iniciar la app
  useEffect(() => {
    console.log('🚀 Iniciando API Warming Service mejorado...');
    APIWarmingService.startContinuousWarming();
    
    // Cleanup cuando el componente se desmonte
    return () => {
      APIWarmingService.stopWarming();
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="free-mode" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="results" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}