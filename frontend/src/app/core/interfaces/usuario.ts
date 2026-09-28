/**
 * Roles permitidos dentro de la plataforma.
 */
export type RolUsuario = 'admin' | 'usuario';

/**
 * Representa a un colaborador o administrador autenticado.
 */
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: RolUsuario;
  iniciales: string;
  pausasCompletadas?: number;
}

/**
 * Credenciales enviadas desde el formulario de acceso.
 */
export interface CredencialesLogin {
  correo: string;
  contrasena: string;
  recordar: boolean;
}

/**
 * Datos capturados en el registro de un nuevo usuario.
 */
export interface RegistroUsuario {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
}
