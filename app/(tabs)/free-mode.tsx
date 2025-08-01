import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors, gradients } from '@/constants/colors';
import { SAGA_EMOJIS } from '@/constants/sagas';
import { useGame } from '@/context/GameContext';

export default function FreeModeScreen() {
  const { sagas } = useGame();
  const [selectedSaga, setSelectedSaga] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(50)).current;
  const card2Anim = useRef(new Animated.Value(50)).current;
  const card3Anim = useRef(new Animated.Value(50)).current;
  const card4Anim = useRef(new Animated.Value(50)).current;

  const unlockedSagas = sagas.filter(saga => saga.unlocked);

  useEffect(() => {
    // Iniciar animaciones al cargar
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        // Header animation
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
      ]),
      // Cards animation con stagger
      Animated.stagger(200, [
        Animated.timing(card1Anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(card2Anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(card3Anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(card4Anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  }, []);

  const handleStartGame = () => {
    if (!selectedSaga) return;

    router.push({
      pathname: '/quiz',
      params: {
        mode: 'free',
        sagaId: selectedSaga,
        amount: selectedAmount.toString(),
        difficulty: selectedDifficulty,
      },
    });
  };

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
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.title}>🎯 Modo Libre</Text>
            <Text style={styles.subtitle}>Personaliza tu experiencia de juego</Text>
          </Animated.View>

          {/* Saga Selection con animación */}
          <Animated.View style={{ transform: [{ translateY: card1Anim }], opacity: fadeAnim }}>
            <Card>
              <Text style={styles.sectionTitle}>Selecciona una Saga</Text>
              <View style={styles.optionsGrid}>
                {unlockedSagas.map((saga) => (
                  <Button
                    key={saga.id}
                    title={`${SAGA_EMOJIS[saga.id] || '🌊'} ${saga.name}`}
                    onPress={() => setSelectedSaga(saga.id)}
                    variant={selectedSaga === saga.id ? 'primary' : 'secondary'}
                    size="medium"
                    style={styles.optionButton}
                  />
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Amount Selection con animación */}
          <Animated.View style={{ transform: [{ translateY: card2Anim }], opacity: fadeAnim }}>
            <Card>
              <Text style={styles.sectionTitle}>Cantidad de Preguntas</Text>
              <View style={styles.optionsGrid}>
                {[1, 3, 5, 10].map((amount) => (
                  <Button
                    key={amount}
                    title={amount.toString()}
                    onPress={() => setSelectedAmount(amount)}
                    variant={selectedAmount === amount ? 'primary' : 'secondary'}
                    size="medium"
                    style={styles.smallOptionButton}
                  />
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Difficulty Selection con animación */}
          <Animated.View style={{ transform: [{ translateY: card3Anim }], opacity: fadeAnim }}>
            <Card>
              <Text style={styles.sectionTitle}>Dificultad</Text>
              <View style={styles.optionsGrid}>
                <Button
                  title="Fácil"
                  onPress={() => setSelectedDifficulty('easy')}
                  variant={selectedDifficulty === 'easy' ? 'success' : 'secondary'}
                  size="medium"
                  style={styles.optionButton}
                />
                <Button
                  title="Medio"
                  onPress={() => setSelectedDifficulty('medium')}
                  variant={selectedDifficulty === 'medium' ? 'primary' : 'secondary'}
                  size="medium"
                  style={styles.optionButton}
                />
                <Button
                  title="Difícil"
                  onPress={() => setSelectedDifficulty('hard')}
                  variant={selectedDifficulty === 'hard' ? 'danger' : 'secondary'}
                  size="medium"
                  style={styles.optionButton}
                />
                <Button
                  title="Mixto"
                  onPress={() => setSelectedDifficulty('mixed')}
                  variant={selectedDifficulty === 'mixed' ? 'primary' : 'secondary'}
                  size="medium"
                  style={styles.optionButton}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Start Game con animación */}
          <Animated.View style={{ transform: [{ translateY: card4Anim }], opacity: fadeAnim }}>
            <Card>
              <Text style={styles.summaryTitle}>Resumen de tu partida:</Text>
              <View style={styles.summary}>
                <Text style={styles.summaryText}>
                  Saga: {selectedSaga ? unlockedSagas.find(s => s.id === selectedSaga)?.name : 'No seleccionada'}
                </Text>
                <Text style={styles.summaryText}>
                  Preguntas: {selectedAmount}
                </Text>
                <Text style={styles.summaryText}>
                  Dificultad: {selectedDifficulty === 'mixed' ? 'Mixta' : 
                             selectedDifficulty === 'easy' ? 'Fácil' :
                             selectedDifficulty === 'medium' ? 'Medio' : 'Difícil'}
                </Text>
              </View>
              
              <Button
                title="¡Comenzar Aventura!"
                onPress={handleStartGame}
                variant="success"
                size="large"
                disabled={!selectedSaga}
              />
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
  },
  smallOptionButton: {
    width: 60,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
});