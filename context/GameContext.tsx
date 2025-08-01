import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SagaProgress, GameStats, GameState, QuizResult } from '@/types/game';
import { StorageService } from '@/services/storage';

interface GameContextState {
  sagas: SagaProgress[];
  gameStats: GameStats;
  currentGame: GameState | null;
  loading: boolean;
}

interface GameContextActions {
  loadData: () => Promise<void>;
  updateSagaProgress: (sagaId: string, updates: Partial<SagaProgress>) => Promise<void>;
  updateGameStats: (updates: Partial<GameStats>) => Promise<void>;
  startGame: (questions: any[]) => void;
  answerQuestion: (result: QuizResult) => void;
  nextQuestion: () => void;
  endGame: () => void;
  unlockNextSaga: (currentSagaId: string) => Promise<void>;
}

type GameContextType = GameContextState & GameContextActions;

const GameContext = createContext<GameContextType | null>(null);

type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAGAS'; payload: SagaProgress[] }
  | { type: 'SET_GAME_STATS'; payload: GameStats }
  | { type: 'START_GAME'; payload: any[] }
  | { type: 'ANSWER_QUESTION'; payload: QuizResult }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_GAME' };

const gameReducer = (state: GameContextState, action: GameAction): GameContextState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SAGAS':
      return { ...state, sagas: action.payload };
    case 'SET_GAME_STATS':
      return { ...state, gameStats: action.payload };
    case 'START_GAME':
      return {
        ...state,
        currentGame: {
          currentQuestionIndex: 0,
          questions: action.payload,
          answers: [],
          score: 0,
          streak: 0,
          startTime: Date.now(),
          timePerQuestion: 30000, // 30 seconds
        },
      };
    case 'ANSWER_QUESTION':
      if (!state.currentGame) return state;
      
      const newAnswers = [...state.currentGame.answers, action.payload];
      const newScore = action.payload.isCorrect ? state.currentGame.score + 1 : state.currentGame.score;
      const newStreak = action.payload.isCorrect ? state.currentGame.streak + 1 : 0;
      
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          answers: newAnswers,
          score: newScore,
          streak: newStreak,
          // NO incrementar aquí - se hace en quiz.tsx después del timeout
        },
      };
    case 'NEXT_QUESTION':
      if (!state.currentGame) return state;
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          currentQuestionIndex: state.currentGame.currentQuestionIndex + 1,
        },
      };
    case 'END_GAME':
      return { ...state, currentGame: null };
    default:
      return state;
  }
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    sagas: [],
    gameStats: {
      totalGamesPlayed: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      bestStreak: 0,
      timeSpent: 0,
    },
    currentGame: null,
    loading: true,
  });

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [sagas, stats] = await Promise.all([
        StorageService.getSagasProgress(),
        StorageService.getGameStats(),
      ]);
      dispatch({ type: 'SET_SAGAS', payload: sagas });
      dispatch({ type: 'SET_GAME_STATS', payload: stats });
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateSagaProgress = async (sagaId: string, updates: Partial<SagaProgress>) => {
    try {
      const updatedSagas = await StorageService.updateSagaProgress(sagaId, updates);
      dispatch({ type: 'SET_SAGAS', payload: updatedSagas });
    } catch (error) {
      console.error('Error updating saga progress:', error);
    }
  };

  const updateGameStats = async (updates: Partial<GameStats>) => {
    try {
      const updatedStats = await StorageService.updateGameStats(updates);
      dispatch({ type: 'SET_GAME_STATS', payload: updatedStats });
    } catch (error) {
      console.error('Error updating game stats:', error);
    }
  };

  const startGame = (questions: any[]) => {
    dispatch({ type: 'START_GAME', payload: questions });
  };

  const answerQuestion = (result: QuizResult) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: result });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  const unlockNextSaga = async (currentSagaId: string) => {
    const sagaOrder = ['east-blue', 'alabasta', 'skypea'];
    const currentIndex = sagaOrder.indexOf(currentSagaId);
    
    if (currentIndex >= 0 && currentIndex < sagaOrder.length - 1) {
      const nextSagaId = sagaOrder[currentIndex + 1];
      await updateSagaProgress(nextSagaId, { unlocked: true });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const contextValue: GameContextType = {
    ...state,
    loadData,
    updateSagaProgress,
    updateGameStats,
    startGame,
    answerQuestion,
    nextQuestion,
    endGame,
    unlockNextSaga,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}