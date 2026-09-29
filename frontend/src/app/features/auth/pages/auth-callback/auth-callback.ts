import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Recibe el token que envía el backend después del login con Microsoft
 * (/auth/callback#token=...), lo guarda y lleva al tablero según el rol.
 */
@Component({
  selector: 'app-auth-callback',
  template: `<p style="padding: 2rem; text-align: center">Iniciando sesión...</p>`,
})
export class AuthCallback implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    const token = new URLSearchParams(window.location.hash.substring(1)).get('token');

    if (!token) {
      void this.router.navigate(['/login'], { queryParams: { error: 'No se recibió el token de acceso.' } });
      return;
    }

    try {
      await this.auth.completarInicioSesion(token);
      void this.router.navigateByUrl(this.auth.rutaInicio());
    } catch (error) {
      void this.router.navigate(['/login'], {
        queryParams: { error: mensajeError(error, 'No fue posible cargar tu usuario. Intenta de nuevo.') },
      });
    }
  }
}
