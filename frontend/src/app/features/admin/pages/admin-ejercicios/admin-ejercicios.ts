import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { formatearDuracion } from '../../../../core/interfaces/ejercicio';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';
import { mensajeError } from '../../../../core/services/api-error';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-ejercicios',
  styleUrl: './admin-ejercicios.css',
  templateUrl: './admin-ejercicios.html',
})
export class AdminEjercicios {
  private readonly ejerciciosService = inject(EjerciciosService);
  private readonly router = inject(Router);

  readonly ejercicios = this.ejerciciosService.catalogo;
  readonly formatear = formatearDuracion;

  readonly error = signal('');

  constructor() {
    void this.ejerciciosService.cargar();
  }

  editar(id: string): void {
    void this.router.navigate(['/admin/adminEjerciciosFormulario'], { queryParams: { id } });
  }

  /** En el backend el ejercicio queda inactivo (no se borra). */
  async eliminar(id: string): Promise<void> {
    this.error.set('');
    try {
      await this.ejerciciosService.eliminar(id);
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }

  /** Reactiva un ejercicio inactivo. */
  async activar(id: string): Promise<void> {
    this.error.set('');
    try {
      await this.ejerciciosService.activar(id);
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }
}
