import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Tipo de rutina (GET /api/routine-types) */
export interface TipoRutina {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

/** Ejercicio dentro de una rutina */
export interface EjercicioDeRutina {
  exerciseId: number;
  orderIndex: number;
  sets: number | null;
  reps: number | null;
  restSeconds: number | null;
  exercise: { id: number; name: string; durationSeconds: number | null } | null;
}

/** Rutina tal como la devuelve el backend (GET /api/routines) */
export interface Rutina {
  id: number;
  name: string;
  description: string | null;
  totalDurationSeconds: number | null;
  isActive: boolean;
  routineTypeId: number | null;
  routineType: TipoRutina | null;
  exercises: EjercicioDeRutina[];
}

/** Datos para crear o editar una rutina */
export interface RutinaInput {
  name: string;
  description?: string;
  routineTypeId: number;
  exercises: { exerciseId: number; orderIndex: number; sets?: number; reps?: number; restSeconds?: number }[];
  isActive?: boolean;
}

/**
 * Rutinas y tipos de rutina para el administrador.
 * Endpoints: /api/routines y /api/routine-types
 */
@Injectable({ providedIn: 'root' })
export class RutinasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/routines`;
  private readonly urlTipos = `${environment.apiUrl}/routine-types`;

  listar(): Promise<Rutina[]> {
    return firstValueFrom(this.http.get<Rutina[]>(this.url));
  }

  obtener(id: number): Promise<Rutina> {
    return firstValueFrom(this.http.get<Rutina>(`${this.url}/${id}`));
  }

  crear(datos: RutinaInput): Promise<Rutina> {
    return firstValueFrom(this.http.post<Rutina>(this.url, datos));
  }

  editar(id: number, datos: Partial<RutinaInput>): Promise<Rutina> {
    return firstValueFrom(this.http.patch<Rutina>(`${this.url}/${id}`, datos));
  }

  /**
   * Inactiva la rutina. Si se realizó en los últimos 7 días, el backend pide
   * confirmación: se le pregunta al administrador y se reintenta con confirm=true.
   */
  async inactivar(id: number, confirmar: (mensaje: string) => boolean): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.url}/${id}`));
      return true;
    } catch (error) {
      const mensaje = (error as HttpErrorResponse).error?.message as string | undefined;
      if (error instanceof HttpErrorResponse && error.status === 409 && mensaje?.includes('confirm')) {
        if (!confirmar(mensaje.replace(' Confirme la inactivación con ?confirm=true', ' ¿Deseas inactivarla de todos modos?'))) {
          return false;
        }
        await firstValueFrom(this.http.delete(`${this.url}/${id}`, { params: { confirm: 'true' } }));
        return true;
      }
      throw error;
    }
  }

  /** Reactiva una rutina inactiva. */
  async activar(id: number): Promise<void> {
    await firstValueFrom(this.http.patch(`${this.url}/${id}`, { isActive: true }));
  }

  listarTipos(): Promise<TipoRutina[]> {
    return firstValueFrom(this.http.get<TipoRutina[]>(this.urlTipos));
  }

  /** Busca el tipo por nombre (sin importar mayúsculas); si no existe lo crea, y si está inactivo lo reactiva. */
  async obtenerIdTipo(nombre: string): Promise<number> {
    const tipos = await this.listarTipos();
    const existente = tipos.find((t) => t.name.toLowerCase() === nombre.trim().toLowerCase());
    if (existente) {
      if (!existente.isActive) {
        await firstValueFrom(this.http.patch(`${this.urlTipos}/${existente.id}`, { isActive: true }));
      }
      return existente.id;
    }
    const nuevo = await firstValueFrom(this.http.post<TipoRutina>(this.urlTipos, { name: nombre.trim() }));
    return nuevo.id;
  }
}

/** Formatea segundos como "3 min 10 s". */
export function formatearTiempo(segundos: number | null): string {
  const total = Math.max(0, segundos ?? 0);
  const min = Math.floor(total / 60);
  const s = total % 60;
  if (min === 0) return `${s} s`;
  return s === 0 ? `${min} min` : `${min} min ${s} s`;
}
