import { EstadoAnimo } from '../interfaces/animo';

/**
 * Modelo de una sesión de pausa activa en curso.
 * Encapsula el ánimo reportado y el instante de inicio.
 */
export class SesionPausa {
  constructor(
    public animoInicial: EstadoAnimo | null = null,
    public fechaInicio: Date = new Date()
  ) {}

  /**
   * Indica si el usuario ya eligió cómo se siente.
   */
  tieneAnimo(): boolean {
    return this.animoInicial !== null;
  }
}
