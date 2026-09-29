import { Component, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '../../../../core/interfaces/menu-item';
import { Router, RouterLink } from '@angular/router';
import { UserInfo } from '../../../../shared/components/user-info/user-info';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  imports: [MatListModule, MatIconModule, RouterLink, UserInfo],
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.css',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /* items que se rendeizan en el menu de tipo MenuItem(una interface)*/
  items = signal<MenuItem[]>([
    { path: 'adminDashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'adminEjercicios', icon: 'self_improvement', label: 'Ejercicios' },
    { path: 'adminRutinas', icon: 'fitness_center', label: 'Rutinas' },
    { path: 'adminUsuarios', icon: 'group', label: 'Usuarios' },
    { path: 'adminInsignias', icon: 'emoji_events', label: 'Insignias' },
    { path: 'adminAuditoria', icon: 'history', label: 'Auditoría' },
    { path: 'notificaciones', icon: 'notifications', label: 'Notificaciones' },
  ]);

  //propiedad de entrada del user-layout (true o false) para saber si el menu esta colapsado o no
  collapsed = input.required<boolean>(); //input es obligatorio que llegue en boolean

  /* se envia el dato al user-layout si el menu esta cerrado o no con evento click */
  toggleMenu = output<void>();
  menuClick = output<void>();

  /** Usa AuthService.cerrarSesion y redirige a /login. */
  cerrarSesion(): void {
    this.auth.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }
}
