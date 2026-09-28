import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { formatearDuracion } from '../../../../core/interfaces/ejercicio';
import { AuthService } from '../../../../core/services/auth.service';
import { PausasUsuarioService } from '../../../../core/services/pausas-usuario.service';
import { TarjetaKpi } from '../../../../shared/components/tarjeta-kpi/tarjeta-kpi';
import { ResumenMisPausas } from '../../../../core/interfaces/mis-pausas';
import { Subscription } from 'rxjs';

/**
 * Historial activo, racha y porcentajes de cumplimiento del colaborador.
 */
@Component({
  imports: [RouterLink, TarjetaKpi],
  selector: 'app-user-mis-pausas',
  styleUrl: './mis-pausas.css',
  templateUrl: './mis-pausas.html',
})
export class MisPausas implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly pausas = inject(PausasUsuarioService);
  private readonly suscripcion: Subscription;

  readonly usuario = this.auth.usuarioActual;
  readonly resumen = signal<ResumenMisPausas | null>(null);
  readonly formatear = formatearDuracion;

  constructor() {
    this.suscripcion = this.pausas.resumen$.subscribe((data) => {
      this.resumen.set(data);
    });
  }

  ngOnInit(): void {
    void this.cargar();
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  async cargar(): Promise<void> {
    const data = await this.pausas.obtenerResumen();
    this.resumen.set(data);
  }
}