import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ejercicio, TipoAviso, TipoRecurso } from '../interfaces/ejercicio';

export interface NuevoEjercicioInput {
  nombre: string;
  descripcion: string;
  duracionSegundos: number;
  categoria: string;
  tipoRecurso: TipoRecurso;
  urlRecurso: string;
  repeticiones: number;
  tipoAviso: TipoAviso;
  activo: boolean;
}

/** Ejercicio tal como lo devuelve el backend (GET /api/exercises) */
interface EjercicioApi {
  id: number;
  name: string;
  description: string | null;
  durationSeconds: number | null;
  resourceType: string | null;
  resourceUrl: string | null;
  isActive: boolean;
  categoryId: number | null;
  category: { id: number; name: string } | null;
}

/** Categoría tal como la devuelve el backend (GET /api/exercise-categories) */
interface CategoriaApi {
  id: number;
  name: string;
  isActive: boolean;
}

const EXTENSIONES_IMAGEN = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

/**
 * Catálogo de ejercicios compartido entre admin y colaborador.
 * Los datos vienen del backend: /api/exercises y /api/exercise-categories.
 */
@Injectable({ providedIn: 'root' })
export class EjerciciosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/exercises`;
  private readonly urlCategorias = `${environment.apiUrl}/exercise-categories`;

  private readonly _catalogo = signal<Ejercicio[]>([]);

  /** Todo el catálogo (admin), incluidos los inactivos. */
  readonly catalogo = this._catalogo.asReadonly();

  /** Solo ejercicios activos (usuario). */
  readonly activos = computed(() => this._catalogo().filter((e) => e.activo && !!e.urlRecurso));

  /** True mientras se consulta el backend. */
  readonly cargando = signal(false);

  constructor() {
    void this.cargar();
  }

  /** Vuelve a traer el catálogo desde el backend. */
  async cargar(): Promise<void> {
    this.cargando.set(true);
    try {
      const lista = await firstValueFrom(this.http.get<EjercicioApi[]>(this.url));
      this._catalogo.set(lista.map((e) => this.convertir(e)));
    } catch {
      // Si falla (por ejemplo, sin sesión) se deja el catálogo vacío
      this._catalogo.set([]);
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Crea el ejercicio en el backend. La categoría se busca por nombre y,
   * si todavía no existe, se crea.
   */
  async crear(input: NuevoEjercicioInput): Promise<Ejercicio> {
    const categoryId = await this.obtenerIdCategoria(input.categoria);

    const creado = await firstValueFrom(
      this.http.post<EjercicioApi>(this.url, {
        name: input.nombre.trim(),
        description: input.descripcion.trim(),
        durationSeconds: Math.max(1, Math.floor(input.duracionSegundos)),
        resourceUrl: input.urlRecurso.trim(),
        categoryId,
      }),
    );

    // El backend crea los ejercicios activos: si se marcó inactivo, se inactiva
    if (!input.activo) {
      await firstValueFrom(this.http.delete(`${this.url}/${creado.id}`));
    }

    await this.cargar();
    return this.obtenerPorId(String(creado.id)) ?? this.convertir(creado);
  }

  /** "Elimina" el ejercicio: en el backend queda inactivo. */
  async eliminar(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.url}/${id}`));
    await this.cargar();
  }

  /** Reactiva un ejercicio inactivo. */
  async activar(id: string): Promise<void> {
    await firstValueFrom(this.http.patch(`${this.url}/${id}`, { isActive: true }));
    await this.cargar();
  }

  /** Actualiza un ejercicio existente. */
  async editar(
    id: string,
    datos: {
      name?: string;
      description?: string;
      durationSeconds?: number;
      resourceUrl?: string;
      categoryId?: number;
      isActive?: boolean;
    },
  ): Promise<Ejercicio> {
    const actualizado = await firstValueFrom(
      this.http.patch<EjercicioApi>(`${this.url}/${id}`, datos),
    );
    await this.cargar();
    return this.obtenerPorId(String(actualizado.id)) ?? this.convertir(actualizado);
  }

  obtenerPorId(id: string): Ejercicio | undefined {
    return this._catalogo().find((e) => e.id === id);
  }

  /** Busca la categoría por nombre (sin importar mayúsculas); si no existe, la crea. */
  async obtenerIdCategoria(nombre: string): Promise<number> {
    const categorias = await firstValueFrom(this.http.get<CategoriaApi[]>(this.urlCategorias));
    const existente = categorias.find((c) => c.name.toLowerCase() === nombre.trim().toLowerCase());

    if (existente) {
      if (!existente.isActive) {
        await firstValueFrom(this.http.patch(`${this.urlCategorias}/${existente.id}`, { isActive: true }));
      }
      return existente.id;
    }

    const nueva = await firstValueFrom(this.http.post<CategoriaApi>(this.urlCategorias, { name: nombre.trim() }));
    return nueva.id;
  }

  /**
   * Convierte el ejercicio del backend al formato del frontend.
   * No se inventan valores: solo se usan los datos que existen en la base de datos.
   */
  private convertir(api: EjercicioApi): Ejercicio {
    const url = api.resourceUrl ?? '';
    const esImagen = EXTENSIONES_IMAGEN.test(url);
    return {
      id: String(api.id),
      nombre: api.name,
      descripcion: api.description ?? '',
      duracionSegundos: api.durationSeconds ?? 0,
      categoria: api.category?.name ?? 'Sin categoría',
      tipoRecurso: esImagen ? 'image' : 'video',
      urlRecurso: url,
      miniaturaUrl: esImagen ? url : '',
      repeticiones: 0,
      tipoAviso: 'notificacion' as const,
      activo: api.isActive,
    };
  }
}
