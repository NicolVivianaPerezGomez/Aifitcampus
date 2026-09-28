import { Component, input, model } from '@angular/core';

/**
 * Interruptor de encendido/apagado alineado al diseño de avisos.
 */
@Component({
  selector: 'app-interruptor',
  templateUrl: './interruptor.html',
  styleUrl: './interruptor.css',
})
export class Interruptor {
  readonly titulo = input.required<string>();
  readonly descripcion = input('');
  /** Estado actual del interruptor, enlazado en dos vías. */
  readonly activo = model(false);

  /**
   * Invierte el valor actual al pulsar el control.
   */
  alternar(): void {
    this.activo.update((valor) => !valor);
  }
}
