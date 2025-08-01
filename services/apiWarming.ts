// 🔒 API WARMING SERVICE TEMPORALMENTE DESHABILITADO
// Mantiene la API de Render despierta (REACTIVAR CUANDO SE MEJORE LA API)

export class APIWarmingService {
  private static warmingInterval: any = null;
  private static isAPIReady = true; // Siempre true ya que usamos datos locales

  // 🔒 WARMING DESHABILITADO - No necesario con datos locales
  static async pingAPI(): Promise<boolean> {
    console.log('⏸️ API Warming deshabilitado - usando datos locales');
    return true; // Siempre exitoso con datos locales
  }

  // � WARMING DESHABILITADO - No necesario con datos locales
  static async wakeUpAPIForGame(): Promise<boolean> {
    console.log('⏸️ API Wake up deshabilitado - usando datos locales');
    return true; // Siempre exitoso con datos locales
  }

  // 🔒 WARMING DESHABILITADO - No hace nada
  static startContinuousWarming() {
    console.log('⏸️ Warming continuo deshabilitado - usando datos locales');
    // No hacer nada
  }

  // 🔒 WARMING DESHABILITADO - No hace nada
  static stopWarming() {
    if (this.warmingInterval) {
      clearInterval(this.warmingInterval);
      this.warmingInterval = null;
    }
    console.log('⏸️ Warming detenido (ya estaba deshabilitado)');
  }

  // Estado siempre ready con datos locales
  static get isReady(): boolean {
    return this.isAPIReady;
  }
}
