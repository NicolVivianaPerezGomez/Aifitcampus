import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ESTADO_ACTIVO,
  RolApi,
  UsuarioAdmin,
  UsuariosService,
} from '../../../../core/services/usuarios.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Gestión de usuarios: lista, creación, cambio de rol y desactivación.
 * Datos del backend: /api/users y /api/roles
 */
@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-admin-usuarios',
  styleUrl: './admin-usuarios.css',
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios implements OnInit {
  private readonly usuariosService = inject(UsuariosService);

  readonly usuarios = signal<UsuarioAdmin[]>([]);
  readonly roles = signal<RolApi[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly mensaje = signal('');

  /** Id del usuario al que se le está cambiando el rol (muestra el selector). */
  readonly editandoRol = signal<number | null>(null);
  busqueda = '';

  // Modal de confirmación
  readonly mostrarModal = signal(false);
  readonly tituloModal = signal('');
  readonly mensajeModal = signal('');
  readonly textoConfirmar = signal('Confirmar');
  private accionPendiente: (() => Promise<void>) | null = null;

  // Formulario de nuevo usuario
  readonly mostrarFormulario = signal(false);
  nuevoUsuario = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: 0,
    programId: 0,
    department: '',
  };

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const [usuarios, roles] = await Promise.all([
        this.usuariosService.listar(this.busqueda.trim()),
        this.usuariosService.listarRoles(),
      ]);
      this.usuarios.set(usuarios);
      this.roles.set(roles);
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible cargar los usuarios.'));
    } finally {
      this.cargando.set(false);
    }
  }

  estaActivo(usuario: UsuarioAdmin): boolean {
    return usuario.statusId === ESTADO_ACTIVO;
  }

  esAdmin(usuario: UsuarioAdmin): boolean {
    return (usuario.role?.name ?? '').toLowerCase().includes('admin');
  }

  async guardarRol(usuario: UsuarioAdmin, roleId: number): Promise<void> {
    this.editandoRol.set(null);
    if (Number(roleId) === usuario.roleId) return;
    await this.ejecutar(
      () => this.usuariosService.cambiarRol(usuario.id, Number(roleId)),
      `Rol de ${usuario.firstName} actualizado`,
    );
  }

  desactivar(usuario: UsuarioAdmin): void {
    this.abrirModal(
      'Desactivar usuario',
      `¿Desactivar a ${usuario.firstName} ${usuario.lastName}? No podrá iniciar sesión.`,
      'Desactivar',
      async () => {
        await this.ejecutar(
          () => this.usuariosService.desactivar(usuario.id),
          `${usuario.firstName} fue desactivado`,
        );
      },
    );
  }

  activar(usuario: UsuarioAdmin): void {
    this.abrirModal(
      'Reactivar usuario',
      `¿Reactivar a ${usuario.firstName} ${usuario.lastName}? Podrá iniciar sesión nuevamente.`,
      'Activar',
      async () => {
        await this.ejecutar(
          () => this.usuariosService.activar(usuario.id),
          `${usuario.firstName} fue reactivado`,
        );
      },
    );
  }

  restablecerContrasena(usuario: UsuarioAdmin): void {
    const nuevaContrasena = prompt(`Nueva contraseña para ${usuario.firstName} ${usuario.lastName} (mínimo 6 caracteres):`);
    if (!nuevaContrasena || nuevaContrasena.length < 6) {
      if (nuevaContrasena !== null) {
        this.error.set('La contraseña debe tener al menos 6 caracteres');
      }
      return;
    }
    this.abrirModal(
      'Restablecer contraseña',
      `¿Restablecer la contraseña de ${usuario.firstName} ${usuario.lastName}?`,
      'Restablecer',
      async () => {
        await this.ejecutar(
          () => this.usuariosService.restablecerContrasena(usuario.id, nuevaContrasena),
          `Contraseña de ${usuario.firstName} restablecida`,
        );
      },
    );
  }

  private abrirModal(
    titulo: string,
    mensaje: string,
    textoConfirmar: string,
    accion: () => Promise<void>,
  ): void {
    this.tituloModal.set(titulo);
    this.mensajeModal.set(mensaje);
    this.textoConfirmar.set(textoConfirmar);
    this.accionPendiente = accion;
    this.mostrarModal.set(true);
  }

  async confirmarModal(): Promise<void> {
    this.mostrarModal.set(false);
    if (this.accionPendiente) {
      const accion = this.accionPendiente;
      this.accionPendiente = null;
      await accion();
    }
  }

  cancelarModal(): void {
    this.mostrarModal.set(false);
    this.accionPendiente = null;
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update((v) => !v);
    if (this.mostrarFormulario()) {
      this.nuevoUsuario = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: 0,
        programId: 0,
        department: '',
      };
    }
  }

  async crearUsuario(): Promise<void> {
    if (!this.nuevoUsuario.firstName.trim() || !this.nuevoUsuario.lastName.trim()) {
      this.error.set('Nombre y apellido son obligatorios');
      return;
    }
    if (!this.nuevoUsuario.email.trim()) {
      this.error.set('El correo es obligatorio');
      return;
    }
    if (!this.nuevoUsuario.password.trim()) {
      this.error.set('La contraseña es obligatoria');
      return;
    }
    if (this.nuevoUsuario.password.trim().length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!this.nuevoUsuario.roleId) {
      this.error.set('Selecciona un rol');
      return;
    }
    if (!this.nuevoUsuario.programId) {
      this.error.set('Selecciona un programa');
      return;
    }

    this.error.set('');
    try {
      await this.usuariosService.crear({
        firstName: this.nuevoUsuario.firstName.trim(),
        lastName: this.nuevoUsuario.lastName.trim(),
        email: this.nuevoUsuario.email.trim(),
        password: this.nuevoUsuario.password.trim(),
        roleId: Number(this.nuevoUsuario.roleId),
        programId: Number(this.nuevoUsuario.programId),
        department: this.nuevoUsuario.department.trim() || undefined,
      });
      this.mensaje.set('Usuario creado exitosamente');
      this.mostrarFormulario.set(false);
      await this.cargar();
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible crear el usuario'));
    }
  }

  private async ejecutar(accion: () => Promise<unknown>, exito: string): Promise<void> {
    this.error.set('');
    this.mensaje.set('');
    try {
      await accion();
      this.mensaje.set(exito);
      await this.cargar();
    } catch (error) {
      this.error.set(mensajeError(error));
    }
  }
}
