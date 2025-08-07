

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/context/GameContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeedbackOverlay } from '@/components/ui/FeedbackOverlay';
import { QUESTIONS_DB } from '@/services/questionsApi';
import { Colors, gradients } from '@/constants/colors';
import { router } from 'expo-router';
import type { QuizResult } from '@/types/game';


export default function SummaryScreen() {
  const { lastRoundAnswers } = useGame();
  const [feedbackIdx, setFeedbackIdx] = useState<number | null>(null);


  // Utilidad para buscar la pregunta original por ID
  function getOriginalQuestion(questionId: number) {
    return QUESTIONS_DB.find(q => q.id === questionId);
  }

  // Encuentra la pregunta seleccionada para feedback y su info original
  let selected: (QuizResult & { saga?: string; difficulty?: string }) | null = null;
  if (feedbackIdx !== null && lastRoundAnswers && lastRoundAnswers[feedbackIdx]) {
    const base = lastRoundAnswers[feedbackIdx];
    const original = getOriginalQuestion(base.questionId);
    selected = {
      ...base,
      saga: original?.saga || '',
      difficulty: (original?.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
    };
  }

  return (
    <LinearGradient colors={gradients.pirate as unknown as [string, string]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Resumen de preguntas y feedbacks</Text>
        {lastRoundAnswers && lastRoundAnswers.length > 0 ? (
          lastRoundAnswers.map((q: QuizResult, idx: number) => (
            <Card key={q.questionId || idx} style={styles.questionCard}>
              <Text style={styles.questionText}>{q.question}</Text>
              <Text style={styles.answerText}>Tu respuesta: {q.userAnswer}</Text>
              <Text style={styles.answerText}>Respuesta correcta: {q.correctAnswer}</Text>
              <Button
                title="Reportar feedback"
                variant="secondary"
                size="small"
                onPress={() => setFeedbackIdx(idx)}
                style={styles.feedbackButton}
              />
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay preguntas para mostrar.</Text>
        )}
        <Button
          title="Volver a resultados"
          variant="primary"
          size="medium"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </ScrollView>
      {/* Modal de feedback individual */}
      {selected && (
        <FeedbackOverlay
          visible={true}
          question={{
            id: selected.questionId,
            question: selected.question,
            saga: selected.saga || '',
            difficulty: (selected.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
            options: [],
            correct_answer: selected.correctAnswer,
          }}
          userAnswer={selected.userAnswer}
          correctAnswer={selected.correctAnswer}
          isCorrect={selected.isCorrect}
          onComplete={() => setFeedbackIdx(null)}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PirataOne-Regular',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  questionCard: {
    marginBottom: 12,
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  feedbackButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 32,
  },
  backButton: {
    marginTop: 24,
  },
});
