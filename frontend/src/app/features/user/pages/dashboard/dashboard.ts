import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';
import { EstadisticasService } from '../../../../core/services/estadisticas.service';
import { GraficoBarras } from '../../../../shared/components/grafico-barras/grafico-barras';
import { TarjetaKpi } from '../../../../shared/components/tarjeta-kpi/tarjeta-kpi';
import { ResumenUsuario } from '../../../../core/interfaces/estadisticas';

/**
 * Dashboard del colaborador: próxima pausa, indicadores y ejercicios del bloque.
 */
@Component({
  imports: [RouterLink, TarjetaKpi, GraficoBarras],
  selector: 'app-user-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly estadisticas = inject(EstadisticasService);
  private readonly ejerciciosService = inject(EjerciciosService);

  readonly usuario = this.auth.usuarioActual;
  readonly resumen = signal<ResumenUsuario | null>(null);
  readonly ejercicios = this.ejerciciosService.activos;

  constructor() {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    const nombre = this.usuario()?.nombre ?? 'Usuario';
    const data = await this.estadisticas.obtenerResumenUsuario(nombre);
    this.resumen.set(data);
  }
}
