/**
 * Preferencias globales de avisos de pausa activa.
 */
export interface ConfiguracionNotificaciones {
  notificacionEscritorio: boolean;
  bloqueoPantalla: boolean;
  recordatorioCorreo: boolean;
  sonidoAviso: boolean;
  anticipacionMinutos: number;
  posponerMinutos: number;
  permitirPosponer: boolean;
  maxPosposiciones: number;
  titulo: string;
  cuerpo: string;
  mostrarNombreEjercicio: boolean;
  mostrarDuracion: boolean;
  dispararPausaProgramada: boolean;
  dispararPausaNoRealizada: boolean;
  dispararInicioJornada: boolean;
  horarioSilencio: boolean;
  silencioDesde: string;
  silencioHasta: string;
}
