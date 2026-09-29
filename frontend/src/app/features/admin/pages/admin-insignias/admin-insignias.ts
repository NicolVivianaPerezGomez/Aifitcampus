import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Insignia, InsigniasService } from '../../../../core/services/insignias.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Listado de insignias. Datos del backend: /api/badges
 */
@Component({
  imports: [RouterLink],
  selector: 'app-admin-insignias',
  styleUrl: './admin-insignias.css',
  templateUrl: './admin-insignias.html',
})
export class AdminInsignias implements OnInit {
  private readonly insigniasService = inject(InsigniasService);
  private readonly router = inject(Router);

  readonly insignias = signal<Insignia[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.insignias.set(await this.insigniasService.listar());
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible cargar las insignias.'));
    } finally {
      this.cargando.set(false);
    }
  }

  editar(insignia: Insignia): void {
    void this.router.navigate(['/admin/adminInsigniasFormulario'], { queryParams: { id: insignia.id } });
  }

  async inactivar(insignia: Insignia): Promise<void> {
    if (!confirm(`¿Inactivar la insignia "${insignia.name}"?`)) return;
    this.error.set('');
    try {
      await this.insigniasService.eliminar(insignia.id);
      await this.cargar();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }
}
