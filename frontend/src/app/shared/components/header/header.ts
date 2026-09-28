import { Component, computed, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  menuClick = output<void>(); //información que se envia a "admin-layout" de que se hace click

  private readonly auth = inject(AuthService);

  readonly userName = computed(() => {
    const u = this.auth.usuarioActual();
    return u ? `${u.nombre} ${u.apellido}`.trim() : 'Invitado';
  });

  readonly userType = computed(() => {
    const u = this.auth.usuarioActual();
    if (!u) return 'Sin sesión';
    return u.rol === 'admin' ? 'Administrador' : 'Usuario';
  });
}
