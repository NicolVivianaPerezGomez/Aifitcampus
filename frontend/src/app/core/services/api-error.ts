import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae el mensaje de error que envía el backend ({ message: "..." }).
 */
export function mensajeError(error: unknown, porDefecto = 'Ocurrió un error. Intenta de nuevo.'): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'No hay conexión con el servidor. ¿Está corriendo el backend?';
    const mensaje = (error.error as { message?: string } | null)?.message;
    if (mensaje) return mensaje;
  }
  return porDefecto;
}
