import { Component, inject, signal } from '@angular/core';
import { PuntoGrafico } from '../../../../core/interfaces/estadisticas';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { GraficoArea } from '../../../../shared/components/grafico-area/grafico-area';
import { GraficoBarras } from '../../../../shared/components/grafico-barras/grafico-barras';
import { GraficoBarrasHorizontales } from '../../../../shared/components/grafico-barras-horizontales/grafico-barras-horizontales';
import { GraficoLineas } from '../../../../shared/components/grafico-lineas/grafico-lineas';
import { TarjetaKpi } from '../../../../shared/components/tarjeta-kpi/tarjeta-kpi';
import { ResumenEstadisticas } from '../../../../core/interfaces/estadisticas';

/**
 * Panel de estadísticas del administrador.
 */
@Component({
  imports: [TarjetaKpi, GraficoBarras, GraficoLineas, GraficoArea, GraficoBarrasHorizontales],
  selector: 'app-admin-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly estadisticas = inject(EstadisticasService);

  /** Indicadores, series y ranking que se pintan en el tablero. */
  readonly resumen = signal<ResumenEstadisticas | null>(null);

  constructor() {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    const data = await this.estadisticas.obtenerResumenAdmin();
    this.resumen.set(data);
  }

  /**
   * Adapta los ejercicios populares al formato de los gráficos.
   */
  puntosEjercicios(
    ejercicios: { exerciseId: number; nombre: string; vecesUsado: number }[] | undefined
  ): PuntoGrafico[] {
    return (ejercicios ?? []).map((ejercicio) => ({
      etiqueta: ejercicio.nombre,
      valor: ejercicio.vecesUsado,
    }));
  }
}
