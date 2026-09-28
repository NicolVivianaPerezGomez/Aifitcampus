import { Component, computed, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  selector: 'app-user-info',
  styleUrl: './user-info.css',
  templateUrl: './user-info.html',
})
export class UserInfo {
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
