import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Clock } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FeedbackOverlay } from '@/components/ui/FeedbackOverlay';
import { Colors, gradients } from '@/constants/colors';
import { QuestionsAPI } from '@/services/questionsApi';
import { APIWarmingService } from '@/services/apiWarming';
import { useGame } from '@/context/GameContext';
import { Question, QuizResult } from '@/types/game';

export default function QuizScreen() {
  const params = useLocalSearchParams<{
    mode: string;
    sagaId: string;
    amount: string;
    difficulty: string;
  }>();
  
  const { startGame, answerQuestion, nextQuestion, currentGame, updateSagaProgress, updateGameStats, unlockNextSaga } = useGame();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isNavigating, setIsNavigating] = useState(false);
  // FIX: Contador local de respuestas correctas para evitar race conditions
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  // FIX: Array local para trackear todas las respuestas procesadas
  const [localAnswers, setLocalAnswers] = useState<QuizResult[]>([]);
  // FIX: Ref para mantener el score actual sin depender de React state batching
  const correctAnswersRef = useRef(0);
  
  // Estados para el sistema de feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedbackData, setCurrentFeedbackData] = useState<{
    question: Question;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  } | null>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const optionsAnim = useRef(new Animated.Value(1)).current;
  const timerPulseAnim = useRef(new Animated.Value(1)).current;

  // Función para animar transición entre preguntas
  const animateQuestionTransition = () => {
    // Fade out y slide out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset valores y fade in
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Función para animar selección de respuesta
  const animateAnswerSelection = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Función para animar pulso del temporizador
  const startTimerPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(timerPulseAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(timerPulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopTimerPulse = () => {
    timerPulseAnim.stopAnimation();
    timerPulseAnim.setValue(1);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (currentGame && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Iniciar pulso cuando quedan 10 segundos o menos
        if (timeLeft <= 10 && timeLeft > 1) {
          startTimerPulse();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      stopTimerPulse();
      handleTimeUp();
    }
  }, [timeLeft, showResult, currentGame]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // 🔥 WARMING PROACTIVO: Despertar la API antes de cargar preguntas
      console.log('🎮 Usuario iniciando quiz - warming proactivo de la API...');
      APIWarmingService.wakeUpAPIForGame();
      
      const difficulty = params.difficulty === 'mixed' ? undefined : params.difficulty as any;
      const isStoryMode = params.mode === 'story';
      
      const loadedQuestions = await QuestionsAPI.getQuestions(
        params.sagaId,
        parseInt(params.amount),
        difficulty,
        isStoryMode
      );
      
      if (loadedQuestions.length === 0) {
        Alert.alert('Error', 'No hay preguntas disponibles para esta configuración.');
        router.back();
        return;
      }

      setQuestions(loadedQuestions);
      startGame(loadedQuestions);
      setQuestionStartTime(Date.now());
      // FIX: Resetear el contador de respuestas correctas
      correctAnswersRef.current = 0;
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las preguntas.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    if (!currentGame || showResult) return;
    
    const currentQuestion = questions[currentGame.currentQuestionIndex];
    handleAnswerSubmit('', true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    animateAnswerSelection();
  };

  const handleAnswerSubmit = (answer: string = selectedAnswer, timeUp: boolean = false) => {
    if (!currentGame || showResult) return;

    const currentQuestion = questions[currentGame.currentQuestionIndex];
    
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.correct_answer.trim().toLowerCase();
    const timeSpent = Date.now() - questionStartTime;

    // FIX: Actualizar contador local INMEDIATAMENTE
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      // FIX: También actualizar el ref INMEDIATAMENTE
      correctAnswersRef.current += 1;
    }
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: answer || 'Sin respuesta',
      correctAnswer: currentQuestion.correct_answer,
      isCorrect,
      timeSpent,
    };

    // FIX: Agregar la respuesta al array local INMEDIATAMENTE
    setLocalAnswers(prev => [...prev, result]);

    answerQuestion(result);
    setShowResult(true);

    // 🆕 MOSTRAR FEEDBACK DESPUÉS DE MOSTRAR RESULTADO
    setTimeout(() => {
      // Configurar datos para feedback
      setCurrentFeedbackData({
        question: currentQuestion,
        userAnswer: answer || 'Sin respuesta',
        correctAnswer: currentQuestion.correct_answer,
        isCorrect,
      });
      
      // Mostrar overlay de feedback
      setShowFeedback(true);
    }, 2000); // Esperar 2 segundos después del resultado
  };

  // 🆕 FUNCIÓN PARA MANEJAR CUANDO SE COMPLETA EL FEEDBACK
  const handleFeedbackComplete = async (feedbackData?: any) => {
    console.log('✅ Feedback completado, continuando con el juego');
    // El envío a Supabase ya se hace en FeedbackOverlay, no duplicar aquí
    
    // Ocultar feedback
    setShowFeedback(false);
    setCurrentFeedbackData(null);
    // Continuar con el flujo normal del juego
    if (currentGame && currentGame.currentQuestionIndex + 1 >= questions.length) {
      // Quiz completado
      finishQuiz();
    } else {
      // Siguiente pregunta
      animateQuestionTransition();
      nextQuestion();
      setShowResult(false);
      setSelectedAnswer('');
      setTimeLeft(30);
      setQuestionStartTime(Date.now());
    }
  };

  const finishQuiz = async () => {
    if (!currentGame || isNavigating) return;

    setIsNavigating(true);

    const totalTime = Date.now() - currentGame.startTime;
    // FIX: Usar el ref que se actualiza INMEDIATAMENTE
    const score = correctAnswersRef.current;
    const totalQuestions = questions.length;

    // Update saga progress
    await updateSagaProgress(params.sagaId, {
      questionsAnswered: totalQuestions,
      correctAnswers: score,
      bestScore: Math.max(score, 0),
      completed: score >= totalQuestions * 0.7, // 70% to complete
    });

    // Update game stats
    await updateGameStats({
      totalGamesPlayed: 1,
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: score,
      bestStreak: Math.max(currentGame.streak, 0),
      timeSpent: totalTime,
    });

    // Unlock next saga if story mode and completed
    if (params.mode === 'story' && score >= totalQuestions * 0.7) {
      await unlockNextSaga(params.sagaId);
    }

    // Navigate to results
    router.push({
      pathname: '/results',
      params: {
        score: score.toString(),
        total: totalQuestions.toString(),
        mode: params.mode,
        sagaId: params.sagaId,
        timeSpent: totalTime.toString(),
      },
    });
    
    setIsNavigating(false);
  };

  if (loading || !currentGame) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} />
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentGame.currentQuestionIndex];
  
  // Add null check for currentQuestion to prevent crashes
  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} />
        <Text style={styles.loadingText}>Procesando...</Text>
      </View>
    );
  }

  const progress = (currentGame.currentQuestionIndex + 1) / questions.length;

  return (
    <LinearGradient colors={gradients.pirate as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.questionCounter}>
                {currentGame.currentQuestionIndex + 1} / {questions.length}
              </Text>
              <Animated.View 
                style={[
                  styles.timerContainer,
                  {
                    transform: [{ scale: timerPulseAnim }]
                  }
                ]}
              >
                <Clock size={16} color={Colors.text.inverse} />
                <Text style={[
                  styles.timerText,
                  timeLeft <= 10 && timeLeft > 0 && { color: Colors.error }
                ]}>
                  {timeLeft}s
                </Text>
              </Animated.View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} height={6} />
          </View>

          {/* Question Card con animación */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
          >
            <Card style={styles.questionCard}>
            <Text style={styles.difficulty}>
              {currentQuestion.difficulty === 'easy' ? '🟢 Fácil' :
               currentQuestion.difficulty === 'medium' ? '🟡 Medio' : '🔴 Difícil'}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </Card>
          </Animated.View>

          {/* Options con animación */}
          <Animated.View 
            style={[
              styles.optionsContainer,
              {
                opacity: optionsAnim,
                transform: [{ scale: optionsAnim }]
              }
            ]}
          >
            {currentQuestion.options.map((option, index) => {
              let buttonVariant: 'primary' | 'secondary' | 'success' | 'danger' = 'secondary';
              
              if (showResult) {
                if (option === currentQuestion.correct_answer) {
                  buttonVariant = 'success';
                } else if (option === selectedAnswer && option !== currentQuestion.correct_answer) {
                  buttonVariant = 'danger';
                }
              } else if (option === selectedAnswer) {
                buttonVariant = 'primary';
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  style={styles.optionButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      buttonVariant === 'success' ? gradients.victory as any :
                      buttonVariant === 'danger' ? gradients.danger as any :
                      buttonVariant === 'primary' ? gradients.pirate as any :
                      ['#f3f4f6', '#e5e7eb'] as any
                    }
                    style={styles.optionGradient}
                  >
                    <Text style={[
                      styles.optionText,
                      (buttonVariant === 'success' || buttonVariant === 'danger' || buttonVariant === 'primary') && 
                      styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Submit Button */}
          {!showResult && selectedAnswer && (
            <View style={styles.submitContainer}>
              <Button
                title="Confirmar Respuesta"
                onPress={() => handleAnswerSubmit()}
                variant="success"
                size="large"
              />
            </View>
          )}

          {/* Result Feedback */}
          {showResult && (
            <Card style={styles.resultCard}>
              <Text style={[
                styles.resultText,
                selectedAnswer === currentQuestion.correct_answer ? styles.correctText : styles.incorrectText
              ]}>
                {selectedAnswer === currentQuestion.correct_answer ? '🎉 ¡Correcto!' : '❌ Incorrecto'}
              </Text>
              {selectedAnswer !== currentQuestion.correct_answer && (
                <Text style={styles.correctAnswerText}>
                  Respuesta correcta: {currentQuestion.correct_answer}
                </Text>
              )}
            </Card>
          )}
        </View>
      </SafeAreaView>
      
      {/* 🆕 OVERLAY DE FEEDBACK */}
      {currentFeedbackData && (
        <FeedbackOverlay
          visible={showFeedback}
          question={currentFeedbackData.question}
          userAnswer={currentFeedbackData.userAnswer}
          correctAnswer={currentFeedbackData.correctAnswer}
          isCorrect={currentFeedbackData.isCorrect}
          onComplete={handleFeedbackComplete}
        />
      )}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.text.inverse,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.inverse,
  },
  progressContainer: {
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 24,
  },
  difficulty: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    flex: 1,
  },
  optionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 16,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.text.inverse,
  },
  submitContainer: {
    marginTop: 24,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginTop: 24,
  },
  resultText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.error,
  },
  correctAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});