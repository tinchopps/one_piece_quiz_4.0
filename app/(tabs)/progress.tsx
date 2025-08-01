import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, Target, Clock, Zap, Award, Star, Crown, Medal } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors, gradients } from '@/constants/colors';
import { SAGA_EMOJIS } from '@/constants/sagas';
import { useGame } from '@/context/GameContext';

// Definición de logros
const ACHIEVEMENTS = [
  {
    id: 'first_victory',
    title: '🏆 Primera Victoria',
    description: 'Responde tu primera pregunta correctamente',
    icon: <Trophy size={20} color={Colors.secondary} />,
    requirement: (stats: any) => stats.totalCorrectAnswers >= 1,
    rarity: 'common'
  },
  {
    id: 'streak_master',
    title: '🔥 Maestro de Rachas',
    description: 'Consigue una racha de 5 respuestas correctas',
    icon: <Zap size={20} color={Colors.accent} />,
    requirement: (stats: any) => stats.bestStreak >= 5,
    rarity: 'rare'
  },
  {
    id: 'accuracy_expert',
    title: '🎯 Experto en Precisión',
    description: 'Mantén una precisión del 80% o más',
    icon: <Target size={20} color={Colors.success} />,
    requirement: (stats: any) => stats.totalQuestionsAnswered > 0 && (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) >= 0.8,
    rarity: 'epic'
  },
  {
    id: 'saga_master',
    title: '👑 Rey de las Sagas',
    description: 'Completa todas las sagas disponibles',
    icon: <Crown size={20} color={Colors.secondary} />,
    requirement: (stats: any, sagas: any) => sagas.filter((s: any) => s.completed).length === sagas.length,
    rarity: 'legendary'
  },
  {
    id: 'speed_demon',
    title: '⚡ Demonio de la Velocidad',
    description: 'Responde 50 preguntas en total',
    icon: <Medal size={20} color={Colors.primary} />,
    requirement: (stats: any) => stats.totalQuestionsAnswered >= 50,
    rarity: 'epic'
  },
  {
    id: 'dedicated_pirate',
    title: '🌟 Pirata Dedicado',
    description: 'Juega durante más de 30 minutos',
    icon: <Star size={20} color={Colors.accent} />,
    requirement: (stats: any) => stats.timeSpent >= 1800000, // 30 minutos en ms
    rarity: 'rare'
  }
];

// Componente para logros
interface AchievementItemProps {
  achievement: any;
  isUnlocked: boolean;
  delay: number;
}

function AchievementItem({ achievement, isUnlocked, delay }: AchievementItemProps) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
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
  }, [delay]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return Colors.secondary;
      default: return '#6B7280';
    }
  };

  return (
    <Animated.View
      style={[
        styles.achievementItem,
        {
          opacity: opacityAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        },
        isUnlocked ? styles.achievementUnlocked : styles.achievementLocked
      ]}
    >
      <View style={[styles.achievementIcon, { backgroundColor: getRarityColor(achievement.rarity) + '20' }]}>
        {achievement.icon}
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, !isUnlocked && styles.lockedText]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, !isUnlocked && styles.lockedText]}>
          {achievement.description}
        </Text>
        <Text style={[styles.achievementRarity, { color: getRarityColor(achievement.rarity) }]}>
          {achievement.rarity.toUpperCase()}
        </Text>
      </View>
      {isUnlocked && (
        <View style={styles.achievementBadge}>
          <Award size={16} color={Colors.secondary} />
        </View>
      )}
    </Animated.View>
  );
}

// Componente animado para estadísticas mejoradas
interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
  color?: string;
}

