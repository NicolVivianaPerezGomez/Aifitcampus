import { Component, computed, input } from '@angular/core';
import { PuntoGrafico } from '../../../core/interfaces/estadisticas';

/**
 * Gráfico de barras estilo mockup: pastillas magenta/navy, grilla punteada y ejes limpios.
 */
@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.html',
  styleUrl: './grafico-barras.css',
})
export class GraficoBarras {
  readonly puntos = input<PuntoGrafico[]>([]);
  readonly maximo = input<number | null>(null);

  /** Ids únicos por instancia para no chocar gradientes en la misma página. */
  readonly idGradiente = `gb-${Math.random().toString(36).slice(2, 9)}`;

  readonly ancho = 460;
  readonly alto = 248;
  readonly izq = 36;
  readonly der = 16;
  readonly arriba = 12;
  readonly abajo = 36;

  readonly tope = computed(() => {
    if (this.maximo()) {
      return this.maximo() as number;
    }

    const valores = this.puntos().flatMap((punto) =>
      punto.valorSecundario != null ? [punto.valor, punto.valorSecundario] : [punto.valor]
    );
    return Math.max(...valores, 1);
  });

  readonly marcas = computed(() => {
    const tope = this.tope();
    if (tope >= 8) {
      return [8, 6, 4, 2, 0];
    }
    if (tope >= 4) {
      return [tope, Math.round((tope * 3) / 4), Math.round(tope / 2), Math.round(tope / 4), 0];
    }
    if (tope >= 3) {
      return [tope, Math.round((tope * 2) / 3), Math.round(tope / 3), 0];
    }
    return [tope, 0];
  });

  readonly tieneSecundaria = computed(() =>
    this.puntos().some((punto) => punto.valorSecundario != null)
  );

  readonly barras = computed(() => {
    const serie = this.puntos();
    const tope = this.tope();
    const plotW = this.ancho - this.izq - this.der;
    const plotH = this.alto - this.arriba - this.abajo;
    const hueco = serie.length || 1;
    const anchoBarra = Math.min(22, Math.max(14, plotW / hueco * 0.38));
    const gapGrupo = 6;

    return serie.map((punto, indice) => {
      const celda = plotW / hueco;
      const centro = this.izq + celda * indice + celda / 2;
      const tieneExtra = punto.valorSecundario != null;
      const altura = Math.max((punto.valor / tope) * plotH, 0);
      const y = this.arriba + plotH - altura;

      if (tieneExtra) {
        const alturaExtra = Math.max(((punto.valorSecundario as number) / tope) * plotH, 0);
        return {
          etiqueta: punto.etiqueta,
          etiquetaX: centro,
          guiaX: centro,
          principal: {
            x: centro - anchoBarra - gapGrupo / 2,
            y,
            altura,
            ancho: anchoBarra,
          },
          secundaria: {
            x: centro + gapGrupo / 2,
            y: this.arriba + plotH - alturaExtra,
            altura: alturaExtra,
            ancho: anchoBarra,
          },
        };
      }

      return {
        etiqueta: punto.etiqueta,
        etiquetaX: centro,
        guiaX: centro,
        principal: {
          x: centro - anchoBarra / 2,
          y,
          altura,
          ancho: anchoBarra,
        },
        secundaria: null,
      };
    });
  });

  yDe(valor: number): number {
    const plotH = this.alto - this.arriba - this.abajo;
    return this.arriba + (1 - valor / this.tope()) * plotH;
  }

  /**
   * Pastilla vertical: cúspide semicircular y base alineada al eje.
   */
  trazoBarra(x: number, y: number, ancho: number, altura: number): string {
    if (altura <= 0) {
      return '';
    }

    const radio = Math.min(ancho / 2, altura / 2, 11);
    return [
      `M ${x} ${y + altura}`,
      `L ${x} ${y + radio}`,
      `A ${radio} ${radio} 0 0 1 ${x + radio} ${y}`,
      `L ${x + ancho - radio} ${y}`,
      `A ${radio} ${radio} 0 0 1 ${x + ancho} ${y + radio}`,
      `L ${x + ancho} ${y + altura}`,
      'Z',
    ].join(' ');
  }
}
