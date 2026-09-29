/**
 * Tipo de aviso asociado a un ejercicio.
 */
export type TipoAviso = 'notificacion' | 'bloqueo';

/**
 * Tipo de recurso multimedia cargado desde admin.
 */
export type TipoRecurso = 'video' | 'image';

/**
 * Ejercicio del catálogo (espejo de lo que admin crea).
 */
export interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  /** Duración del ejercicio en segundos (campo admin). */
  duracionSegundos: number;
  categoria: string;
  tipoRecurso: TipoRecurso;
  urlRecurso: string;
  /** Imagen de portada / miniatura. */
  miniaturaUrl: string;
  repeticiones: number;
  tipoAviso: TipoAviso;
  activo: boolean;
}

/**
 * Formatea segundos a mm:ss.
 */
export function formatearDuracion(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
