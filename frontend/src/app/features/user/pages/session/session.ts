import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoAnimo } from '../../../../core/interfaces/animo';
import { SesionPausa } from '../../../../core/models/sesion-pausa';
import { LogoUniempresarial } from '../../../../shared/components/logo-uniempresarial/logo-uniempresarial';

/**
 * Paso 1 de la sesión: el colaborador reporta cómo se siente antes del ejercicio.
 */
@Component({
  imports: [LogoUniempresarial],
  selector: 'app-session',
  styleUrl: './session.css',
  templateUrl: './session.html',
})
export class Session {
  private readonly router = inject(Router);

  /** Opciones de ánimo que se muestran como emojis interactivos. */
  readonly opciones: EstadoAnimo[] = [
    { valor: 5, etiqueta: 'Excelente', emoji: '😄' },
    { valor: 4, etiqueta: 'Bien', emoji: '🙂' },
    { valor: 3, etiqueta: 'Normal', emoji: '😐' },
    { valor: 2, etiqueta: 'Cansado', emoji: '😞' },
    { valor: 1, etiqueta: 'Estresado', emoji: '😫' },
  ];

  readonly sesion = signal(new SesionPausa());

  /**
   * Marca el estado de ánimo elegido por el usuario.
   */
  seleccionar(animo: EstadoAnimo): void {
    this.sesion.set(new SesionPausa(animo));
  }

  /**
   * Continúa al ejercicio solo si ya hay un ánimo seleccionado.
   */
  comenzar(): void {
    if (!this.sesion().tieneAnimo()) {
      return;
    }

    void this.router.navigateByUrl('/user/inicio');
  }

  /**
   * Abandona la pausa y regresa al inicio del colaborador.
   */
  salir(): void {
    void this.router.navigateByUrl('/user/inicio');
  }
}
