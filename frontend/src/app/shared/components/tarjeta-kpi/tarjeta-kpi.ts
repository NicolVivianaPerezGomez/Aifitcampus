import { Component, input } from '@angular/core';

/**
 * Variantes de acento con la paleta institucional (navy, magenta, primary, secondary, pink-soft).
 */
export type AcentoKpi = 'azul' | 'rosa' | 'verde' | 'coral' | 'ambar';

/**
 * Tarjeta KPI: cifra serif e icono squircle con glifo blanco.
 */
@Component({
  selector: 'app-tarjeta-kpi',
  templateUrl: './tarjeta-kpi.html',
  styleUrl: './tarjeta-kpi.css',
})
export class TarjetaKpi {
  readonly valor = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly detalle = input('');
  readonly acento = input<AcentoKpi>('azul');
}
