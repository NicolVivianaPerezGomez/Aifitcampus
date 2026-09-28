import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { LogoUniempresarial } from '../../../../shared/components/logo-uniempresarial/logo-uniempresarial';
import { PanelBienvenida } from '../../components/panel-bienvenida/panel-bienvenida';

/**
 * Pantalla de inicio de sesión institucional.
 * El acceso es con correo y contraseña (validados contra la BD).
 */
@Component({
  imports: [FormsModule, RouterLink, LogoUniempresarial, PanelBienvenida],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Error enviado por el backend o por el callback (?error=...) */
  readonly error = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('error') ?? '');
  readonly cargando = signal(false);

  correo = '';
  clave = '';

  /**
   * Inicia sesión con correo y contraseña.
   */
  async entrar(): Promise<void> {
    this.error.set('');
    this.cargando.set(true);

    try {
      await this.auth.iniciarSesionLocal(this.correo.trim(), this.clave);
      void this.router.navigateByUrl(this.auth.rutaInicio());
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error.error?.message || `Error ${error.status}: ${error.statusText}`);
      } else {
        this.error.set(error instanceof Error ? error.message : 'No fue posible iniciar sesión');
      }
    } finally {
      this.cargando.set(false);
    }
  }
}
