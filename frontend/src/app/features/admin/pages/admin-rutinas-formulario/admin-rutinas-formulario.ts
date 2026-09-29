import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';
import { RutinaInput, RutinasService, formatearTiempo } from '../../../../core/services/rutinas.service';
import { mensajeError } from '../../../../core/services/api-error';

/** Un ejercicio del catálogo con sus parámetros dentro de la rutina. */
interface FilaEjercicio {
  exerciseId: number;
  nombre: string;
  duracionSegundos: number;
  seleccionado: boolean;
  orden: number;
  series: number | null;
  repeticiones: number | null;
  descanso: number | null;
}

/**
 * Crear o editar una rutina (con ?id= en la URL se edita).
 * Datos del backend: /api/routines, /api/routine-types y /api/exercises
 */
@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-admin-rutinas-formulario',
  styleUrl: './admin-rutinas-formulario.css',
  templateUrl: './admin-rutinas-formulario.html',
})
export class AdminRutinasFormulario implements OnInit {
  private readonly rutinasService = inject(RutinasService);
  private readonly ejerciciosService = inject(EjerciciosService);
  private readonly router = inject(Router);
  private readonly idRutina = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('id')) || null;

  readonly editando = this.idRutina !== null;
  readonly tipos = signal<string[]>([]);
  readonly filas = signal<FilaEjercicio[]>([]);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly formatear = formatearTiempo;

  nombre = '';
  descripcion = '';
  tipo = '';
  activa = true;

  async ngOnInit(): Promise<void> {
    try {
      await this.ejerciciosService.cargar();
      const [tiposApi, rutina] = await Promise.all([
        this.rutinasService.listarTipos(),
        this.idRutina ? this.rutinasService.obtener(this.idRutina) : Promise.resolve(null),
      ]);

      // Tipos activos del backend
      const nombres = tiposApi.filter((t) => t.isActive).map((t) => t.name);
      this.tipos.set(nombres);

      // Ejercicios activos del catálogo
      this.filas.set(
        this.ejerciciosService.activos().map((e, i) => ({
          exerciseId: Number(e.id),
          nombre: e.nombre,
          duracionSegundos: e.duracionSegundos,
          seleccionado: false,
          orden: i + 1,
          series: null,
          repeticiones: null,
          descanso: null,
        })),
      );

      // Si se está editando, se llenan los datos de la rutina
      if (rutina) {
        this.nombre = rutina.name;
        this.descripcion = rutina.description ?? '';
        this.tipo = rutina.routineType?.name ?? '';
        this.activa = rutina.isActive;
        if (this.tipo && !this.tipos().includes(this.tipo)) this.tipos.update((t) => [this.tipo, ...t]);
        for (const item of rutina.exercises) {
          const fila = this.filas().find((f) => f.exerciseId === item.exerciseId);
          if (fila) {
            fila.seleccionado = true;
            fila.orden = item.orderIndex;
            fila.series = item.sets;
            fila.repeticiones = item.reps;
            fila.descanso = item.restSeconds;
          }
        }
      }
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible cargar los datos del formulario.'));
    }
  }

  /** Duración estimada, con la misma regla del backend: duración × series + descanso. */
  duracionTotal(): number {
    return this.filas()
      .filter((f) => f.seleccionado)
      .reduce((total, f) => total + f.duracionSegundos * (f.series || 1) + (f.descanso || 0), 0);
  }

  async guardar(): Promise<void> {
    this.error.set('');
    const seleccionadas = this.filas().filter((f) => f.seleccionado);

    if (this.nombre.trim().length < 3) return this.error.set('El nombre debe tener al menos 3 caracteres.');
    if (!this.tipo) return this.error.set('Selecciona el tipo de rutina.');
    if (seleccionadas.length === 0) return this.error.set('Marca al menos un ejercicio.');
    const ordenes = seleccionadas.map((f) => f.orden);
    if (new Set(ordenes).size !== ordenes.length) return this.error.set('Hay ejercicios con el mismo orden.');

    this.guardando.set(true);
    try {
      const datos: RutinaInput = {
        name: this.nombre.trim(),
        description: this.descripcion.trim(),
        routineTypeId: await this.rutinasService.obtenerIdTipo(this.tipo),
        exercises: seleccionadas.map((f) => ({
          exerciseId: f.exerciseId,
          orderIndex: Number(f.orden),
          ...(f.series ? { sets: Number(f.series) } : {}),
          ...(f.repeticiones ? { reps: Number(f.repeticiones) } : {}),
          ...(f.descanso !== null && f.descanso !== undefined ? { restSeconds: Number(f.descanso) } : {}),
        })),
      };

      if (this.editando && this.idRutina) {
        await this.rutinasService.editar(this.idRutina, { ...datos, isActive: this.activa });
      } else {
        const creada = await this.rutinasService.crear(datos);
        // El backend crea las rutinas activas: si se desmarcó, se inactiva
        if (!this.activa) await this.rutinasService.inactivar(creada.id, () => true);
      }
      void this.router.navigateByUrl('/admin/adminRutinas');
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible guardar la rutina.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
