import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FeedbackViewer } from '@/components/FeedbackViewer';
import { useGame } from '@/context/GameContext';
import { StorageService } from '@/services/storage';
import { SAGAS } from '@/constants/sagas';

export default function SettingsScreen() {
  const gameContext = useGame();
  const [showFeedbackViewer, setShowFeedbackViewer] = useState(false);

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
    console.log('� Botón Ver Feedbacks presionado - Abriendo visualizador completo');
    setShowFeedbackViewer(true);
  };

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
              <Text style={styles.infoValue}>Trivia Nakama Team</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tema:</Text>
              <Text style={styles.infoValue}>One Piece</Text>
            </View>
          </Card>

          {/* Game Settings */}
          <Card>
            <Text style={styles.cardTitle}>Configuración del Juego</Text>
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
});