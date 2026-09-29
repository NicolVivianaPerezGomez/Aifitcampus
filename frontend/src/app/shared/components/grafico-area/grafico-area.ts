import { Component, computed, input } from '@angular/core';
import { PuntoGrafico } from '../../../core/interfaces/estadisticas';

/**
 * Área suave bajo la línea, misma familia visual del mockup.
 */
@Component({
  selector: 'app-grafico-area',
  templateUrl: './grafico-area.html',
  styleUrl: './grafico-area.css',
})
export class GraficoArea {
  readonly puntos = input<PuntoGrafico[]>([]);
  readonly maximo = input(10);

  readonly ancho = 420;
  readonly alto = 220;
  readonly izq = 30;
  readonly der = 12;
  readonly arriba = 12;
  readonly abajo = 30;

  readonly marcas = computed(() => {
    const tope = this.maximo();
    if (tope <= 5) {
      return [tope, Math.round(tope / 2), 0];
    }
    if (tope <= 10) {
      return [tope, Math.round((tope * 3) / 4), Math.round(tope / 2), Math.round(tope / 4), 0];
    }
    const paso = Math.ceil(tope / 4);
    const marcas: number[] = [];
    for (let valor = tope; valor > 0; valor -= paso) {
      marcas.push(valor);
    }
    marcas.push(0);
    return marcas;
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

  readonly area = computed(() => {
    const pts = this.coordenadas();
    if (pts.length === 0) {
      return '';
    }
    const base = this.alto - this.abajo;
    return `${this.trazo()} L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z`;
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
