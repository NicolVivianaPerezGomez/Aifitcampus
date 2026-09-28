import { Component, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../../../core/interfaces/menu-item';
import { AuthService } from '../../../../core/services/auth.service';
import { UserInfo } from '../../../../shared/components/user-info/user-info';

@Component({
  imports: [MatListModule, MatIconModule, RouterLink, RouterLinkActive, UserInfo],
  selector: 'app-user-sidebar',
  styleUrl: './user-sidebar.css',
  templateUrl: './user-sidebar.html',
})
export class UserSidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Un ítem por sección.
   * Mis pausas incluye historial; Dashboard incluye estadísticas.
   */
  readonly items = signal<MenuItem[]>([
    { path: 'inicio', icon: 'home', label: 'Inicio' },
    { path: 'ejercicios', icon: 'self_improvement', label: 'Ejercicios' },
    { path: 'mis-pausas', icon: 'schedule', label: 'Mis pausas' },
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  ]);

  collapsed = input.required<boolean>();
  closeMenu = output<void>();
  menuClick = output<void>();

  /** Cierra sesión y vuelve al login. */
  cerrarSesion(): void {
    this.auth.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }
}
