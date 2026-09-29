import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../interfaces/usuario';

const CLAVE_TOKEN = 'pausas-activas-token';
const CLAVE_SESION = 'pausas-activas-sesion';

/** Usuario tal como lo devuelve el backend en GET /api/auth/me */
interface UsuarioApi {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: { id: number; name: string } | null;
}

/**
 * Gestiona el inicio de sesión con Microsoft 365 (a través del backend),
 * el token JWT y la sesión local del usuario.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Usuario autenticado en memoria. Null si no hay sesión. */
  readonly usuarioActual = signal<Usuario | null>(this.recuperarSesion());

  /**
   * Lleva al backend, que redirige al login de Microsoft.
   * Al terminar, el backend vuelve a /auth/callback#token=...
   */
  iniciarSesionMicrosoft(): void {
    window.location.href = `${environment.apiUrl}/auth/microsoft`;
  }

  /**
   * Guarda el token recibido del backend y carga los datos del usuario (GET /auth/me).
   */
  async completarInicioSesion(token: string): Promise<Usuario> {
    localStorage.setItem(CLAVE_TOKEN, token);
    try {
      const api = await firstValueFrom(this.http.get<UsuarioApi>(`${environment.apiUrl}/auth/me`));
      const usuario = this.convertirUsuario(api);
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
      this.usuarioActual.set(usuario);
      return usuario;
    } catch (error) {
      this.cerrarSesion();
      throw error;
    }
  }

  /** Token JWT de la sesión actual (lo usa el interceptor). */
  obtenerToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  /**
   * Cierra la sesión y limpia el almacenamiento local.
   */
  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
    this.usuarioActual.set(null);
  }

  /**
   * True cuando existe un usuario autenticado con token.
   */
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null && this.obtenerToken() !== null;
  }

  /**
   * True cuando el usuario actual tiene rol de administrador.
   */
  esAdministrador(): boolean {
    return this.usuarioActual()?.rol === 'admin';
  }

  /** Ruta de inicio según el rol del usuario. */
  rutaInicio(): string {
    return this.esAdministrador() ? '/admin/adminDashboard' : '/user/inicio';
  }

  /**
   * Convierte el usuario del backend al formato que usa el frontend.
   * Es administrador si el nombre de su rol contiene "admin".
   */
  private convertirUsuario(api: UsuarioApi): Usuario {
    const nombreRol = api.role?.name?.toLowerCase() ?? '';
    return {
      id: String(api.id),
      nombre: api.firstName,
      apellido: api.lastName,
      correo: api.email,
      rol: nombreRol.includes('admin') ? 'admin' : 'usuario',
      iniciales: this.obtenerIniciales(api.firstName, api.lastName),
    };
  }

  /**
   * Recupera una sesión previa al recargar la aplicación.
   */
  private recuperarSesion(): Usuario | null {
    const crudo = localStorage.getItem(CLAVE_SESION);
    if (!crudo || !localStorage.getItem(CLAVE_TOKEN)) {
      return null;
    }
    try {
      return JSON.parse(crudo) as Usuario;
    } catch {
      return null;
    }
  }

  /**
   * Obtiene las iniciales a partir del nombre y el apellido.
   */
  private obtenerIniciales(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }
}
