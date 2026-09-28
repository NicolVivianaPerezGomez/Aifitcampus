import { Component, computed, input } from '@angular/core';
import { PuntoGrafico } from '../../../core/interfaces/estadisticas';

/**
 * Barras horizontales del mockup: magenta, navy y etiquetas laterales.
 */
@Component({
  selector: 'app-grafico-barras-horizontales',
  templateUrl: './grafico-barras-horizontales.html',
  styleUrl: './grafico-barras-horizontales.css',
})
export class GraficoBarrasHorizontales {
  readonly puntos = input<PuntoGrafico[]>([]);
  readonly maximo = input<number | null>(null);

  readonly tope = computed(() => {
    if (this.maximo()) {
      return this.maximo() as number;
    }
    return Math.max(...this.puntos().map((punto) => punto.valor), 1);
  });

  readonly filas = computed(() =>
    this.puntos().map((punto, indice) => ({
      ...punto,
      ancho: (punto.valor / this.tope()) * 100,
      color: indice % 2 === 0 ? 'var(--color-kpi-pink)' : 'var(--color-navy)',
    }))
  );
}
