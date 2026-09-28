/**
 * Modelos tipados del menú de accesibilidad (WCAG 2.1).
 * Desacoplados de UI y del servicio para reutilizarlos en tests y helpers.
 */

/** Modos de asistencia visual del cursor / lectura. */
export type ModoCursor = 'normal' | 'mask' | 'guide';

/** Preferencias persistidas del usuario. */
export interface PreferenciasA11y {
  fontScale: number;
  highContrast: boolean;
  smartContrast: boolean;
  darkHighContrast: boolean;
  underlineLinks: boolean;
  textSpacing: boolean;
  imagesHidden: boolean;
  dyslexiaFont: boolean;
  cursorMode: ModoCursor;
  lineHeightBoost: boolean;
}

/** Acciones que puede disparar la barra de accesibilidad. */
export type AccionA11y =
  | 'toggle-panel'
  | 'font-decrease'
  | 'font-reset'
  | 'font-increase'
  | 'toggle-contrast'
  | 'toggle-smart-contrast'
  | 'toggle-dark-hc'
  | 'toggle-links'
  | 'toggle-text-spacing'
  | 'toggle-images'
  | 'toggle-dyslexia-font'
  | 'cursor-cycle'
  | 'toggle-line-height'
  | 'reset-all';

/** Descriptor de cada control del panel (datos, no presentación). */
export interface ControlA11y {
  readonly accion: Exclude<AccionA11y, 'toggle-panel' | 'reset-all'>;
  readonly etiqueta: string;
  readonly icono: string;
  readonly tipoIcono: 'texto' | 'svg-luna';
  readonly esToggle: boolean;
}
