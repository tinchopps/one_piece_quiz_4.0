import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestionFeedback, FeedbackSummary, FeedbackCategory } from '@/types/game';

export class FeedbackService {
  private static readonly FEEDBACK_KEY = 'one_piece_quiz_feedback';
  private static readonly EXPORT_KEY = 'one_piece_quiz_feedback_export';

  // Guardar feedback de una pregunta
  static async saveFeedback(feedback: QuestionFeedback): Promise<void> {
    try {
      console.log('💾 Guardando feedback con clave:', this.FEEDBACK_KEY);
      const existingFeedbacks = await this.getAllFeedbacks();
      existingFeedbacks.push(feedback);
      
      await AsyncStorage.setItem(
        this.FEEDBACK_KEY,
        JSON.stringify(existingFeedbacks)
      );
      
      console.log(`💬 Feedback guardado para pregunta ${feedback.questionId}. Total: ${existingFeedbacks.length}`);
    } catch (error) {
      console.error('❌ Error guardando feedback:', error);
    }
  }

  // Obtener todos los feedbacks
  static async getAllFeedbacks(): Promise<QuestionFeedback[]> {
    try {
      console.log('🔍 Buscando feedbacks con clave:', this.FEEDBACK_KEY);
      const feedbackData = await AsyncStorage.getItem(this.FEEDBACK_KEY);
      console.log('📋 Datos encontrados:', feedbackData ? 'SÍ' : 'NO');
      const result = feedbackData ? JSON.parse(feedbackData) : [];
      console.log('📊 Total feedbacks cargados:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error obteniendo feedbacks:', error);
      return [];
    }
  }

  // Obtener resumen de feedbacks
  static async getFeedbackSummary(): Promise<FeedbackSummary> {
    try {
      const feedbacks = await this.getAllFeedbacks();
      
      if (feedbacks.length === 0) {
        return {
          totalFeedbacks: 0,
          averageRating: 0,
          categoryBreakdown: {
            confusing_question: 0,
            wrong_answer: 0,
            too_easy: 0,
            too_hard: 0,
            misleading_options: 0,
            typo_error: 0,
            cultural_reference: 0,
            other: 0,
          },
        };
      }

      // Calcular estadísticas
      const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
      const averageRating = totalRating / feedbacks.length;

      // Contar categorías
      const categoryBreakdown: Record<FeedbackCategory, number> = {
        confusing_question: 0,
        wrong_answer: 0,
        too_easy: 0,
        too_hard: 0,
        misleading_options: 0,
        typo_error: 0,
        cultural_reference: 0,
        other: 0,
      };

      feedbacks.forEach(feedback => {
        feedback.issueCategories.forEach(category => {
          categoryBreakdown[category]++;
        });
      });

      // Obtener fecha de última exportación
      const exportData = await AsyncStorage.getItem(this.EXPORT_KEY);
      const lastExportDate = exportData ? parseInt(exportData) : undefined;

      return {
        totalFeedbacks: feedbacks.length,
        averageRating: parseFloat(averageRating.toFixed(2)),
        categoryBreakdown,
        lastExportDate,
      };
    } catch (error) {
      console.error('❌ Error obteniendo resumen de feedback:', error);
      return {
        totalFeedbacks: 0,
        averageRating: 0,
        categoryBreakdown: {
          confusing_question: 0,
          wrong_answer: 0,
          too_easy: 0,
          too_hard: 0,
          misleading_options: 0,
          typo_error: 0,
          cultural_reference: 0,
          other: 0,
        },
      };
    }
  }

  // Generar reporte de análisis para mejoras
  static async generateAnalysisReport(): Promise<{
    toDelete: QuestionFeedback[],
    toChangeDifficulty: { feedback: QuestionFeedback, suggestedDifficulty: string }[],
    toReformulate: { feedback: QuestionFeedback, suggestion: string }[],
    summary: FeedbackSummary
  }> {
    try {
      const feedbacks = await this.getAllFeedbacks();
      const summary = await this.getFeedbackSummary();
      
      // Preguntas para eliminar (rating 1-2 y comentarios críticos)
      const toDelete = feedbacks.filter(f => 
        f.rating <= 2 && (
          f.comment.toLowerCase().includes('borrar') ||
          f.comment.toLowerCase().includes('eliminar') ||
          f.comment.toLowerCase().includes('esta es otra cosa')
        )
      );
      
      // Cambios de dificultad
      const toChangeDifficulty = feedbacks.filter(f => 
        f.comment.toLowerCase().includes('facil') ||
        f.comment.toLowerCase().includes('mediano') ||
        f.comment.toLowerCase().includes('dificil')
      ).map(f => {
        let suggestedDifficulty = 'medium';
        if (f.comment.toLowerCase().includes('facil')) suggestedDifficulty = 'easy';
        if (f.comment.toLowerCase().includes('dificil')) suggestedDifficulty = 'hard';
        return { feedback: f, suggestedDifficulty };
      });
      
      // Preguntas para reformular
      const toReformulate = feedbacks.filter(f => 
        f.comment.toLowerCase().includes('estructurar') ||
        f.comment.toLowerCase().includes('cambiar') ||
        f.comment.toLowerCase().includes('reformular')
      ).map(f => ({
        feedback: f,
        suggestion: f.comment
      }));

      return { toDelete, toChangeDifficulty, toReformulate, summary };
    } catch (error) {
      console.error('❌ Error generando reporte:', error);
      throw error;
    }
  }

