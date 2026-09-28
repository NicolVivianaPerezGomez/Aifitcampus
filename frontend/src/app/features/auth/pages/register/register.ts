import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { AuthService } from '../../../../core/services/auth.service';
import { mensajeError } from '../../../../core/services/api-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);
  private readonly auth = inject(AuthService);

  registerForm: FormGroup;
  submitted = false;
  cargando = false;
  error = '';

  constructor() {
    this.registerForm = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@uniempresarial\\.edu\\.co$'),
        ],
      ],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      programa: ['', [Validators.required, Validators.min(1)]],
      departamento: [''],
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  hasError(controlName: string, error: string): boolean {
    return (
      this.isControlInvalid(controlName) && !!this.registerForm.get(controlName)?.hasError(error)
    );
  }

  async register(): Promise<void> {
    this.submitted = true;
    this.error = '';
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    this.cargando = true;
    try {
      // Crear usuario en el backend (solo rol "usuario", sin admin)
      await this.usuariosService.crear({
        firstName: this.registerForm.get('nombre')?.value.split(' ')[0] || '',
        lastName: this.registerForm.get('nombre')?.value.split(' ').slice(1).join(' ') || '',
        email: this.registerForm.get('correo')?.value,
        password: this.registerForm.get('clave')?.value,
        roleId: 2, // Rol "usuario" (no admin)
        programId: Number(this.registerForm.get('programa')?.value),
        department: this.registerForm.get('departamento')?.value || undefined,
      });

      // Iniciar sesión con Microsoft después del registro
      this.auth.iniciarSesionMicrosoft();
    } catch (err) {
      this.error = mensajeError(err, 'No fue posible crear la cuenta');
    } finally {
      this.cargando = false;
    }
  }
}
