import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/**
 * Coloca el foco en el elemento anfitrión al renderizar la vista.
 */
@Directive({
  selector: '[appAutofoco]',
})
export class AutofocoDirective implements AfterViewInit {
  private readonly elemento = inject(ElementRef<HTMLElement>);

  /**
   * Espera un ciclo de render para enfocar sin pelear con la animación inicial.
   */
  ngAfterViewInit(): void {
    queueMicrotask(() => this.elemento.nativeElement.focus());
  }
}
