import { A11yModule } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AccesibilidadService } from '../../a11y/accesibilidad.service';
import type { AccionA11y } from '../../a11y/preferencias-a11y.model';

/**
 * Barra flotante de accesibilidad (FAB + panel).
 * Standalone, OnPush, signals y CDK a11y (FocusTrap + LiveAnnouncer vía servicio).
 */
@Component({
  selector: 'app-barra-accesibilidad',
  imports: [A11yModule],
  templateUrl: './barra-accesibilidad.html',
  styleUrl: './barra-accesibilidad.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'barra-accesibilidad-host',
  },
})
export class BarraAccesibilidad {
  protected readonly a11y = inject(AccesibilidadService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly panelId = 'accesibilidad-panel';
  protected readonly anunciosId = 'accesibilidad-anuncios';

  private readonly botonToggle =
    viewChild<ElementRef<HTMLButtonElement>>('botonToggle');

  constructor() {
    afterNextRender(() => {
      fromEvent<KeyboardEvent>(this.document, 'keydown')
        .pipe(
          filter(
            (event) =>
              event.key === 'Escape' && this.a11y.panelAbierto(),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.a11y.cerrarPanel();
          this.botonToggle()?.nativeElement.focus();
        });
    });
  }

  protected ejecutar(accion: AccionA11y): void {
    this.a11y.ejecutar(accion);
  }

  protected etiquetaToggle(): string {
    return this.a11y.panelAbierto()
      ? 'Cerrar menú de accesibilidad'
      : 'Abrir menú de accesibilidad';
  }
}
