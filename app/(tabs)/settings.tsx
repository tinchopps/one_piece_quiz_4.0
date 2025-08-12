import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { FeedbackViewer } from '@/components/FeedbackViewer';
import { useGame } from '@/context/GameContext';
import { RankingService } from '@/services/supabaseClient';
import { StorageService } from '@/services/storage';
import { SAGAS } from '@/constants/sagas';


import { ActivityIndicator } from 'react-native';

export default function SettingsScreen() {
  const gameContext = useGame();
  const { username, userId, setUserProfile, clearUserProfile } = gameContext;
  const [showFeedbackViewer, setShowFeedbackViewer] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem('feedback_enabled');
        setFeedbackEnabled(value === 'true');
      } catch (e) {
        setFeedbackEnabled(false);
      }
    })();
  }, []);

  const handleToggleFeedback = async (value: boolean) => {
    setFeedbackEnabled(value);
    try {
      await AsyncStorage.setItem('feedback_enabled', value ? 'true' : 'false');
    } catch (e) {}
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reiniciar Progreso',
      '¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.saveSagasProgress(SAGAS);
              await gameContext.loadData();
              Alert.alert('Éxito', 'Tu progreso ha sido reiniciado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo reiniciar el progreso');
            }
          }
        }
      ]
    );
  };

  const handleViewRawData = async () => {
    setShowFeedbackViewer(true);
  };

  const validateUsername = (value: string) => {
    if (value.length < 3 || value.length > 16) return '3-16 caracteres';
    if (!/^[_A-Za-z0-9]+$/.test(value)) return 'Solo letras, números y _';
    return null;
  };

  const handleSaveUsername = async () => {
    const clean = newUsername.trim();
    const err = validateUsername(clean);
    setUsernameError(err);
    if (err) return;
    try {
      setSavingUsername(true);
      const row = await RankingService.getOrCreateUser(clean);
      await setUserProfile(clean, row.id);
      setShowUsernameModal(false);
    } catch (e: any) {
      setUsernameError(e.message || 'Error');
    } finally {
      setSavingUsername(false);
    }
  };

  const handleClearUsername = async () => {
    Alert.alert('Eliminar nombre', '¿Seguro que quieres eliminar tu nombre y desaparecer del ranking? (No borra registros ya existentes)', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await clearUserProfile(); } }
    ]);
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  const handleLogoutPress = async () => {
    await logout();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181A20' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⚙️ Configuración</Text>
            <Text style={styles.subtitle}>Personaliza tu experiencia de juego</Text>
          </View>

          {/* App Info */}
          <Card>
            <Text style={styles.cardTitle}>Información de la App</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versión:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Desarrollado por:</Text>
              <Text style={styles.infoValue}>Tinchopps</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tema:</Text>
              <Text style={styles.infoValue}>One Piece</Text>
            </View>
          </Card>

          {/* Game Settings */}
          <Card>
            <Text style={styles.cardTitle}>Configuración del Juego</Text>
            <View style={styles.usernameBox}>
              <Text style={styles.usernameTitle}>Nombre en Ranking</Text>
              {username ? (
                <View style={styles.usernameRow}>
                  <Text style={styles.currentUsername}>{username}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button title="Cambiar" size="small" variant="primary" onPress={() => { setNewUsername(username); setShowUsernameModal(true); }} />
                    <Button title="Quitar" size="small" variant="danger" onPress={handleClearUsername} />
                  </View>
                </View>
              ) : (
                <Button title="Configurar Nombre" size="small" variant="primary" onPress={() => { setNewUsername(''); setShowUsernameModal(true); }} />
              )}
              <Text style={styles.usernameHint}>Visible públicamente. Único global. Cambiarlo no migra puntajes previos en el backend (placeholder).</Text>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Activar feedback después de cada pregunta</Text>
              <Switch
                value={feedbackEnabled}
                onValueChange={handleToggleFeedback}
                trackColor={{ false: '#767577', true: Colors.primary }}
                thumbColor={feedbackEnabled ? Colors.secondary : '#f4f3f4'}
              />
            </View>
            <Text style={styles.sectionDescription}>
              Próximamente: configuración de sonido, vibraciones y otros ajustes
            </Text>
          </Card>

          {/* Data Management */}
          <Card>
            <Text style={styles.cardTitle}>Gestión de Datos</Text>
            <Text style={styles.sectionDescription}>
              Administra tu progreso y datos guardados
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Reiniciar Progreso"
                onPress={handleResetProgress}
                variant="danger"
                size="medium"
              />
            </View>
          </Card>

          {/* Feedback Analysis */}
          <Card>
            <Text style={styles.cardTitle}>📊 Análisis de Feedback</Text>
            <Text style={styles.sectionDescription}>
              Visualiza y revisa todos los feedbacks generados por los usuarios
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title="� Ver Feedbacks Generados"
                onPress={handleViewRawData}
                variant="primary"
                size="medium"
              />
            </View>
          </Card>

          {/* Auth Section */}
          <Card>
            <Text style={styles.cardTitle}>Cuenta</Text>
            {user ? (
              <>
                <Text style={styles.sectionDescription}>
                  Sesión iniciada como: <Text style={{ fontWeight: 'bold' }}>{user.email}</Text>
                </Text>
                {/* Botón solo visible para admin */}
                {user.role === 'admin' && (
                  <Button
                    title="Panel de Admin"
                    onPress={() => router.push('/admin')}
                    variant="success"
                    size="medium"
                    style={{ marginBottom: 12 }}
                  />
                )}
                <Button
                  title={loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                  onPress={handleLogoutPress}
                  variant="secondary"
                  size="medium"
                  disabled={loading}
                />
              </>
            ) : (
              <Button
                title="Iniciar sesión de admin"
                onPress={handleLoginPress}
                variant="primary"
                size="medium"
                disabled={loading}
              />
            )}
          </Card>

          {/* About */}
          <Card>
            <Text style={styles.cardTitle}>Acerca de One Piece</Text>
            <Text style={styles.aboutText}>
              One Piece es una serie de manga escrita e ilustrada por Eiichiro Oda. 
              Sigue las aventuras de Monkey D. Luffy, un joven pirata cuyo cuerpo 
              ganó las propiedades del caucho después de comer una fruta del diablo. 
              Con su tripulación de piratas, llamada los Piratas del Sombrero de Paja, 
              Luffy explora el Grand Line en busca del tesoro más codiciado del mundo, 
              el "One Piece", para convertirse en el próximo Rey de los Piratas.
            </Text>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              "Los sueños nunca mueren" - Marshall D. Teach
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal de visualización de feedbacks */}
      <FeedbackViewer
        visible={showFeedbackViewer}
        onClose={() => setShowFeedbackViewer(false)}
      />
      <Modal visible={showUsernameModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{username ? 'Cambiar nombre' : 'Configurar nombre'}</Text>
            <TextInput
              style={styles.input}
              placeholder="NuevoNombre"
              placeholderTextColor="#888"
              value={newUsername}
              autoCapitalize="none"
              onChangeText={(t) => { setNewUsername(t); if (usernameError) setUsernameError(null); }}
              maxLength={16}
            />
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            <View style={styles.modalButtons}>
              <Button title={savingUsername ? 'Guardando...' : 'Guardar'} variant="primary" size="medium" onPress={handleSaveUsername} disabled={savingUsername} />
              <Button title="Cancelar" variant="secondary" size="medium" onPress={() => setShowUsernameModal(false)} disabled={savingUsername} />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PirataOne-Regular',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  buttonContainer: {
    gap: 12,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 22,
    textAlign: 'justify',
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
  usernameBox: { marginBottom: 20 },
  usernameTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.primary, marginBottom: 6 },
  usernameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  currentUsername: { fontSize: 14, fontFamily: 'Inter-Bold', color: Colors.secondary },
  usernameHint: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.text.secondary, marginTop: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: Colors.secondary, marginBottom: 12, textAlign: 'center' },
  input: { backgroundColor: '#2a2a2a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontFamily: 'Inter-Regular', marginBottom: 8, borderWidth: 1, borderColor: '#444' },
  errorText: { color: Colors.error, fontSize: 12, fontFamily: 'Inter-SemiBold', marginBottom: 4, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 4 },
});