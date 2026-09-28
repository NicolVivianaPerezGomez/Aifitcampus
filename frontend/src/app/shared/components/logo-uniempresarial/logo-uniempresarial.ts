import { Component, input } from '@angular/core';

/**
 * Marca oficial de Uniempresarial.
 * El lockup completo y el isotipo salen de los archivos institucionales.
 */
@Component({
  selector: 'app-logo-uniempresarial',
  templateUrl: './logo-uniempresarial.html',
  styleUrl: './logo-uniempresarial.css',
})
export class LogoUniempresarial {
  /** Muestra solo el isotipo, sin el nombre de la institución. */
  readonly compacto = input(false);

  /** Reduce el lockup para la barra lateral del administrador. */
  readonly estrecho = input(false);
}
