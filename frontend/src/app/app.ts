import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { BarraAccesibilidad } from './shared/components/barra-accesibilidad/barra-accesibilidad';

@Component({
  imports: [RouterOutlet, BarraAccesibilidad],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pausas-activas-frontend');
  /** Solo mostrar accesibilidad con sesión activa (después del login). */
  protected readonly auth = inject(AuthService);
}
