import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import type { AccionA11y, PreferenciasA11y } from './preferencias-a11y.model';
import {
  FONT_MAX,
  FONT_MIN,
  PREFERENCIAS_POR_DEFECTO,
  cargarPreferencias,
  etiquetaCursor,
  guardarPreferencias,
  siguienteEscala,
  siguienteModoCursor,
} from './preferencias-a11y';

/** Clases CSS aplicadas sobre `<html>` según preferencias. */
const CLASES_A11Y = {
  highContrast: 'a11y-high-contrast',
  smartContrast: 'a11y-smart-contrast',
  darkHighContrast: 'a11y-dark-high-contrast',
  underlineLinks: 'a11y-underline-links',
  textSpacing: 'a11y-text-spacing',
  imagesHidden: 'a11y-hide-images',
  dyslexiaFont: 'a11y-dyslexia-font',
  readingMask: 'a11y-reading-mask',
  readingGuide: 'a11y-reading-guide',
  lineHeight: 'a11y-line-height',
} as const;

/**
 * Fuente de verdad reactiva de preferencias de accesibilidad.
 * Aplica clases/CSS vars al documento y sincroniza localStorage.
 */
@Injectable({ providedIn: 'root' })
export class AccesibilidadService {
  private readonly document = inject(DOCUMENT);
  private readonly announcer = inject(LiveAnnouncer);
  private readonly renderer: Renderer2 = inject(RendererFactory2).createRenderer(
    null,
    null,
  );

  /** Preferencias activas (signal). */
  readonly preferencias = signal<PreferenciasA11y>(cargarPreferencias());

  /** Panel flotante abierto/cerrado. */
  readonly panelAbierto = signal(false);

  /** Mensaje de estado visible en el panel. */
  readonly estado = signal('Panel listo.');

  /** Escala tipográfica como porcentaje entero (para plantillas). */
  readonly porcentajeFuente = computed(() =>
    Math.round(this.preferencias().fontScale * 100),
  );

  readonly puedeDisminuirFuente = computed(
    () => this.preferencias().fontScale > FONT_MIN,
  );

  readonly puedeAumentarFuente = computed(
    () => this.preferencias().fontScale < FONT_MAX,
  );

  readonly etiquetaModoCursor = computed(() =>
    etiquetaCursor(this.preferencias().cursorMode),
  );

  private listenerCursor: (() => void) | null = null;

  constructor() {
    // Aplica DOM + persistencia cada vez que cambian las preferencias.
    effect(() => {
      const prefs = this.preferencias();
      this.aplicarAlDocumento(prefs);
      guardarPreferencias(prefs);
    });

    // Seguimiento del puntero solo con máscara o guía de lectura.
    effect((onCleanup) => {
      const modo = this.preferencias().cursorMode;
      this.desvincularCursor();

      if (modo !== 'mask' && modo !== 'guide') {
        return;
      }

      const handler = (event: MouseEvent): void => {
        const root = this.document.documentElement;
        root.style.setProperty('--a11y-cursor-x', `${event.clientX}px`);
        root.style.setProperty('--a11y-cursor-y', `${event.clientY}px`);
      };

      this.document.addEventListener('mousemove', handler, { passive: true });
      this.listenerCursor = () =>
        this.document.removeEventListener('mousemove', handler);

      onCleanup(() => this.desvincularCursor());
    });
  }

  /** Abre o cierra el panel. */
  alternarPanel(): void {
    this.panelAbierto.update((v) => !v);
  }

  cerrarPanel(): void {
    this.panelAbierto.set(false);
  }

