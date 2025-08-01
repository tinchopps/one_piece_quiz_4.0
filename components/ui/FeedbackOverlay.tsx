import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { QuestionFeedback, FeedbackCategory, Question } from '@/types/game';
import { FeedbackService } from '@/services/feedback';
import { sendFeedback } from '@/services/feedbackService';

interface FeedbackOverlayProps {
  visible: boolean;
  question: Question;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  onComplete: () => void;
}

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, size = 30 }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange(star)}
          style={styles.starButton}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  visible,
  question,
  userAnswer,
  correctAnswer,
  isCorrect,
  onComplete,
}) => {
  console.log('🔍 FeedbackOverlay render:', { visible, questionId: question?.id, userAnswer, isCorrect });
  
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<FeedbackCategory[]>([]);
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackCategories: { key: FeedbackCategory; label: string; emoji: string }[] = [
    { key: 'confusing_question', label: 'Pregunta confusa', emoji: '🤔' },
    { key: 'wrong_answer', label: 'Respuesta incorrecta', emoji: '❌' },
    { key: 'too_easy', label: 'Muy fácil', emoji: '😴' },
    { key: 'too_hard', label: 'Muy difícil', emoji: '😰' },
    { key: 'misleading_options', label: 'Opciones engañosas', emoji: '🤷‍♂️' },
    { key: 'typo_error', label: 'Error tipográfico', emoji: '✏️' },
    { key: 'cultural_reference', label: 'Referencia cultural', emoji: '🏴‍☠️' },
    { key: 'other', label: 'Otro', emoji: '💭' },
  ];

  const toggleCategory = (category: FeedbackCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmitFeedback = async () => {
    console.log('📝 Intentando enviar feedback:', { rating, selectedCategories, comment: comment.length });
    
    if (isSubmitting) return; // Evita doble envío
    if (rating === 0) {
      Alert.alert('Rating requerido', 'Por favor selecciona una calificación con estrellas');
      return;
    }

    setIsSubmitting(true);

    try {
      // Guardar localmente primero
      const localFeedback: QuestionFeedback = {
        questionId: question.id,
        question: question.question,
        saga: question.saga,
        difficulty: question.difficulty,
        rating,
        issueCategories: selectedCategories,
        comment: comment.trim(),
        timestamp: Date.now(),
        userAnswer,
        correctAnswer,
        isCorrect,
        username: username.trim() || null,
        problem_type: selectedCategories.length > 0 ? selectedCategories.join(',') : null,
      };
      console.log('💾 Guardando feedback local:', localFeedback);
      await FeedbackService.saveFeedback(localFeedback);

      // Enviar a Supabase con identificador único
      const uniqueId = `${question.id}_${Date.now()}`;
      const supabaseFeedback = {
        question: question.question,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        username: username.trim() || null,
        problem_type: selectedCategories.length > 0 ? selectedCategories.join(',') : null,
        comment: comment.trim(),
        rating,
        unique_id: uniqueId,
        timestamp: new Date().toISOString(),
      };
      console.log('🌐 Enviando feedback a Supabase:', supabaseFeedback);
      
      // Envío asíncrono sin bloquear la UI
      try {
        const success = await sendFeedback(supabaseFeedback);
        if (!success) {
          console.warn('⚠️ Error enviando feedback a Supabase');
        } else {
          console.log('✅ Feedback enviado exitosamente a Supabase');
        }
      } catch (err) {
        console.warn('⚠️ Error enviando feedback a Supabase:', err);
      }

      // Resetear formulario y avanzar
      setRating(0);
      setSelectedCategories([]);
      setComment('');
      setUsername('');
      onComplete();
    } catch (error) {
      console.error('❌ Error guardando feedback local:', error);
      Alert.alert('Error', 'No se pudo guardar el feedback local. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipFeedback = () => {
    console.log('⏭️ Usuario saltó el feedback');
    // Resetear formulario
    setRating(0);
    setSelectedCategories([]);
    setComment('');
    
    onComplete();
  };

  console.log('🎯 FeedbackOverlay - estado visible:', visible);
  if (!visible) {
    console.log('❌ FeedbackOverlay no visible, retornando null');
    return null;
  }

  console.log('✅ FeedbackOverlay renderizando modal');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>💬 Feedback de Pregunta</Text>
              <Text style={styles.subtitle}>Ayúdanos a mejorar las preguntas</Text>
            </View>

            {/* Información de la pregunta */}
            <View style={styles.questionInfo}>
              <Text style={styles.questionText} numberOfLines={2}>
                {question.question}
              </Text>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Tu respuesta:</Text>
                <Text style={[styles.answerText, isCorrect ? styles.correctAnswer : styles.wrongAnswer]}>
                  {userAnswer}
                </Text>
              </View>
              {!isCorrect && (
                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>Correcta:</Text>
                  <Text style={[styles.answerText, styles.correctAnswer]}>
                    {correctAnswer}
                  </Text>
                </View>
              )}
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  {question.saga.toUpperCase()} • {question.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Rating con estrellas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                ⭐ Califica esta pregunta *
              </Text>
              <StarRating rating={rating} onRatingChange={setRating} size={35} />
              <Text style={styles.ratingHint}>
                {rating > 0 ? FeedbackService.getRatingEmoji(rating) : ''} 
                {rating === 0 ? 'Selecciona una calificación' : 
                 rating === 1 ? 'Muy mala' :
                 rating === 2 ? 'Mala' :
                 rating === 3 ? 'Regular' :
                 rating === 4 ? 'Buena' : 'Excelente'}
              </Text>
            </View>

            {/* Categorías de problemas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏷️ ¿Qué tipo de problema detectaste? (opcional)
              </Text>
              <View style={styles.categoriesGrid}>
                {feedbackCategories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryButton,
                      selectedCategories.includes(category.key) && styles.categoryButtonSelected
                    ]}
                    onPress={() => toggleCategory(category.key)}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={[
                      styles.categoryLabel,
                      selectedCategories.includes(category.key) && styles.categoryLabelSelected
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Nombre de usuario opcional */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                👤 Nombre (opcional)
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Tu nombre o apodo..."
                placeholderTextColor={Colors.text.secondary}
                value={username}
                onChangeText={setUsername}
                maxLength={50}
              />
            </View>

            {/* Comentario libre */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                💭 Comentario adicional (opcional)
              </Text>
              <TextInput
                style={styles.commentInput}
                multiline
                numberOfLines={3}
                placeholder="Describe el problema o sugerencia..."
                placeholderTextColor={Colors.text.secondary}
                value={comment}
                onChangeText={setComment}
                maxLength={500}
              />
              <Text style={styles.characterCount}>
                {comment.length}/500
              </Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipFeedback}
                disabled={isSubmitting}
              >
                <Text style={styles.skipButtonText}>Saltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitFeedback}
                disabled={rating === 0 || isSubmitting}
              >
                <Text style={[
                  styles.submitButtonText,
                  rating === 0 && styles.submitButtonTextDisabled
                ]}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    padding: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  questionInfo: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  questionText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  answerLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    width: 100,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  correctAnswer: {
    color: Colors.success,
  },
  wrongAnswer: {
    color: Colors.error,
  },
  metaInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    color: Colors.accent,
  },
  ratingHint: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  categoryLabelSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: Colors.text.primary,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  skipButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipButtonText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  submitButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.secondary,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: Colors.text.secondary,
  },
});
