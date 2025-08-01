import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FeedbackService } from '@/services/feedback';
import { FeedbackSummary } from '@/types/game';

export const FeedbackSettings: React.FC = () => {
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadFeedbackSummary();
  }, []);

  const loadFeedbackSummary = async () => {
    try {
      const feedbackSummary = await FeedbackService.getFeedbackSummary();
      setSummary(feedbackSummary);
    } catch (error) {
      console.error('Error cargando resumen de feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportFeedback = async () => {
    if (!summary || summary.totalFeedbacks === 0) {
      Alert.alert('Sin datos', 'No hay feedback para exportar');
      return;
    }

    setIsExporting(true);
    try {
      const exportData = await FeedbackService.generateExportData();
      
      await Share.share({
        message: exportData,
        title: 'One Piece Quiz - Feedback Data',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar el feedback');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearFeedback = () => {
    Alert.alert(
      'Limpiar Feedback',
      '¿Estás seguro que quieres eliminar todos los feedbacks? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await FeedbackService.clearAllFeedbacks();
            await loadFeedbackSummary();
            Alert.alert('Completado', 'Todos los feedbacks han sido eliminados');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error cargando feedback</Text>
      </View>
    );
  }

  const topCategories = Object.entries(summary.categoryBreakdown)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Estadísticas de Feedback</Text>
        <Text style={styles.subtitle}>
          Información sobre la calidad de las preguntas
        </Text>
      </View>

      {/* Estadísticas generales */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>📈 Resumen General</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total de Feedbacks:</Text>
          <Text style={styles.statValue}>{summary.totalFeedbacks}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Rating Promedio:</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.statValue}>
              {summary.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.ratingStars}>
              {FeedbackService.getRatingEmoji(Math.round(summary.averageRating))}
            </Text>
          </View>
        </View>

        {summary.lastExportDate && (
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Última Exportación:</Text>
            <Text style={styles.statValue}>
              {new Date(summary.lastExportDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Top categorías de problemas */}
      {topCategories.length > 0 && (
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>🏷️ Problemas Más Reportados</Text>
          {topCategories.map(([category, count]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>
                {FeedbackService.getCategoryTranslation(category as any)}
              </Text>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryNumber}>{count}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Acciones */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>⚙️ Acciones</Text>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            summary.totalFeedbacks === 0 && styles.actionButtonDisabled
          ]}
          onPress={handleExportFeedback}
          disabled={summary.totalFeedbacks === 0 || isExporting}
        >
          <Text style={styles.actionButtonText}>
            {isExporting ? '📤 Exportando...' : '📤 Exportar Feedback'}
          </Text>
          <Text style={styles.actionButtonSubtext}>
            Compartir datos para análisis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.dangerButton,
            summary.totalFeedbacks === 0 && styles.actionButtonDisabled
          ]}
          onPress={handleClearFeedback}
          disabled={summary.totalFeedbacks === 0}
        >
          <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
            🗑️ Limpiar Todo
          </Text>
          <Text style={styles.actionButtonSubtext}>
            Eliminar todos los feedbacks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info sobre el sistema */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>ℹ️ Información</Text>
        <Text style={styles.infoText}>
          El sistema de feedback ayuda a mejorar la calidad de las preguntas 
          recopilando opiniones de los usuarios. Los datos se almacenan localmente 
          y pueden exportarse para análisis.
        </Text>
        <Text style={styles.infoText}>
          • Los feedbacks incluyen rating, categorías de problemas y comentarios
          {'\n'}• Los datos son anónimos y se almacenan solo en tu dispositivo
          {'\n'}• Puedes exportar y compartir los datos para ayudar a mejorar el juego
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.error,
    marginTop: 50,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingStars: {
    fontSize: 18,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryName: {
    fontSize: 15,
    color: Colors.text.primary,
    flex: 1,
  },
  categoryCount: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: Colors.border,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dangerButtonText: {
    color: '#fff',
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 10,
  },
});