  /**
   * Ejecuta una acción del menú y anuncia el resultado a lectores de pantalla.
   */
  ejecutar(accion: AccionA11y): void {
    if (accion === 'toggle-panel') {
      this.alternarPanel();
      return;
    }

    const actual = this.preferencias();

    switch (accion) {
      case 'font-decrease': {
        const siguiente = siguienteEscala(actual.fontScale, -1);
        this.actualizar(
          (p) => ({ ...p, fontScale: siguienteEscala(p.fontScale, -1) }),
          `Tamaño de letra al ${Math.round(siguiente * 100)}%.`,
        );
        break;
      }
      case 'font-reset':
        this.actualizar(
          (p) => ({ ...p, fontScale: FONT_MIN }),
          'Tamaño de letra restablecido al 100%.',
        );
        break;
      case 'font-increase': {
        const siguiente = siguienteEscala(actual.fontScale, 1);
        this.actualizar(
          (p) => ({ ...p, fontScale: siguienteEscala(p.fontScale, 1) }),
          `Tamaño de letra al ${Math.round(siguiente * 100)}%.`,
        );
        break;
      }
      case 'toggle-contrast':
        this.actualizar((p) => {
          const highContrast = !p.highContrast;
          return {
            ...p,
            highContrast,
            smartContrast: highContrast ? false : p.smartContrast,
            darkHighContrast: highContrast ? false : p.darkHighContrast,
          };
        }, actual.highContrast
          ? 'Contraste daltónico desactivado.'
          : 'Contraste daltónico activado.');
        break;
      case 'toggle-smart-contrast':
        this.actualizar((p) => {
          const smartContrast = !p.smartContrast;
          return {
            ...p,
            smartContrast,
            highContrast: smartContrast ? false : p.highContrast,
            darkHighContrast: smartContrast ? false : p.darkHighContrast,
          };
        }, actual.smartContrast
          ? 'Escala de grises desactivada.'
          : 'Escala de grises activada.');
        break;
      case 'toggle-dark-hc':
        this.actualizar((p) => {
          const darkHighContrast = !p.darkHighContrast;
          return {
            ...p,
            darkHighContrast,
            highContrast: darkHighContrast ? false : p.highContrast,
            smartContrast: darkHighContrast ? false : p.smartContrast,
          };
        }, actual.darkHighContrast
          ? 'Modo nocturno desactivado.'
          : 'Modo nocturno activado.');
        break;
      case 'toggle-links':
        this.actualizar(
          (p) => ({ ...p, underlineLinks: !p.underlineLinks }),
          actual.underlineLinks
            ? 'Subrayado de enlaces desactivado.'
            : 'Subrayado de enlaces activado.',
        );
        break;
      case 'toggle-text-spacing':
        this.actualizar(
          (p) => ({ ...p, textSpacing: !p.textSpacing }),
          actual.textSpacing
            ? 'Espaciado de texto desactivado.'
            : 'Espaciado de texto activado.',
        );
        break;
      case 'toggle-images':
        this.actualizar(
          (p) => ({ ...p, imagesHidden: !p.imagesHidden }),
          actual.imagesHidden ? 'Imágenes visibles.' : 'Imágenes ocultas.',
        );
        break;
      case 'toggle-dyslexia-font':
        this.actualizar(
          (p) => ({ ...p, dyslexiaFont: !p.dyslexiaFont }),
          actual.dyslexiaFont
            ? 'Modo de lectura para dislexia desactivado.'
            : 'Modo de lectura para dislexia activado.',
        );
        break;
      case 'cursor-cycle': {
        const next = siguienteModoCursor(actual.cursorMode);
        this.actualizar(
          (p) => ({ ...p, cursorMode: siguienteModoCursor(p.cursorMode) }),
          next === 'mask'
            ? 'Máscara de lectura activada.'
            : next === 'guide'
              ? 'Guía de lectura activada.'
              : 'Cursor normal activado.',
        );
        break;
      }
      case 'toggle-line-height':
        this.actualizar(
          (p) => ({ ...p, lineHeightBoost: !p.lineHeightBoost }),
          actual.lineHeightBoost
            ? 'Altura de línea normal.'
            : 'Altura de línea aumentada.',
        );
        break;
      case 'reset-all':
        this.actualizar(
          () => ({ ...PREFERENCIAS_POR_DEFECTO }),
          'Preferencias de accesibilidad restablecidas.',
        );
        this.cerrarPanel();
        break;
    }
  }

  private actualizar(
    mutator: (actual: PreferenciasA11y) => PreferenciasA11y,
    mensaje: string,
  ): void {
    this.preferencias.update(mutator);
    this.anunciar(mensaje);
  }

  private anunciar(mensaje: string): void {
    this.estado.set(mensaje);
    void this.announcer.announce(mensaje, 'polite');
  }

  private desvincularCursor(): void {
    this.listenerCursor?.();
    this.listenerCursor = null;
  }

  /**
   * Sincroniza clases y variables CSS en `<html>` vía Renderer2.
   */
  private aplicarAlDocumento(prefs: PreferenciasA11y): void {
    const root = this.document.documentElement;

    root.style.setProperty('--a11y-font-scale', String(prefs.fontScale));

    this.toggleClase(root, CLASES_A11Y.highContrast, prefs.highContrast);
    this.toggleClase(root, CLASES_A11Y.smartContrast, prefs.smartContrast);
    this.toggleClase(
      root,
      CLASES_A11Y.darkHighContrast,
      prefs.darkHighContrast,
    );
    this.toggleClase(root, CLASES_A11Y.underlineLinks, prefs.underlineLinks);
    this.toggleClase(root, CLASES_A11Y.textSpacing, prefs.textSpacing);
    this.toggleClase(root, CLASES_A11Y.imagesHidden, prefs.imagesHidden);
    this.toggleClase(root, CLASES_A11Y.dyslexiaFont, prefs.dyslexiaFont);
    this.toggleClase(root, CLASES_A11Y.lineHeight, prefs.lineHeightBoost);
    this.toggleClase(root, CLASES_A11Y.readingMask, prefs.cursorMode === 'mask');
    this.toggleClase(
      root,
      CLASES_A11Y.readingGuide,
      prefs.cursorMode === 'guide',
    );
  }

  private toggleClase(
    el: HTMLElement,
    clase: string,
    activo: boolean,
  ): void {
    if (activo) {
      this.renderer.addClass(el, clase);
    } else {
      this.renderer.removeClass(el, clase);
    }
  }
}
