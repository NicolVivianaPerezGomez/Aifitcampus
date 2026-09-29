import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LogoUniempresarial } from '../../../../shared/components/logo-uniempresarial/logo-uniempresarial';
import { PanelBienvenida } from '../../components/panel-bienvenida/panel-bienvenida';

/**
 * Pantalla de inicio de sesión institucional.
 * El acceso es con Microsoft 365 (redirección al backend).
 */
@Component({
  imports: [RouterLink, LogoUniempresarial, PanelBienvenida],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);

  /** Error enviado por el backend o por el callback (?error=...) */
  readonly error = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('error') ?? '');

  /** Mensaje de éxito después de un registro exitoso (?registro=exitoso) */
  readonly exito = signal(
    inject(ActivatedRoute).snapshot.queryParamMap.get('registro') === 'exitoso'
      ? '¡Cuenta creada con éxito! Ahora inicia sesión con tu cuenta Microsoft.'
      : ''
  );

  /**
   * Inicia sesión con Microsoft 365.
   */
  entrar(): void {
    this.auth.iniciarSesionMicrosoft();
  }
}
