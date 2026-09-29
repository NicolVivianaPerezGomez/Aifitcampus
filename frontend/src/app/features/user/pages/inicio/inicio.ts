import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Ejercicio, formatearDuracion } from '../../../../core/interfaces/ejercicio';
import { EjerciciosService } from '../../../../core/services/ejercicios.service';
import { PausasUsuarioService } from '../../../../core/services/pausas-usuario.service';
import { RelojContador } from '../../../../shared/components/reloj-contador/reloj-contador';

/**
 * Inicio: estructura del reproductor vinculada al catálogo de admin.
 * Sin datos quemados: todo sale de EjerciciosService.activos.
 */
@Component({
  imports: [RelojContador],
  selector: 'app-user-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly ejerciciosService = inject(EjerciciosService);
  private readonly pausasService = inject(PausasUsuarioService);
  private readonly router = inject(Router);

  private readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');
  private readonly mediaBox = viewChild<ElementRef<HTMLElement>>('mediaBox');

  /** Solo ejercicios activos creados por admin. */
  readonly rutina = this.ejerciciosService.activos;

  readonly indice = signal(0);
  readonly pausado = signal(false);
  readonly sonidoActivo = signal(true);
  readonly repeticionActual = signal(1);
  readonly timerKey = signal(0);
  readonly vista360 = signal(false);

  readonly formatear = formatearDuracion;

  readonly hayRutina = computed(() => this.rutina().length > 0);

  readonly total = computed(() => this.rutina().length);

  readonly actual = computed((): Ejercicio | null => {
    const lista = this.rutina();
    if (!lista.length) return null;
    return lista[Math.min(this.indice(), lista.length - 1)] ?? null;
  });

  readonly siguiente = computed((): Ejercicio | null => {
    const lista = this.rutina();
    const i = this.indice() + 1;
    return i < lista.length ? lista[i] : null;
  });

  readonly progresoTexto = computed(() => {
    const t = this.total();
    return t ? `${this.indice() + 1} de ${t}` : '—';
  });

  readonly pctReps = computed(() => {
    const ej = this.actual();
    if (!ej || !ej.repeticiones) return 0;
    return (this.repeticionActual() / ej.repeticiones) * 100;
  });

  constructor() {
    effect(() => {
      const video = this.videoEl()?.nativeElement;
      if (!video) return;
      video.muted = !this.sonidoActivo();
      if (this.pausado()) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
    });

    effect(() => {
      const len = this.rutina().length;
      if (len === 0) {
        this.indice.set(0);
        return;
      }
      if (this.indice() >= len) {
        this.indice.set(len - 1);
      }
    });
  }

  previewDe(ej: Ejercicio): string {
    if (ej.miniaturaUrl) return ej.miniaturaUrl;
    if (ej.tipoRecurso === 'image' && ej.urlRecurso) return ej.urlRecurso;
    return '';
  }

  togglePausa(): void {
    if (!this.hayRutina()) return;
    this.pausado.update((v) => !v);
  }

  toggleSonido(): void {
    this.sonidoActivo.update((v) => !v);
  }

  toggleVista360(): void {
    this.vista360.update((v) => !v);
  }

  pantallaCompleta(): void {
    const box = this.mediaBox()?.nativeElement;
    if (!box) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void box.requestFullscreen();
    }
  }

  anterior(): void {
    if (this.indice() <= 0) return;
    this.indice.update((i) => i - 1);
    this.resetPaso();
  }

  siguienteEjercicio(): void {
    const ultimo = this.total() - 1;
    if (ultimo < 0) return;
    if (this.indice() >= ultimo) {
      void this.pausasService.notificarRutinaCompletada();
      void this.router.navigateByUrl('/user/mis-pausas');
      return;
    }
    this.indice.update((i) => i + 1);
    this.resetPaso();
  }

  irA(paso: number): void {
    if (paso < 0 || paso >= this.total()) return;
    this.indice.set(paso);
    this.resetPaso();
  }

  onTiempoAgotado(): void {
    const ej = this.actual();
    if (!ej) return;
    const video = this.videoEl()?.nativeElement;
    if (video) {
      video.pause();
    }
    if (this.repeticionActual() < ej.repeticiones) {
      this.repeticionActual.update((r) => r + 1);
      this.timerKey.update((k) => k + 1);
      this.pausado.set(false);
      return;
    }
    this.siguienteEjercicio();
  }

  private resetPaso(): void {
    this.repeticionActual.set(1);
    this.pausado.set(false);
    this.vista360.set(false);
    this.timerKey.update((k) => k + 1);
  }
}
