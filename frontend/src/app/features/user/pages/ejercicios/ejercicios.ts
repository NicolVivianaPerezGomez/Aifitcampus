import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { formatearDuracion } from '../../../../core/interfaces/ejercicio';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';

/**
 * Catálogo completo: todos los videos activos agregados desde admin.
 */
@Component({
  selector: 'app-user-ejercicios',
  styleUrl: './ejercicios.css',
  templateUrl: './ejercicios.html',
})
export class Ejercicios {
  private readonly ejerciciosService = inject(EjerciciosService);
  private readonly router = inject(Router);

  readonly ejercicios = this.ejerciciosService.activos;
  readonly formatear = formatearDuracion;

  iniciar(): void {
    void this.router.navigateByUrl('/user/inicio');
  }
}
