import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracionNotificaciones } from '../../../../core/interfaces/notificacion';
import { NotificacionesService } from '../../../../core/services/notificaciones.service';
import { Interruptor } from '../../../../shared/components/interruptor/interruptor';

/**
 * Formulario de avisos: canales, mensaje y disparadores de la pausa activa.
 */
@Component({
  imports: [FormsModule, Interruptor],
  selector: 'app-notifications',
  styleUrl: './notifications.css',
  templateUrl: './notifications.html',
})
export class Notifications {
  private readonly servicio = inject(NotificacionesService);

  /** Copia editable de la configuración vigente. */
  ajustes: ConfiguracionNotificaciones = { ...this.servicio.configuracion() };
  readonly minutos = [1, 5, 10, 15];
  readonly maxPosposiciones = [1, 2, 3];
  readonly guardado = signal(false);

  /**
   * Cuántos canales de aviso están activos en este momento.
   */
  canalesActivos(): number {
    const a = this.ajustes;
    return [
      a.notificacionEscritorio,
      a.bloqueoPantalla,
      a.recordatorioCorreo,
      a.sonidoAviso,
    ].filter(Boolean).length;
  }

  /**
   * Persiste los ajustes y muestra una confirmación breve.
   */
  guardar(): void {
    this.servicio.guardar(this.ajustes);
    this.guardado.set(true);
    setTimeout(() => this.guardado.set(false), 2500);
  }
}
