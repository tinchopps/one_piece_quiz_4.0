import AsyncStorage from '@react-native-async-storage/async-storage';
import { SagaProgress, GameStats } from '@/types/game';
import { SAGAS } from '@/constants/sagas';

const STORAGE_KEYS = {
  SAGA_PROGRESS: 'saga_progress', // Modo Historia
  CUSTOM_PROGRESS: 'custom_progress', // Modo Personalizado
  GAME_STATS: 'game_stats',
};

export class StorageService {

  // Progreso de Modo Historia
  static async getSagasProgress(): Promise<SagaProgress[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SAGA_PROGRESS);
      if (stored) {
        const storedSagas: SagaProgress[] = JSON.parse(stored);
        const storedIds = new Set(storedSagas.map((s) => s.id));
        const missingSagas = SAGAS.filter((s) => !storedIds.has(s.id));
        if (missingSagas.length > 0) {
          const updated = [...storedSagas, ...missingSagas];
          await this.saveSagasProgress(updated);
          return updated;
        }
        return storedSagas;
      }
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

  // Progreso de Modo Personalizado
  static async getCustomProgress(): Promise<SagaProgress[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_PROGRESS);
      if (stored) {
        const storedSagas: SagaProgress[] = JSON.parse(stored);
        const storedIds = new Set(storedSagas.map((s) => s.id));
        const missingSagas = SAGAS.filter((s) => !storedIds.has(s.id));
        if (missingSagas.length > 0) {
          const updated = [...storedSagas, ...missingSagas];
          await this.saveCustomProgress(updated);
          return updated;
        }
        return storedSagas;
      }
      await this.saveCustomProgress(SAGAS);
      return SAGAS;
    } catch (error) {
      console.error('Error loading custom progress:', error);
      return SAGAS;
    }
  }

  static async saveCustomProgress(sagas: SagaProgress[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PROGRESS, JSON.stringify(sagas));
    } catch (error) {
      console.error('Error saving custom progress:', error);
    }
  }

  static async updateCustomProgress(
    sagaId: string,
    updates: Partial<SagaProgress>
  ): Promise<SagaProgress[]> {
    try {
      const sagas = await this.getCustomProgress();
      const updatedSagas = sagas.map(saga =>
        saga.id === sagaId ? { ...saga, ...updates } : saga
      );
      await this.saveCustomProgress(updatedSagas);
      return updatedSagas;
    } catch (error) {
      console.error('Error updating custom progress:', error);
      return await this.getCustomProgress();
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