import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Rutina, RutinasService, formatearTiempo } from '../../../../core/services/rutinas.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Listado de rutinas. Datos del backend: /api/routines
 */
@Component({
  imports: [RouterLink],
  selector: 'app-admin-rutinas',
  styleUrl: './admin-rutinas.css',
  templateUrl: './admin-rutinas.html',
})
export class AdminRutinas implements OnInit {
  private readonly rutinasService = inject(RutinasService);
  private readonly router = inject(Router);

  readonly rutinas = signal<Rutina[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly formatear = formatearTiempo;

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.rutinas.set(await this.rutinasService.listar());
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible cargar las rutinas.'));
    } finally {
      this.cargando.set(false);
    }
  }

  editar(rutina: Rutina): void {
    void this.router.navigate(['/admin/adminRutinasFormulario'], { queryParams: { id: rutina.id } });
  }

  async inactivar(rutina: Rutina): Promise<void> {
    if (!confirm(`¿Inactivar la rutina "${rutina.name}"?`)) return;
    this.error.set('');
    try {
      const hecho = await this.rutinasService.inactivar(rutina.id, (mensaje) => confirm(mensaje));
      if (hecho) await this.cargar();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }

  async activar(rutina: Rutina): Promise<void> {
    this.error.set('');
    try {
      await this.rutinasService.activar(rutina.id);
      await this.cargar();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }
}
