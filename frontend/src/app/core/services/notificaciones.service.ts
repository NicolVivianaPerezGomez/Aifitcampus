import { Injectable, signal } from '@angular/core';
import { ConfiguracionNotificaciones } from '../interfaces/notificacion';

/**
 * Conserva en memoria la configuración de avisos que define el administrador.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  /** Estado actual de los canales, el mensaje y los disparadores. */
  readonly configuracion = signal<ConfiguracionNotificaciones>({
    notificacionEscritorio: true,
    bloqueoPantalla: false,
    recordatorioCorreo: false,
    sonidoAviso: true,
    anticipacionMinutos: 5,
    posponerMinutos: 5,
    permitirPosponer: true,
    maxPosposiciones: 2,
    titulo: 'Hora de tu pausa activa',
    cuerpo: 'Tómate un momento para moverte. Tu bienestar también es parte de la jornada.',
    mostrarNombreEjercicio: true,
    mostrarDuracion: true,
    dispararPausaProgramada: true,
    dispararPausaNoRealizada: true,
    dispararInicioJornada: false,
    horarioSilencio: true,
    silencioDesde: '20:00',
    silencioHasta: '07:00',
  });

  /**
   * Reemplaza la configuración vigente por la que envía el formulario.
   */
  guardar(ajustes: ConfiguracionNotificaciones): void {
    this.configuracion.set({ ...ajustes });
  }
}
