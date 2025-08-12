import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Modal, TextInput, ActivityIndicator, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors, gradients } from '@/constants/colors';
import { SAGA_EMOJIS } from '@/constants/sagas';
import { useGame } from '@/context/GameContext';
import { RankingService } from '@/services/supabaseClient';

export default function FreeModeScreen() {
  const { sagas, username, setUserProfile } = useGame();
  const [selectedSaga, setSelectedSaga] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [desiredUsername, setDesiredUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Anim = useRef(new Animated.Value(50)).current;
  const card2Anim = useRef(new Animated.Value(50)).current;
  const card3Anim = useRef(new Animated.Value(50)).current;
  const card4Anim = useRef(new Animated.Value(50)).current;

  // Mostrar todas las sagas, no solo las desbloqueadas
  const allSagas = sagas;

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

  const rankingEligible = selectedSaga === 'all' && selectedAmount === 10 && selectedDifficulty === 'mixed';

  // No forzar el modal de username; el usuario puede jugar sin configurar nombre

  const validateUsername = (value: string) => {
    if (value.length < 3 || value.length > 16) return '3-16 caracteres';
    if (!/^[_A-Za-z0-9]+$/.test(value)) return 'Solo letras, números y _';
    return null;
  };

  const submitUsername = async () => {
    const err = validateUsername(desiredUsername.trim());
    setUsernameError(err);
    if (err) return;
    try {
      setSavingUsername(true);
      const clean = desiredUsername.trim();
      const userRow = await RankingService.getOrCreateUser(clean);
      await setUserProfile(clean, userRow.id);
      setShowUsernameModal(false);
    } catch (e: any) {
      setUsernameError(e.message || 'Error al guardar');
    } finally {
      setSavingUsername(false);
    }
  };

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
              <Text style={styles.sectionTitle}>Selecciona una Saga (o Mixto)</Text>
              <View style={styles.optionsGrid}>
                <Button
                  key="all"
                  title="Mixto"
                  onPress={() => setSelectedSaga('all')}
                  variant={selectedSaga === 'all' ? 'primary' : 'secondary'}
                  size="medium"
                  style={styles.optionButton}
                />
                {allSagas.map((saga) => (
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
                  Saga: {selectedSaga ? allSagas.find(s => s.id === selectedSaga)?.name : 'No seleccionada'}
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
              
              {username && (
                <View style={styles.usernameInfo}> 
                  <Text style={styles.usernameLabel}>Jugador: <Text style={styles.usernameValue}>{username}</Text></Text>
                </View>
              )}
              {rankingEligible ? (
                <Text style={styles.rankingHint}>Esta partida calificará para el Ranking (Free)</Text>
              ) : (
                <Text style={styles.notEligibleHint}>Esta partida no participará en el ranking global.</Text>
              )}
              <Button
                title={'¡Comenzar Aventura!'}
                onPress={handleStartGame}
                variant="success"
                size="large"
                disabled={!selectedSaga}
              />
              {!username && (
                <Pressable onPress={() => setShowUsernameModal(true)} style={{ marginTop: 12 }}>
                  <Text style={styles.chooseUsernameLink}>Configura tu nombre para participar en el ranking</Text>
                </Pressable>
              )}
            </Card>
          </Animated.View>
        </ScrollView>
        <Modal visible={showUsernameModal} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Elige tu nombre</Text>
              <Text style={styles.modalSubtitle}>Será público en los rankings. No podrás reclamar nombres ajenos.</Text>
              <TextInput
                style={styles.input}
                placeholder="Pirata_123"
                placeholderTextColor="#888"
                value={desiredUsername}
                autoCapitalize="none"
                onChangeText={(t) => { setDesiredUsername(t); if (usernameError) setUsernameError(null); }}
                maxLength={16}
              />
              {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
              <View style={styles.modalButtons}>
                <Button
                  title="Guardar"
                  onPress={submitUsername}
                  variant="primary"
                  size="medium"
                  disabled={savingUsername}
                />
                <Button
                  title={username ? 'Cerrar' : 'Más tarde'}
                  onPress={() => { if (username) setShowUsernameModal(false); else setShowUsernameModal(false); }}
                  variant="secondary"
                  size="medium"
                  disabled={savingUsername}
                />
              </View>
              {savingUsername && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.primary} />}
            </View>
          </View>
        </Modal>
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
  usernameInfo: {
    marginBottom: 12,
    alignItems: 'center'
  },
  usernameLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary
  },
  usernameValue: {
    fontFamily: 'Inter-Bold',
    color: Colors.primary
  },
  rankingHint: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
    textAlign: 'center',
    marginBottom: 8,
  },
  notEligibleHint: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  chooseUsernameLink: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.secondary,
    textAlign: 'center'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.secondary,
    marginBottom: 8,
    textAlign: 'center'
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 12,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444'
  },
  errorText: {
  color: Colors.error,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 4
  }
});