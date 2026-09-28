import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/** Usuario tal como lo devuelve el backend (GET /api/users) */
export interface UsuarioAdmin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: { id: number; name: string } | null;
  statusId: number;
  department: string | null;
  createdAt: string;
}

/** Rol tal como lo devuelve el backend (GET /api/roles) */
export interface RolApi {
  id: number;
  name: string;
}

/** Valor de users.status_id para una cuenta activa (igual que en el backend). */
export const ESTADO_ACTIVO = 1;

/**
 * Gestión de usuarios y roles para el administrador.
 * Endpoints: /api/users y /api/roles
 */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly api = environment.apiUrl;

  listar(busqueda = ''): Promise<UsuarioAdmin[]> {
    const params: Record<string, string> = busqueda ? { search: busqueda } : {};
    return firstValueFrom(this.http.get<UsuarioAdmin[]>(`${this.api}/users`, { params }));
  }

  listarRoles(): Promise<RolApi[]> {
    return firstValueFrom(this.http.get<RolApi[]>(`${this.api}/roles`));
  }

  cambiarRol(userId: number, roleId: number): Promise<unknown> {
    return firstValueFrom(this.http.patch(`${this.api}/users/${userId}/role`, { roleId }));
  }

  desactivar(userId: number): Promise<unknown> {
    return firstValueFrom(this.http.patch(`${this.api}/users/${userId}/deactivate`, {}));
  }

  activar(userId: number): Promise<unknown> {
    return firstValueFrom(this.http.patch(`${this.api}/users/${userId}/activate`, {}));
  }

  restablecerContrasena(userId: number, password: string): Promise<unknown> {
    return firstValueFrom(this.http.patch(`${this.api}/users/${userId}/reset-password`, { password }));
  }

  crear(datos: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: number;
    programId: number;
    department?: string;
  }): Promise<unknown> {
    return firstValueFrom(this.http.post(`${this.api}/auth/register`, datos));
  }

  actualizarPerfil(datos: {
    programId: number;
    department?: string;
  }): Promise<unknown> {
    const usuarioId = this.auth.usuarioActual()?.id;
    if (!usuarioId) return Promise.reject(new Error('No hay usuario autenticado'));
    return firstValueFrom(this.http.patch(`${this.api}/users/${usuarioId}/profile`, datos));
  }
}