  // Generar datos para exportar
  static async generateExportData(): Promise<string> {
    try {
      const feedbacks = await this.getAllFeedbacks();
      const summary = await this.getFeedbackSummary();
      
      const exportData = {
        summary,
        feedbacks,
        exportedAt: Date.now(),
        exportedDate: new Date().toISOString(),
        version: '1.0',
        totalFeedbacks: feedbacks.length,
      };

      // Marcar fecha de exportación
      await AsyncStorage.setItem(this.EXPORT_KEY, Date.now().toString());
      
      console.log('📤 DATOS PARA COPIAR A GITHUB COPILOT:');
      console.log('='.repeat(50));
      console.log(JSON.stringify(exportData, null, 2));
      console.log('='.repeat(50));
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('❌ Error generando datos de exportación:', error);
      throw error;
    }
  }

  // Generar reporte legible para mostrar en la app
  static async generateReadableReport(): Promise<string> {
    try {
      const analysis = await this.generateAnalysisReport();
      
      let report = `📊 REPORTE DE ANÁLISIS DE FEEDBACKS\n`;
      report += `=`.repeat(50) + '\n\n';
      
      report += `📈 RESUMEN GENERAL:\n`;
      report += `• Total feedbacks: ${analysis.summary.totalFeedbacks}\n`;
      report += `• Rating promedio: ${analysis.summary.averageRating}/5\n\n`;
      
      if (analysis.toDelete.length > 0) {
        report += `❌ PREGUNTAS PARA ELIMINAR (${analysis.toDelete.length}):\n`;
        analysis.toDelete.forEach((f, i) => {
          report += `${i + 1}. ID ${f.questionId}: "${f.question.substring(0, 60)}..."\n`;
          report += `   ⭐ Rating: ${f.rating}/5 | 💬 "${f.comment}"\n\n`;
        });
      }
      
      if (analysis.toChangeDifficulty.length > 0) {
        report += `🔄 CAMBIOS DE DIFICULTAD (${analysis.toChangeDifficulty.length}):\n`;
        analysis.toChangeDifficulty.forEach((item, i) => {
          report += `${i + 1}. ID ${item.feedback.questionId}: "${item.feedback.question.substring(0, 60)}..."\n`;
          report += `   📊 ${item.feedback.difficulty} → ${item.suggestedDifficulty}\n`;
          report += `   💬 "${item.feedback.comment}"\n\n`;
        });
      }
      
      if (analysis.toReformulate.length > 0) {
        report += `✏️ PREGUNTAS PARA REFORMULAR (${analysis.toReformulate.length}):\n`;
        analysis.toReformulate.forEach((item, i) => {
          report += `${i + 1}. ID ${item.feedback.questionId}: "${item.feedback.question.substring(0, 60)}..."\n`;
          report += `   💡 Sugerencia: "${item.suggestion}"\n\n`;
        });
      }
      
      report += `📅 Reporte generado: ${new Date().toLocaleString()}\n`;
      
      return report;
    } catch (error) {
      console.error('❌ Error generando reporte legible:', error);
      throw error;
    }
  }

  // Limpiar todos los feedbacks (para desarrollo/testing)
  static async clearAllFeedbacks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.FEEDBACK_KEY);
      await AsyncStorage.removeItem(this.EXPORT_KEY);
      console.log('🗑️ Todos los feedbacks eliminados');
    } catch (error) {
      console.error('❌ Error limpiando feedbacks:', error);
    }
  }

  // Obtener feedbacks filtrados por saga o dificultad
  static async getFeedbacksBy(
    saga?: string,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<QuestionFeedback[]> {
    try {
      const allFeedbacks = await this.getAllFeedbacks();
      
      return allFeedbacks.filter(feedback => {
        if (saga && feedback.saga !== saga) return false;
        if (difficulty && feedback.difficulty !== difficulty) return false;
        return true;
      });
    } catch (error) {
      console.error('❌ Error filtrando feedbacks:', error);
      return [];
    }
  }

  // Obtener traducción de categorías para UI
  static getCategoryTranslation(category: FeedbackCategory): string {
    const translations: Record<FeedbackCategory, string> = {
      confusing_question: 'Pregunta confusa',
      wrong_answer: 'Respuesta incorrecta',
      too_easy: 'Muy fácil',
      too_hard: 'Muy difícil',
      misleading_options: 'Opciones engañosas',
      typo_error: 'Error tipográfico',
      cultural_reference: 'Referencia cultural',
      other: 'Otro',
    };
    
    return translations[category];
  }

  // Obtener emoji para rating
  static getRatingEmoji(rating: number): string {
    const emojis = ['😞', '😕', '😐', '😊', '🤩'];
    return emojis[rating - 1] || '😐';
  }

  // Marcar mejoras como aplicadas
  static async markImprovementsApplied(): Promise<void> {
    try {
      const timestamp = Date.now();
      await AsyncStorage.setItem('feedback_improvements_applied', timestamp.toString());
      console.log('✅ Mejoras marcadas como aplicadas:', new Date(timestamp).toLocaleString());
    } catch (error) {
      console.error('❌ Error marcando mejoras:', error);
    }
  }

  // Verificar si las mejoras ya fueron aplicadas
  static async checkImprovementsApplied(): Promise<boolean> {
    try {
      const applied = await AsyncStorage.getItem('feedback_improvements_applied');
      return applied !== null;
    } catch (error) {
      console.error('❌ Error verificando mejoras:', error);
      return false;
    }
  }
}
