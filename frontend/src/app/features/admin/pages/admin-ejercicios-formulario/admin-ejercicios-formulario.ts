import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TipoAviso, TipoRecurso } from '../../../../core/interfaces/ejercicio';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';
import { mensajeError } from '../../../../core/services/api-error';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-admin-ejercicios-formulario',
  styleUrl: './admin-ejercicios-formulario.css',
  templateUrl: './admin-ejercicios-formulario.html',
})
export class AdminEjerciciosFormulario implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ejercicios = inject(EjerciciosService);
  private readonly router = inject(Router);
  private readonly idEjercicio = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('id')) || null;

  readonly editando = this.idEjercicio !== null;
  readonly cargandoArchivo = signal(false);
  readonly errorArchivo = signal('');
  readonly nombreArchivo = signal('');
  readonly guardando = signal(false);
  readonly errorGuardar = signal('');

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required]],
    duracionSegundos: [60, [Validators.required, Validators.min(1)]],
    categoria: ['', Validators.required],
    tipoRecurso: ['video' as TipoRecurso, Validators.required],
    urlRecurso: ['', [Validators.required]],
    repeticiones: [5, [Validators.required, Validators.min(1)]],
    tipoAviso: ['notificacion' as TipoAviso, Validators.required],
    activo: [true],
  });

  async ngOnInit(): Promise<void> {
    if (this.idEjercicio) {
      try {
        // Asegurar que el catálogo esté cargado
        if (this.ejercicios.catalogo().length === 0) {
          await this.ejercicios.cargar();
        }
        const ejercicio = this.ejercicios.catalogo().find((e) => e.id === String(this.idEjercicio));
        if (ejercicio) {
          this.form.patchValue({
            nombre: ejercicio.nombre,
            descripcion: ejercicio.descripcion,
            duracionSegundos: ejercicio.duracionSegundos,
            categoria: ejercicio.categoria,
            tipoRecurso: ejercicio.tipoRecurso,
            urlRecurso: ejercicio.urlRecurso,
            repeticiones: ejercicio.repeticiones > 0 ? ejercicio.repeticiones : 1,
            tipoAviso: ejercicio.tipoAviso,
            activo: ejercicio.activo,
          });
        }
      } catch (error) {
        this.errorGuardar.set(mensajeError(error, 'No fue posible cargar el ejercicio.'));
      }
    }
  }

  onArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorArchivo.set('');
    this.nombreArchivo.set('');

    if (!file) return;

    const maxMb = 8;
    if (file.size > maxMb * 1024 * 1024) {
      this.errorArchivo.set(`El archivo supera ${maxMb} MB. Usa un video más liviano o una URL.`);
      input.value = '';
      return;
    }

    const esVideo = file.type.startsWith('video/');
    const esImagen = file.type.startsWith('image/');
    if (!esVideo && !esImagen) {
      this.errorArchivo.set('Solo se permiten archivos de video o imagen.');
      input.value = '';
      return;
    }

    this.cargandoArchivo.set(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? '');
      this.form.patchValue({
        urlRecurso: dataUrl,
        tipoRecurso: esVideo ? 'video' : 'image',
      });
      this.nombreArchivo.set(file.name);
      this.cargandoArchivo.set(false);
    };
    reader.onerror = () => {
      this.errorArchivo.set('No se pudo leer el archivo.');
      this.cargandoArchivo.set(false);
    };
    reader.readAsDataURL(file);
  }

  async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.errorGuardar.set('');

    // En edición, la URL puede ser un data URL (archivo subido) o un enlace http/https
    if (this.editando) {
      const url = v.urlRecurso.trim();
      if (!url.startsWith('data:') && !/^https?:\/\//i.test(url)) {
        this.errorGuardar.set('El recurso debe ser un enlace http/https o un archivo subido.');
        return;
      }
    } else {
      // En creación, solo se permiten enlaces http/https
      if (!/^https?:\/\//i.test(v.urlRecurso.trim())) {
        this.errorGuardar.set(
          'El recurso debe ser un enlace que empiece por http:// o https://. Sube el video a un servicio (Drive, OneDrive, etc.) y pega aquí su URL.',
        );
        return;
      }
    }

    this.guardando.set(true);
    try {
      if (this.editando && this.idEjercicio) {
        // Editar ejercicio existente
        const categoryId = await this.ejercicios.obtenerIdCategoria(v.categoria);
        await this.ejercicios.editar(String(this.idEjercicio), {
          name: v.nombre,
          description: v.descripcion,
          durationSeconds: v.duracionSegundos,
          resourceUrl: v.urlRecurso,
          categoryId,
          isActive: v.activo,
        });
      } else {
        // Crear nuevo ejercicio
        await this.ejercicios.crear({
          nombre: v.nombre,
          descripcion: v.descripcion,
          duracionSegundos: v.duracionSegundos,
          categoria: v.categoria,
          tipoRecurso: v.tipoRecurso,
          urlRecurso: v.urlRecurso,
          repeticiones: v.repeticiones,
          tipoAviso: v.tipoAviso,
          activo: v.activo,
        });
      }
      void this.router.navigateByUrl('/admin/adminEjercicios');
    } catch (error) {
      this.errorGuardar.set(mensajeError(error, 'No fue posible guardar el ejercicio.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
