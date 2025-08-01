export interface Question {
  id: number;
  saga: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizResult {
  questionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface SagaProgress {
  id: string;
  name: string;
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  questionsAnswered: number;
  correctAnswers: number;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  timeSpent: number;
}

export interface GameState {
  currentQuestionIndex: number;
  questions: Question[];
  answers: QuizResult[];
  score: number;
  streak: number;
  startTime: number;
  timePerQuestion: number;
}

// Interfaces para el sistema de feedback
export interface QuestionFeedback {
  questionId: number;
  question: string;
  saga: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number; // 1-5 estrellas
  issueCategories: FeedbackCategory[];
  comment: string;
  timestamp: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  username?: string | null;
  problem_type?: string | null;
}

export type FeedbackCategory = 
  | 'confusing_question'
  | 'wrong_answer'
  | 'too_easy'
  | 'too_hard'
  | 'misleading_options'
  | 'typo_error'
  | 'cultural_reference'
  | 'other';

export interface FeedbackSummary {
  totalFeedbacks: number;
  averageRating: number;
  categoryBreakdown: Record<FeedbackCategory, number>;
  lastExportDate?: number;
}