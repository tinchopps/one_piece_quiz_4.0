import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Target, Clock, RotateCcw, Chrome as Home, ArrowRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors, gradients } from '@/constants/colors';
import { SAGA_EMOJIS } from '@/constants/sagas';
import { useGame } from '@/context/GameContext';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    score: string;
    total: string;
    mode: string;
    sagaId: string;
    timeSpent: string;
  }>();

  const { sagas, endGame } = useGame();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const score = parseInt(params.score);
  const total = parseInt(params.total);
  const timeSpent = parseInt(params.timeSpent);
  const percentage = (score / total) * 100;
  const isPass = percentage >= 70;

  const currentSaga = sagas.find(s => s.id === params.sagaId);
  const sagaName = currentSaga?.name || 'Saga';

  useEffect(() => {
    // Cleanup game state
    endGame();
    
    // Trigger animations
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "¡Increíble! Eres un verdadero nakama 🏴‍☠️";
    if (percentage >= 80) return "¡Excelente! Digno de un futuro Rey Pirata 👑";
    if (percentage >= 70) return "¡Bien hecho! Continúa tu aventura ⚓";
    if (percentage >= 50) return "No está mal, pero puedes mejorar 💪";
    return "Necesitas estudiar más sobre One Piece 📚";
  };

  const handlePlayAgain = () => {
    router.replace({
      pathname: '/quiz',
      params: {
        mode: params.mode,
        sagaId: params.sagaId,
        amount: params.total,
        difficulty: 'mixed',
      },
    });
  };

  const handleNextSaga = () => {
    if (params.mode === 'story') {
      router.replace('/story');
    } else {
      router.replace('/free-mode');
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={gradients.pirate} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View style={[styles.header, animatedStyle]}>
            <Text style={styles.sagaEmoji}>{SAGA_EMOJIS[params.sagaId] || '🌊'}</Text>
            <Text style={styles.title}>
              {isPass ? '🎉 ¡Completado!' : '💪 ¡Intenta de nuevo!'}
            </Text>
            <Text style={styles.subtitle}>
              {sagaName} - {params.mode === 'story' ? 'Modo Historia' : 'Modo Libre'}
            </Text>
          </Animated.View>

          {/* Score Card */}
          <Card style={[styles.scoreCard, isPass ? styles.passCard : styles.failCard]}>
            <View style={styles.scoreHeader}>
              <Trophy size={32} color={isPass ? Colors.success : Colors.warning} />
              <Text style={styles.scoreText}>
                {score} / {total}
              </Text>
            </View>
            <Text style={styles.percentageText}>
              {percentage.toFixed(0)}% de aciertos
            </Text>
            <View style={styles.progressBarContainer}>
              <ProgressBar progress={percentage / 100} height={8} />
            </View>
            <Text style={styles.performanceMessage}>
              {getPerformanceMessage()}
            </Text>
          </Card>

          {/* Stats */}
          <Card>
            <Text style={styles.statsTitle}>Estadísticas de la partida</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Target size={24} color={Colors.primary} />
                <Text style={styles.statValue}>{score}</Text>
                <Text style={styles.statLabel}>Correctas</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={24} color={Colors.secondary} />
                <Text style={styles.statValue}>{formatTime(timeSpent)}</Text>
                <Text style={styles.statLabel}>Tiempo</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={24} color={Colors.success} />
                <Text style={styles.statValue}>{percentage.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Precisión</Text>
              </View>
            </View>
          </Card>

          {/* Actions */}
          <Card>
            <View style={styles.actionsContainer}>
              <Button
                title="Jugar de nuevo"
                onPress={handlePlayAgain}
                variant="primary"
                size="large"
                style={styles.actionButton}
              />
              
              <Button
                title={params.mode === 'story' ? 'Siguiente saga' : 'Nuevo juego'}
                onPress={handleNextSaga}
                variant="success"
                size="large"
                style={styles.actionButton}
              />
              
              <Button
                title="Ir al inicio"
                onPress={handleGoHome}
                variant="secondary"
                size="medium"
                style={styles.actionButton}
              />
            </View>
          </Card>

          {/* Motivational Quote */}
          <View style={styles.footer}>
            <Text style={styles.quote}>
              {isPass 
                ? "¡Un pirata nunca se rinde!" 
                : "Los sueños nunca mueren, ¡sigue intentando!"
              }
            </Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  sagaEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PirataOne-Regular',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
  },
  passCard: {
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
  },
  failCard: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  percentageText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 16,
  },
  performanceMessage: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  footer: {
    marginTop: 32,
    padding: 20,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});