function StatItem({ icon, value, label, delay, color = Colors.primary }: StatItemProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(animValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, animValue, scaleValue]);

  return (
    <Animated.View 
      style={[
        styles.statItem,
        {
          opacity: animValue,
          transform: [{ scale: scaleValue }]
        }
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// Componente animado para elementos de saga mejorado
interface AnimatedSagaItemProps {
  saga: any;
  accuracy: number;
  delay: number;
}

function AnimatedSagaItem({ saga, accuracy, delay }: AnimatedSagaItemProps) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, slideAnim, opacityAnim, scaleAnim]);

  const getRankColor = (accuracy: number) => {
    if (accuracy >= 90) return Colors.secondary;
    if (accuracy >= 80) return Colors.success;
    if (accuracy >= 70) return Colors.accent;
    return Colors.text.secondary;
  };

  const getRankTitle = (accuracy: number) => {
    if (accuracy >= 90) return 'Maestro';
    if (accuracy >= 80) return 'Experto';
    if (accuracy >= 70) return 'Competente';
    if (accuracy >= 50) return 'Novato';
    return 'Aprendiz';
  };

  return (
    <Animated.View 
      style={[
        styles.sagaProgressItem,
        {
          opacity: opacityAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.sagaProgressHeader}>
        <View style={styles.sagaInfo}>
          <Text style={styles.sagaEmoji}>
            {SAGA_EMOJIS[saga.id] || '🌊'}
          </Text>
          <View style={styles.sagaTextInfo}>
            <Text style={styles.sagaName}>{saga.name}</Text>
            <Text style={styles.sagaStats}>
              {saga.unlocked ? (
                saga.questionsAnswered > 0 ? 
                  `${saga.correctAnswers}/${saga.questionsAnswered} preguntas` : 
                  'Sin intentos'
              ) : '🔒 Bloqueada'}
            </Text>
            {saga.unlocked && saga.questionsAnswered > 0 && (
              <Text style={[styles.sagaRank, { color: getRankColor(accuracy) }]}>
                {getRankTitle(accuracy)} - {accuracy.toFixed(1)}%
              </Text>
            )}
          </View>
        </View>
        {saga.bestScore > 0 && (
          <View style={[styles.bestScore, { borderColor: getRankColor(accuracy) }]}>
            <Text style={[styles.bestScoreText, { color: getRankColor(accuracy) }]}>
              {saga.bestScore}/10
            </Text>
          </View>
        )}
      </View>
      
      {saga.unlocked && saga.questionsAnswered > 0 && (
        <View style={styles.progressBarContainer}>
          <ProgressBar progress={accuracy / 100} />
        </View>
      )}
    </Animated.View>
  );
}

export default function ProgressScreen() {
  const { sagas, gameStats, loading } = useGame();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!loading) {
      Animated.stagger(150, [
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [loading, fadeAnim, slideAnim, scaleAnim]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} />
      </View>
    );
  }

  // Cálculos mejorados
  const totalSagas = sagas.length;
  const unlockedSagas = sagas.filter(s => s.unlocked).length;
  const completedSagas = sagas.filter(s => s.completed).length;
  const overallAccuracy = gameStats.totalQuestionsAnswered > 0 
    ? (gameStats.totalCorrectAnswers / gameStats.totalQuestionsAnswered) * 100 
    : 0;

  // Verificar logros desbloqueados
  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
    achievement.requirement(gameStats, sagas)
  );

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getPlayerLevel = () => {
    const totalScore = gameStats.totalCorrectAnswers;
    if (totalScore >= 100) return { level: 5, title: '🏴‍☠️ Rey Pirata' };
    if (totalScore >= 50) return { level: 4, title: '👑 Capitán' };
    if (totalScore >= 25) return { level: 3, title: '⚔️ Guerrero' };
    if (totalScore >= 10) return { level: 2, title: '🗡️ Espadachín' };
    return { level: 1, title: '🚢 Grumete' };
  };

  const playerInfo = getPlayerLevel();

  return (
    <LinearGradient colors={gradients.pirate as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header mejorado */}
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
            <Text style={styles.title}>📊 Tu Progreso Pirata</Text>
            <Text style={styles.subtitle}>
              {playerInfo.title} - Nivel {playerInfo.level}
            </Text>
            <Text style={styles.achievementCount}>
              🏆 {unlockedAchievements.length}/{ACHIEVEMENTS.length} Logros
            </Text>
          </Animated.View>

          {/* Estadísticas principales mejoradas */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <Card style={styles.overallCard}>
              <Text style={styles.cardTitle}>📈 Estadísticas Generales</Text>
              <View style={styles.statsGrid}>
                <StatItem
                  icon={<Trophy size={24} color={Colors.secondary} />}
                  value={`${completedSagas}/${totalSagas}`}
                  label="Sagas Completadas"
                  color={Colors.secondary}
                  delay={100}
                />
                
                <StatItem
                  icon={<Target size={24} color={Colors.success} />}
                  value={`${overallAccuracy.toFixed(1)}%`}
                  label="Precisión Global"
                  color={Colors.success}
                  delay={200}
                />
                
                <StatItem
                  icon={<Zap size={24} color={Colors.accent} />}
                  value={gameStats.bestStreak.toString()}
                  label="Mejor Racha"
                  color={Colors.accent}
                  delay={300}
                />
                
                <StatItem
                  icon={<Clock size={24} color={Colors.primary} />}
                  value={formatTime(gameStats.timeSpent)}
                  label="Tiempo Jugado"
                  color={Colors.primary}
                  delay={400}
                />
              </View>

              {/* Estadísticas adicionales */}
              <View style={styles.additionalStats}>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Juegos Jugados:</Text>
                  <Text style={styles.statRowValue}>{gameStats.totalGamesPlayed}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Preguntas Respondidas:</Text>
                  <Text style={styles.statRowValue}>{gameStats.totalQuestionsAnswered}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Respuestas Correctas:</Text>
                  <Text style={styles.statRowValue}>{gameStats.totalCorrectAnswers}</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Sección de Logros */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <Card>
              <Text style={styles.cardTitle}>🏆 Logros Desbloqueados</Text>
              <View style={styles.achievementsList}>
                {ACHIEVEMENTS.map((achievement, index) => {
                  const isUnlocked = achievement.requirement(gameStats, sagas);
                  return (
                    <AchievementItem
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      delay={500 + (index * 100)}
                    />
                  );
                })}
              </View>
            </Card>
          </Animated.View>

          {/* Progress by Saga mejorado */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <Card>
              <Text style={styles.cardTitle}>🌊 Progreso por Saga</Text>
              <View style={styles.sagasList}>
                {sagas.map((saga, index) => {
                  const accuracy = saga.questionsAnswered > 0 
                    ? (saga.correctAnswers / saga.questionsAnswered) * 100 
                    : 0;

                  return (
                    <AnimatedSagaItem
                      key={saga.id}
                      saga={saga}
                      accuracy={accuracy}
                      delay={800 + (index * 150)}
                    />
                  );
                })}
              </View>
            </Card>
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
  overallCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statRowLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
  },
  statRowValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  sagasList: {
    gap: 16,
  },
  sagaProgressItem: {
    gap: 8,
  },
  sagaProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sagaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sagaEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  sagaTextInfo: {
    flex: 1,
  },
  sagaName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  sagaStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  bestScore: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestScoreText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.secondary,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  // Nuevos estilos agregados
  achievementCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.secondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  additionalStats: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border + '30',
  },
  // Estilos de logros
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  achievementUnlocked: {
    backgroundColor: Colors.background + '80',
    borderColor: Colors.secondary + '40',
  },
  achievementLocked: {
    backgroundColor: Colors.text.secondary + '10',
    borderColor: Colors.text.secondary + '20',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  achievementRarity: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    opacity: 0.5,
  },
  sagaRank: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});