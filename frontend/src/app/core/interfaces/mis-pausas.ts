/**
 * Entrada del historial de pausas del colaborador.
 */
export interface HistorialPausa {
  id: string;
  fecha: string;
  ejercicio: string;
  duracionSegundos: number;
  /** Porcentaje de la rutina que se alcanzó a hacer (routine_logs.completion_percentage). */
  porcentaje: number;
  /** Estado de ánimo reportado por el usuario. */
  animo: string;
  completada: boolean;
}

/**
 * Resumen de actividad personal para Mis pausas.
 */
export interface ResumenMisPausas {
  rachaDias: number;
  cumplimiento: number;
  pausasCompletadas: number;
  pausasProgramadas: number;
  sesionesSemana: number;
  minutosInvertidos: number;
  diasActivosMes: number;
  tasaFinalizacion: number;
  historial: HistorialPausa[];
}