import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { QuestionFeedback, FeedbackCategory, Question } from '@/types/game';
import { FeedbackService } from '@/services/feedback';

interface SimpleFeedbackOverlayProps {
  visible: boolean;
  question: Question;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  onComplete: () => void;
}

export const SimpleFeedbackOverlay: React.FC<SimpleFeedbackOverlayProps> = ({
  visible,
  question,
  userAnswer,
  correctAnswer,
  isCorrect,
  onComplete,
}) => {
  console.log('🔍 SimpleFeedbackOverlay render:', { visible, questionId: question?.id });
  
  const [rating, setRating] = useState(0);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [comment, setComment] = useState('');

  const handleSubmitFeedback = async () => {
    console.log('📝 Enviando feedback simple con rating:', rating);
    
    if (rating === 0) {
      Alert.alert('Rating requerido', 'Por favor selecciona una calificación');
      return;
    }

    try {
      const feedback: QuestionFeedback = {
        questionId: question.id,
        question: question.question,
        saga: question.saga,
        difficulty: question.difficulty,
        rating,
        issueCategories: [],
        comment: comment.trim(),
        timestamp: Date.now(),
        userAnswer,
        correctAnswer,
        isCorrect,
      };

      await FeedbackService.saveFeedback(feedback);
      console.log('✅ Feedback simple guardado');
      
      // Reset form
      setRating(0);
      setComment('');
      setShowCommentSection(false);
      onComplete();
    } catch (error) {
      console.error('❌ Error guardando feedback simple:', error);
      Alert.alert('Error', 'No se pudo guardar el feedback');
    }
  };

  const handleSkip = () => {
    console.log('⏭️ Saltando feedback simple');
    // Reset form
    setRating(0);
    setComment('');
    setShowCommentSection(false);
    onComplete();
  };

  if (!visible) {
    console.log('❌ SimpleFeedbackOverlay no visible');
    return null;
  }

  console.log('✅ SimpleFeedbackOverlay renderizando modal');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>💬 Feedback Simple</Text>
            
            <Text style={styles.questionText}>
              {question.question}
            </Text>
            
            <View style={styles.answerInfo}>
              <Text style={styles.label}>Tu respuesta: </Text>
              <Text style={[styles.answer, isCorrect ? styles.correct : styles.wrong]}>
                {userAnswer}
              </Text>
            </View>
            
            {!isCorrect && (
              <View style={styles.answerInfo}>
                <Text style={styles.label}>Correcta: </Text>
                <Text style={[styles.answer, styles.correct]}>
                  {correctAnswer}
                </Text>
              </View>
            )}

            <Text style={styles.ratingTitle}>
              ⭐ Califica esta pregunta (1-5):
            </Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={styles.star}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.ratingText}>
              Rating: {rating > 0 ? rating : 'Sin seleccionar'}
            </Text>

            {/* Toggle para mostrar comentarios */}
            <TouchableOpacity
              style={styles.commentToggle}
              onPress={() => setShowCommentSection(!showCommentSection)}
            >
              <Text style={styles.commentToggleText}>
                {showCommentSection ? '📝 Ocultar comentarios' : '💬 Agregar comentario (opcional)'}
              </Text>
            </TouchableOpacity>

            {/* Sección de comentarios */}
            {showCommentSection && (
              <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>Comentario adicional:</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Escribe tu comentario aquí... (opcional)"
                  placeholderTextColor="#888"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                />
                <Text style={styles.characterCount}>
                  {comment.length}/500 caracteres
                </Text>
              </View>
            )}

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Saltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === 0 && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitFeedback}
                disabled={rating === 0}
              >
                <Text style={styles.submitButtonText}>
                  Enviar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  questionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  answerInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  answer: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  correct: {
    color: '#10b981',
  },
  wrong: {
    color: '#ef4444',
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 25,
    color: '#fbbf24',
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  commentToggle: {
    backgroundColor: '#f0f9ff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  commentToggleText: {
    fontSize: 13,
    color: '#0ea5e9',
    textAlign: 'center',
    fontWeight: '500',
  },
  commentSection: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  characterCount: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
