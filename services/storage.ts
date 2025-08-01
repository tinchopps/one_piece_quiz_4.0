import AsyncStorage from '@react-native-async-storage/async-storage';
import { SagaProgress, GameStats } from '@/types/game';
import { SAGAS } from '@/constants/sagas';

const STORAGE_KEYS = {
  SAGA_PROGRESS: 'saga_progress',
  GAME_STATS: 'game_stats',
};

export class StorageService {
  static async getSagasProgress(): Promise<SagaProgress[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SAGA_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
      // Return default sagas on first launch
      await this.saveSagasProgress(SAGAS);
      return SAGAS;
    } catch (error) {
      console.error('Error loading sagas progress:', error);
      return SAGAS;
    }
  }

  static async saveSagasProgress(sagas: SagaProgress[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAGA_PROGRESS, JSON.stringify(sagas));
    } catch (error) {
      console.error('Error saving sagas progress:', error);
    }
  }

  static async updateSagaProgress(
    sagaId: string,
    updates: Partial<SagaProgress>
  ): Promise<SagaProgress[]> {
    try {
      const sagas = await this.getSagasProgress();
      const updatedSagas = sagas.map(saga => 
        saga.id === sagaId ? { ...saga, ...updates } : saga
      );
      await this.saveSagasProgress(updatedSagas);
      return updatedSagas;
    } catch (error) {
      console.error('Error updating saga progress:', error);
      return await this.getSagasProgress();
    }
  }

  static async getGameStats(): Promise<GameStats> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATS);
      if (stored) {
        return JSON.parse(stored);
      }
      const defaultStats: GameStats = {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        bestStreak: 0,
        timeSpent: 0,
      };
      await this.saveGameStats(defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Error loading game stats:', error);
      return {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        bestStreak: 0,
        timeSpent: 0,
      };
    }
  }

  static async saveGameStats(stats: GameStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  }

  static async updateGameStats(updates: Partial<GameStats>): Promise<GameStats> {
    try {
      const currentStats = await this.getGameStats();
      const updatedStats = { ...currentStats, ...updates };
      await this.saveGameStats(updatedStats);
      return updatedStats;
    } catch (error) {
      console.error('Error updating game stats:', error);
      return await this.getGameStats();
    }
  }
}