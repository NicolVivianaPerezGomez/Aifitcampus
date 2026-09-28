import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { GraficoBarras } from '../../../../shared/components/grafico-barras/grafico-barras';
import { TarjetaKpi } from '../../../../shared/components/tarjeta-kpi/tarjeta-kpi';
import { ResumenUsuario } from '../../../../core/interfaces/estadisticas';

/**
 * Indicadores personales de cumplimiento, racha y actividad semanal.
 */
@Component({
  imports: [TarjetaKpi, GraficoBarras],
  selector: 'app-user-estadisticas',
  styleUrl: './estadisticas.css',
  templateUrl: './estadisticas.html',
})
export class Estadisticas {
  private readonly auth = inject(AuthService);
  private readonly estadisticas = inject(EstadisticasService);

  readonly usuario = this.auth.usuarioActual;
  readonly resumen = signal<ResumenUsuario | null>(null);

  constructor() {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    const nombre = this.usuario()?.nombre ?? 'Usuario';
    const data = await this.estadisticas.obtenerResumenUsuario(nombre);
    this.resumen.set(data);
  }
}
