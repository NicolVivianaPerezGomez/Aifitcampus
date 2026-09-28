import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { PausasUsuarioService } from '../../../../core/services/pausas-usuario.service';
import { HistorialPausa } from '../../../../core/interfaces/mis-pausas';

/**
 * Perfil e historial reciente de pausas del colaborador.
 */
@Component({
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly pausas = inject(PausasUsuarioService);

  readonly usuario = this.auth.usuarioActual;
  readonly historial = signal<HistorialPausa[]>([]);

  constructor() {
    void this.cargarHistorial();
  }

  async cargarHistorial(): Promise<void> {
    const resumen = await this.pausas.obtenerResumen();
    this.historial.set(resumen.historial);
  }
}
