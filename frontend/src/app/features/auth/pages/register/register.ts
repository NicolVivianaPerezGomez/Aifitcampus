import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../../../core/services/usuarios.service';
import { mensajeError } from '../../../../core/services/api-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);

  registerForm: FormGroup;
  submitted = false;
  cargando = false;
  error = '';

  constructor() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@uniempresarial\\.edu\\.co$'),
        ],
      ],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      programa: ['', [Validators.required, Validators.min(1)]],
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
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        email: this.registerForm.get('correo')?.value,
        password: this.registerForm.get('clave')?.value,
        roleId: 2, // Rol "usuario" (no admin)
        programId: Number(this.registerForm.get('programa')?.value),
      });

      // Redirigir al login con mensaje de éxito
      void this.router.navigate(['/login'], {
        queryParams: { registro: 'exitoso' },
      });
    } catch (err) {
      this.error = mensajeError(err, 'No fue posible crear la cuenta');
    } finally {
      this.cargando = false;
    }
  }
}
