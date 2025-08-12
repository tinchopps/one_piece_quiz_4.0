import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Star, CircleCheck as CheckCircle } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Colors, gradients } from '@/constants/colors';
import { SAGA_EMOJIS } from '@/constants/sagas';
import { useGame } from '@/context/GameContext';
import { RankingService } from '@/services/supabaseClient';

export default function StoryScreen() {
  const { sagas, loading, username, setUserProfile } = useGame();

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [desiredUsername, setDesiredUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);
  const [pendingSagaId, setPendingSagaId] = useState<string | null>(null);

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
      if (pendingSagaId) {
        const sid = pendingSagaId;
        setPendingSagaId(null);
        proceedToGame(sid);
      }
    } catch (e: any) {
      setUsernameError(e.message || 'Error al guardar');
    } finally {
      setSavingUsername(false);
    }
  };

  const proceedToGame = (sagaId: string) => {
    router.push({
      pathname: '/quiz',
      params: { 
        mode: 'story',
        sagaId,
        amount: '10',
        difficulty: 'mixed'
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} />
      </View>
    );
  }

  const handleSagaPress = (sagaId: string, unlocked: boolean) => {
    if (!unlocked) return;
    if (!username) {
      setPendingSagaId(sagaId);
      setShowUsernameModal(true);
      return;
    }
    proceedToGame(sagaId);
  };

  return (
  <LinearGradient colors={gradients.pirate as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>📚 Modo Historia</Text>
            <Text style={styles.subtitle}>Progresa saga por saga en tu aventura pirata</Text>
          </View>

          {/* Sagas List */}
          <View style={styles.sagasContainer}>
            {sagas.map((saga, index) => {
              const progressPercentage = saga.questionsAnswered > 0 
                ? (saga.correctAnswers / saga.questionsAnswered) * 100 
                : 0;

              return (
                <TouchableOpacity
                  key={saga.id}
                  onPress={() => handleSagaPress(saga.id, saga.unlocked)}
                  disabled={!saga.unlocked}
                  activeOpacity={0.8}
                >
                  <Card style={[
                    styles.sagaCard,
                    !saga.unlocked && styles.lockedCard,
                    saga.completed && styles.completedCard,
                  ] as any}>
                    <View style={styles.sagaHeader}>
                      <View style={styles.sagaInfo}>
                        <Text style={styles.sagaEmoji}>
                          {SAGA_EMOJIS[saga.id] || '🌊'}
                        </Text>
                        <View style={styles.sagaTextContainer}>
                          <Text style={[
                            styles.sagaName,
                            !saga.unlocked && styles.lockedText
                          ]}>
                            {saga.name}
                          </Text>
                          <Text style={[
                            styles.sagaStatus,
                            !saga.unlocked && styles.lockedText
                          ]}>
                            {!saga.unlocked ? 'Bloqueada' :
                             saga.completed ? 'Completada' : 
                             saga.questionsAnswered > 0 ? 'En progreso' : 'Disponible'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.sagaIndicator}>
                        {!saga.unlocked ? (
                          <Lock size={24} color={Colors.text.secondary} />
                        ) : saga.completed ? (
                          <CheckCircle size={24} color={Colors.success} />
                        ) : (
                          <Star size={24} color={Colors.secondary} />
                        )}
                      </View>
                    </View>

                    {saga.unlocked && (
                      <>
                        {/* Progress */}
                        {saga.questionsAnswered > 0 && (
                          <View style={styles.progressSection}>
                            <View style={styles.progressInfo}>
                              <Text style={styles.progressText}>
                                Progreso: {saga.correctAnswers}/{saga.questionsAnswered}
                              </Text>
                              <Text style={styles.progressPercentage}>
                                {progressPercentage.toFixed(0)}%
                              </Text>
                            </View>
                            <ProgressBar progress={progressPercentage / 100} />
                          </View>
                        )}

                        {/* Best Score */}
                        {saga.bestScore > 0 && (
                          <View style={styles.scoreSection}>
                            <Text style={styles.scoreText}>
                              Mejor puntuación: {saga.bestScore}/10
                            </Text>
                          </View>
                        )}

                        {/* Action Button */}
                        <View style={styles.actionSection}>
                          <Button
                            title={saga.completed ? 'Jugar de nuevo' : 'Comenzar'}
                            onPress={() => handleSagaPress(saga.id, saga.unlocked)}
                            variant={saga.completed ? 'success' : 'primary'}
                            size="medium"
                          />
                        </View>
                      </>
                    )}

                    {!saga.unlocked && (
                      <View style={styles.lockedSection}>
                        <Text style={styles.lockedMessage}>
                          Completa la saga anterior para desbloquear
                        </Text>
                      </View>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* Username Modal */}
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
                title={pendingSagaId ? 'Saltar por ahora' : (username ? 'Cerrar' : 'Más tarde')}
                onPress={() => {
                  if (pendingSagaId) {
                    const sid = pendingSagaId;
                    setShowUsernameModal(false);
                    setPendingSagaId(null);
                    proceedToGame(sid);
                  } else {
                    setShowUsernameModal(false);
                  }
                }}
                variant="secondary"
                size="medium"
                disabled={savingUsername}
              />
            </View>
            {savingUsername && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.primary} />}
          </View>
        </View>
      </Modal>
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
  sagasContainer: {
    gap: 16,
  },
  sagaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  lockedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    opacity: 0.6,
  },
  completedCard: {
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
  },
  sagaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sagaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sagaEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  sagaTextContainer: {
    flex: 1,
  },
  sagaName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  sagaStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  lockedText: {
    color: Colors.text.secondary,
    opacity: 0.7,
  },
  sagaIndicator: {
    marginLeft: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.secondary,
  },
  scoreSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
    textAlign: 'center',
  },
  actionSection: {
    marginTop: 8,
  },
  lockedSection: {
    padding: 16,
    alignItems: 'center',
  },
  lockedMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
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