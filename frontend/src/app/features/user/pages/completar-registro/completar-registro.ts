import { Component, inject, signal } from '@angular/core';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Página para que el usuario complete su registro después del primer inicio de sesión.
 * El usuario ya existe en la base de datos (creado automáticamente), pero necesita
 * proporcionar su programa y departamento.
 */
@Component({
  imports: [FormsModule],
  selector: 'app-completar-registro',
  styleUrl: './completar-registro.css',
  templateUrl: './completar-registro.html',
})
export class CompletarRegistro {
  private readonly auth = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuarioActual;
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly mensaje = signal('');

  programa = '';
  departamento = '';

  async guardar(): Promise<void> {
    if (!this.programa.trim()) {
      this.error.set('El programa es obligatorio');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    try {
      // Actualizar el usuario con su programa y departamento
      await this.usuariosService.actualizarPerfil({
        programId: Number(this.programa),
        department: this.departamento.trim() || undefined,
      });
      this.mensaje.set('Registro completado exitosamente');
      // Redirigir al dashboard del usuario
      setTimeout(() => {
        void this.router.navigateByUrl('/user/inicio');
      }, 1500);
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible completar el registro'));
    } finally {
      this.cargando.set(false);
    }
  }
}
