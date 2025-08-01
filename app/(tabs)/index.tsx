import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, PirataOne_400Regular } from '@expo-google-fonts/pirata-one';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors, gradients } from '@/constants/colors';
import { APIWarmingService } from '@/services/apiWarming';
import { useGame } from '@/context/GameContext';

// Componente animado para tarjetas de menú
interface AnimatedMenuCardProps {
  title: string;
  description: string;
  buttonTitle: string;
  buttonVariant: 'primary' | 'secondary' | 'success' | 'danger';
  onPress: () => void;
  delay: number;
}

function AnimatedMenuCard({ title, description, buttonTitle, buttonVariant, onPress, delay }: AnimatedMenuCardProps) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, slideAnim, opacityAnim, scaleAnim]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ]
      }}
    >
      <Card style={styles.menuCard}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          <Button
            title={buttonTitle}
            onPress={onPress}
            variant={buttonVariant}
            size="large"
          />
        </View>
      </Card>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { loading } = useGame();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  const [fontsLoaded] = useFonts({
    'PirataOne-Regular': PirataOne_400Regular,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // 🔥 WARMING TEMPRANO: Despertar API cuando el usuario llegar al menú principal
  useEffect(() => {
    console.log('🏠 Usuario en pantalla principal - iniciando warming temprano...');
    // Dar tiempo a que la app se cargue, luego despertar API
    const timer = setTimeout(() => {
      APIWarmingService.wakeUpAPIForGame();
    }, 3000); // 3 segundos después de cargar

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded && !loading) {
      Animated.sequence([
        Animated.delay(200),
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
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [fontsLoaded, loading, fadeAnim, slideAnim, scaleAnim]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} />
      </View>
    );
  }

  return (
    <LinearGradient colors={gradients.pirate as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header con animación */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <Text style={styles.title}>🏴‍☠️ Trivia Nakama</Text>
            <Text style={styles.subtitle}>¡Pon a prueba tu conocimiento pirata!</Text>
          </Animated.View>

          {/* Main Menu Cards con animación */}
          <View style={styles.menuContainer}>
            <AnimatedMenuCard
              title="⚔️ Modo Aventura"
              description="Avanza saga por saga desbloqueando nuevos desafíos"
              buttonTitle="Comenzar Aventura"
              buttonVariant="primary"
              onPress={() => router.push('/(tabs)/story')}
              delay={300}
            />

            <AnimatedMenuCard
              title="🎯 Modo Personalizado"
              description="Personaliza tu experiencia de juego"
              buttonTitle="Juego Personalizado"
              buttonVariant="secondary"
              onPress={() => router.push('/(tabs)/free-mode')}
              delay={600}
            />
          </View>

          {/* Footer con animación */}
          <Animated.View 
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.footerText}>
              "¡Voy a ser el Rey de los Piratas!" - Monkey D. Luffy
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PirataOne-Regular',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    gap: 16,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  cardContent: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});