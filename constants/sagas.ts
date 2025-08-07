import { SagaProgress } from '@/types/game';

export const SAGAS: SagaProgress[] = [
  {
    id: 'east-blue',
    name: 'East Blue',
    unlocked: true,
    completed: false,
    bestScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  },
  {
    id: 'alabasta',
    name: 'Alabasta',
    unlocked: false,
    completed: false,
    bestScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  },
  {
    id: 'skypea',
    name: 'Skypea',
    unlocked: false,
    completed: false,
    bestScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  },
  {
    id: 'water-7',
    name: 'Water 7',
    unlocked: false,
    completed: false,
    bestScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  },
  {
    id: 'thriller-bark',
    name: 'Thriller Bark',
    unlocked: false,
    completed: false,
    bestScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
  },
];

export const SAGA_EMOJIS: Record<string, string> = {
  'east-blue': '🌊',
  'alabasta': '🏜️',
  'skypea': '☁️',
  'water-7': '🚂',
  'thriller-bark': '🧟',
};

// Mapeo entre nuestros IDs internos y los nombres que usa la API externa
export const SAGA_API_NAMES: Record<string, string> = {
  'east-blue': 'East Blue',
  'alabasta': 'Alabasta',
  'skypea': 'Skypiea',
  'water-7': 'Water 7',
  'thriller-bark': 'Thriller Bark',
};