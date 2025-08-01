import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';

import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackService } from '@/services/feedback';
import { QuestionFeedback, FeedbackCategory } from '@/types/game';

const { width } = Dimensions.get('window');

interface FeedbackViewerProps {
  visible: boolean;
  onClose: () => void;
}

export function FeedbackViewer({ visible, onClose }: FeedbackViewerProps) {
  const [feedbacks, setFeedbacks] = useState<QuestionFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [summary, setSummary] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadFeedbacks();
      loadFeedbackSummary();
    }
  }, [visible]);

  const loadFeedbackSummary = async () => {
    try {
      const feedbackSummary = await FeedbackService.getFeedbackSummary();
      setSummary(feedbackSummary);
    } catch (error) {
      console.error('Error loading feedback summary:', error);
      setSummary(null);
    }
  };

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const allFeedbacks = await FeedbackService.getAllFeedbacks();
      setFeedbacks(allFeedbacks);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFeedback = async () => {
    if (feedbacks.length === 0) return;
    
    setIsCopying(true);
    try {
      const exportData = await FeedbackService.generateExportData();
      await Clipboard.setString(exportData);
      Alert.alert(
        '✅ Feedback Copiado',
        `Se han copiado ${feedbacks.length} feedbacks al portapapeles. Ahora puedes pegarlos en cualquier lugar.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error copiando feedback:', error);
      Alert.alert('❌ Error', 'No se pudo copiar el feedback al portapapeles');
    } finally {
      setIsCopying(false);
    }
  };

  const handleClearFeedback = async () => {
    if (feedbacks.length === 0) return;
    
    Alert.alert(
      '🗑️ Limpiar Feedback',
      `¿Estás seguro que quieres eliminar todos los ${feedbacks.length} feedbacks? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await FeedbackService.clearAllFeedbacks();
              // Recargar datos
              await loadFeedbacks();
              await loadFeedbackSummary();
              Alert.alert('✅ Completado', 'Todos los feedbacks han sido eliminados correctamente');
            } catch (error) {
              console.error('Error limpiando feedback:', error);
              Alert.alert('❌ Error', 'No se pudo limpiar el feedback. Inténtalo de nuevo.');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const getFilteredAndSortedFeedbacks = () => {
    let filtered = [...feedbacks];

    // Aplicar filtro
    switch (filter) {
      case 'high':
        filtered = filtered.filter(f => f.rating >= 4);
        break;
      case 'low':
        filtered = filtered.filter(f => f.rating <= 2);
        break;
      default:
        break;
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return b.timestamp - a.timestamp; // Más recientes primero
    });

    return filtered;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFD700' : '#666'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const renderFeedbackCard = (feedback: QuestionFeedback, index: number) => (
    <Card key={`${feedback.questionId}-${feedback.timestamp}`} style={styles.feedbackCard}>
      {/* Header con ID y fecha */}
      <View style={styles.cardHeader}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{feedback.questionId}</Text>
        </View>
        <Text style={styles.dateText}>
          {new Date(feedback.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      {/* Pregunta */}
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>❓ {feedback.question}</Text>
      </View>

      {/* Saga y Dificultad */}
      <View style={styles.metadataRow}>
        <View style={styles.sagaBadge}>
          <Text style={styles.sagaText}>🏴‍☠️ {feedback.saga}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(feedback.difficulty) }]}>
          <Text style={styles.difficultyText}>{getDifficultyLabel(feedback.difficulty)}</Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Valoración:</Text>
        <View style={styles.starsContainer}>
          {renderStars(feedback.rating)}
          <Text style={styles.ratingText}>({feedback.rating}/5)</Text>
          <Text style={styles.ratingEmoji}>{FeedbackService.getRatingEmoji(feedback.rating)}</Text>
        </View>
      </View>

      {/* Respuestas */}
      <View style={styles.answersSection}>
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>Tu respuesta:</Text>
          <Text style={[styles.answerText, { color: feedback.isCorrect ? '#22C55E' : '#EF4444' }]}>
            {feedback.userAnswer} {feedback.isCorrect ? '✅' : '❌'}
          </Text>
        </View>
        {!feedback.isCorrect && (
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>Respuesta correcta:</Text>
            <Text style={[styles.answerText, { color: '#22C55E' }]}>
              {feedback.correctAnswer} ✅
            </Text>
          </View>
        )}
      </View>

      {/* Categorías de problemas */}
      {feedback.issueCategories && feedback.issueCategories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesLabel}>Problemas identificados:</Text>
          <View style={styles.categoriesContainer}>
            {feedback.issueCategories.map((category, i) => (
              <View key={i} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {FeedbackService.getCategoryTranslation(category)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Comentario */}
      {feedback.comment && feedback.comment.trim() !== '' && (
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>💬 Comentario:</Text>
          <Text style={styles.commentText}>{feedback.comment}</Text>
        </View>
      )}
    </Card>
  );

  const filteredFeedbacks = getFilteredAndSortedFeedbacks();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
            </TouchableOpacity>
            <Text style={styles.title}>📂 Historial de Feedbacks</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Stats Summary */}
          <View style={[styles.statsContainer, { flexDirection: 'column', alignItems: 'stretch' }]}>
            {/* Resumen General */}
            {summary && (
              <View style={{ marginBottom: 15 }}>
                <Text style={[styles.statsText, { fontSize: 16, marginBottom: 8 }]}>📊 Resumen de Feedback</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={styles.statsText}>Total: {summary.totalFeedbacks} feedbacks</Text>
                  <Text style={styles.statsText}>⭐ Promedio: {summary.averageRating?.toFixed(1)}/5</Text>
                </View>
                {summary.lastExportDate && (
                  <Text style={[styles.statsText, { fontSize: 12, opacity: 0.8 }]}>
                    📤 Última exportación: {new Date(summary.lastExportDate).toLocaleDateString('es-ES')}
                  </Text>
                )}
                
                {/* Nota sobre feedback simple */}
                <View style={{ 
                  backgroundColor: 'rgba(255, 215, 0, 0.1)', 
                  borderRadius: 8, 
                  padding: 10, 
                  marginTop: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: Colors.secondary 
                }}>
                  <Text style={[styles.statsText, { fontSize: 12, color: Colors.secondary }]}>
                    💡 Este historial muestra feedbacks detallados. El sistema también usa un overlay simple tras cada pregunta para mejorar la experiencia.
                  </Text>
                </View>
                
                {/* Top categorías */}
                {summary.categoryBreakdown && Object.entries(summary.categoryBreakdown).some(([_, count]) => (count as number) > 0) && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.statsText, { fontSize: 13, marginBottom: 4 }]}>🏷️ Problemas más reportados:</Text>
                    {Object.entries(summary.categoryBreakdown)
                      .filter(([_, count]) => (count as number) > 0)
                      .sort(([_, a], [__, b]) => (b as number) - (a as number))
                      .slice(0, 3)
                      .map(([cat, count]) => (
                        <Text key={cat} style={[styles.statsText, { fontSize: 12, opacity: 0.9 }]}>
                          • {FeedbackService.getCategoryTranslation(cat as any)}: {count as number}
                        </Text>
                      ))}
                  </View>
                )}
                
                {/* Mensaje cuando no hay categorías reportadas */}
                {summary.categoryBreakdown && !Object.entries(summary.categoryBreakdown).some(([_, count]) => (count as number) > 0) && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={[styles.statsText, { fontSize: 12, opacity: 0.7, fontStyle: 'italic' }]}>
                      ✨ ¡Excelente! No se han reportado problemas específicos en las preguntas.
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {/* Botones de Acción */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: (feedbacks.length === 0 || isCopying) ? '#6B7280' : '#3B82F6',
                    flex: 1,
                  }
                ]}
                onPress={handleCopyFeedback}
                disabled={feedbacks.length === 0 || isCopying}
              >
                <View style={styles.actionButtonContent}>
                  <Text style={styles.actionButtonIcon}>
                    {isCopying ? '⏳' : '📋'}
                  </Text>
                  <View>
                    <Text style={styles.actionButtonText}>
                      {isCopying ? 'Copiando...' : 'Copiar Feedback'}
                    </Text>
                    <Text style={styles.actionButtonSubtext}>
                      {feedbacks.length} elementos
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { 
                    backgroundColor: (feedbacks.length === 0 || isClearing) ? '#6B7280' : '#EF4444',
                    flex: 1,
                  }
                ]}
                onPress={handleClearFeedback}
                disabled={feedbacks.length === 0 || isClearing}
              >
                <View style={styles.actionButtonContent}>
                  <Text style={styles.actionButtonIcon}>
                    {isClearing ? '⏳' : '🗑️'}
                  </Text>
                  <View>
                    <Text style={styles.actionButtonText}>
                      {isClearing ? 'Limpiando...' : 'Limpiar Todo'}
                    </Text>
                    <Text style={styles.actionButtonSubtext}>
                      Eliminar datos
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Filtros y Ordenamiento */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                  Todos ({feedbacks.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, filter === 'high' && styles.filterButtonActive]}
                onPress={() => setFilter('high')}
              >
                <Text style={[styles.filterText, filter === 'high' && styles.filterTextActive]}>
                  ⭐ Buenos (4-5) ({feedbacks.filter(f => f.rating >= 4).length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, filter === 'low' && styles.filterButtonActive]}
                onPress={() => setFilter('low')}
              >
                <Text style={[styles.filterText, filter === 'low' && styles.filterTextActive]}>
                  😞 Malos (1-2) ({feedbacks.filter(f => f.rating <= 2).length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
                onPress={() => setSortBy(sortBy === 'date' ? 'rating' : 'date')}
              >
                <Ionicons 
                  name={sortBy === 'date' ? 'time' : 'star'} 
                  size={16} 
                  color={Colors.secondary} 
                />
                <Text style={styles.sortText}>
                  {sortBy === 'date' ? 'Fecha' : 'Rating'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Lista de Feedbacks */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando feedbacks...</Text>
            </View>
          ) : filteredFeedbacks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {feedbacks.length === 0 
                  ? '📭 No hay feedbacks guardados aún' 
                  : '🔍 No hay feedbacks que coincidan con el filtro'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.feedbacksList}
              contentContainerStyle={styles.feedbacksListContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredFeedbacks.map((feedback, index) => renderFeedbackCard(feedback, index))}
              
              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  "Un hombre sueña, un hombre muere, pero los sueños no mueren." - Hiluluk
                </Text>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PirataOne-Regular',
    color: Colors.secondary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  statsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: '#1e3a8a',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: Colors.secondary,
  },
  sortText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.secondary,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  feedbacksList: {
    flex: 1,
  },
  feedbacksListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  feedbackCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  idText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  questionSection: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sagaBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sagaText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingEmoji: {
    fontSize: 16,
    marginLeft: 8,
  },
  answersSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  answerRow: {
    marginBottom: 6,
  },
  answerLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  answerText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  categoriesSection: {
    marginBottom: 12,
  },
  categoriesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 6,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
  },
  commentSection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  commentLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  actionButtonSubtext: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
});
