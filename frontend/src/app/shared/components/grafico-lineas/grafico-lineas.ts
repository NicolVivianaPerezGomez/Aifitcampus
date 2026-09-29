import { Component, computed, input } from '@angular/core';
import { PuntoGrafico } from '../../../core/interfaces/estadisticas';

/**
 * Gráfico de líneas del mockup: curva suave, puntos magenta y grilla punteada.
 */
@Component({
  selector: 'app-grafico-lineas',
  templateUrl: './grafico-lineas.html',
  styleUrl: './grafico-lineas.css',
})
export class GraficoLineas {
  readonly puntos = input<PuntoGrafico[]>([]);
  readonly maximo = input(5);

  readonly ancho = 420;
  readonly alto = 220;
  readonly izq = 30;
  readonly der = 12;
  readonly arriba = 12;
  readonly abajo = 30;

  readonly marcas = computed(() => {
    if (this.maximo() === 5) {
      return [5, 4, 2, 0];
    }
    const tope = this.maximo();
    return [tope, Math.round(tope / 2), 0];
  });

  readonly coordenadas = computed(() => {
    const serie = this.puntos();
    if (serie.length === 0) {
      return [];
    }

    const tope = this.maximo();
    const plotW = this.ancho - this.izq - this.der;
    const plotH = this.alto - this.arriba - this.abajo;

    return serie.map((punto, indice) => {
      const x =
        serie.length === 1
          ? this.izq + plotW / 2
          : this.izq + (indice / (serie.length - 1)) * plotW;
      const y = this.arriba + (1 - punto.valor / tope) * plotH;
      return { ...punto, x, y };
    });
  });

  /** Curva suave tipo spline entre los puntos. */
  readonly trazo = computed(() => {
    const pts = this.coordenadas();
    if (pts.length === 0) {
      return '';
    }
    if (pts.length === 1) {
      return `M ${pts[0].x} ${pts[0].y}`;
    }

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  });

  yDe(valor: number): number {
    const plotH = this.alto - this.arriba - this.abajo;
    return this.arriba + (1 - valor / this.maximo()) * plotH;
  }

  xDe(indice: number): number {
    const serie = this.puntos();
    const plotW = this.ancho - this.izq - this.der;
    if (serie.length <= 1) {
      return this.izq + plotW / 2;
    }
    return this.izq + (indice / (serie.length - 1)) * plotW;
  }
}
