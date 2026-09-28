import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InsigniasService } from '../../../../core/services/insignias.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Crear o editar una insignia (con ?id= en la URL se edita).
 * Datos del backend: /api/badges
 */
@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-admin-insignias-formulario',
  styleUrl: './admin-insignias-formulario.css',
  templateUrl: './admin-insignias-formulario.html',
})
export class AdminInsigniasFormulario implements OnInit {
  private readonly insigniasService = inject(InsigniasService);
  private readonly router = inject(Router);
  private readonly idInsignia = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('id')) || null;

  readonly editando = this.idInsignia !== null;
  readonly guardando = signal(false);
  readonly error = signal('');

  nombre = '';
  descripcion = '';
  condicion = '';
  meta: number | null = null;
  activa = true;

  async ngOnInit(): Promise<void> {
    if (this.idInsignia) {
      try {
        const insignia = await this.insigniasService.obtener(this.idInsignia);
        this.nombre = insignia.name;
        this.descripcion = insignia.description ?? '';
        this.condicion = insignia.condition ?? '';
        this.meta = insignia.targetValue;
        this.activa = insignia.isActive;
      } catch (error) {
        this.error.set(mensajeError(error, 'No fue posible cargar la insignia.'));
      }
    }
  }

  async guardar(): Promise<void> {
    this.error.set('');

    if (this.nombre.trim().length < 3) return this.error.set('El nombre debe tener al menos 3 caracteres.');

    this.guardando.set(true);
    try {
      const datos = {
        name: this.nombre.trim(),
        description: this.descripcion.trim(),
        condition: this.condicion.trim(),
        targetValue: this.meta ?? undefined,
      };

      if (this.editando && this.idInsignia) {
        await this.insigniasService.editar(this.idInsignia, { ...datos, isActive: this.activa });
      } else {
        const creada = await this.insigniasService.crear(datos);
        if (!this.activa) await this.insigniasService.eliminar(creada.id);
      }
      void this.router.navigateByUrl('/admin/adminInsignias');
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible guardar la insignia.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
