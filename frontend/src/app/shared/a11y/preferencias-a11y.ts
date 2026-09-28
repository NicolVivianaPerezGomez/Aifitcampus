import type { ModoCursor, PreferenciasA11y } from './preferencias-a11y.model';

/** Clave de localStorage alineada al naming del proyecto. */
export const CLAVE_PREFERENCIAS_A11Y = 'pausas-activas-a11y';

/** Escala tipográfica mínima (100%) — WCAG 1.4.4. */
export const FONT_MIN = 1;

/** Escala tipográfica máxima (200%) — WCAG 1.4.4. */
export const FONT_MAX = 2;

/** Paso de incremento/decremento de fuente. */
export const FONT_STEP = 0.1;

export const PREFERENCIAS_POR_DEFECTO: Readonly<PreferenciasA11y> = {
  fontScale: FONT_MIN,
  highContrast: false,
  smartContrast: false,
  darkHighContrast: false,
  underlineLinks: false,
  textSpacing: false,
  imagesHidden: false,
  dyslexiaFont: false,
  cursorMode: 'normal',
  lineHeightBoost: false,
};

const MODOS_CURSOR: readonly ModoCursor[] = ['normal', 'mask', 'guide'];

/**
 * Redondea y acota la escala tipográfica al rango permitido.
 */
export function normalizarEscala(valor: number): number {
  const redondeado = Math.round(valor * 10) / 10;
  return Math.min(FONT_MAX, Math.max(FONT_MIN, redondeado));
}

/**
 * Calcula la siguiente escala tipográfica (+1 / -1 paso).
 */
export function siguienteEscala(actual: number, direccion: -1 | 1): number {
  return normalizarEscala(actual + direccion * FONT_STEP);
}

/**
 * Cicla el modo de cursor: normal → máscara → guía → normal.
 */
export function siguienteModoCursor(actual: ModoCursor): ModoCursor {
  const indice = MODOS_CURSOR.indexOf(actual);
  const siguiente = MODOS_CURSOR[(indice + 1) % MODOS_CURSOR.length];
  return siguiente ?? 'normal';
}

/**
 * Etiqueta visible del control de cursor según el modo activo.
 */
export function etiquetaCursor(modo: ModoCursor): string {
  switch (modo) {
    case 'mask':
      return 'Máscara de lectura';
    case 'guide':
      return 'Guía de lectura';
    default:
      return 'Cursor / lectura';
  }
}

/**
 * Valida y completa un objeto parcialmente leído de almacenamiento.
 */
export function sanitizarPreferencias(raw: unknown): PreferenciasA11y {
  if (!raw || typeof raw !== 'object') {
    return { ...PREFERENCIAS_POR_DEFECTO };
  }

  const data = raw as Partial<PreferenciasA11y>;
  const cursorMode: ModoCursor = MODOS_CURSOR.includes(data.cursorMode as ModoCursor)
    ? (data.cursorMode as ModoCursor)
    : 'normal';

  return {
    fontScale: normalizarEscala(
      typeof data.fontScale === 'number' ? data.fontScale : FONT_MIN,
    ),
    highContrast: Boolean(data.highContrast),
    smartContrast: Boolean(data.smartContrast),
    darkHighContrast: Boolean(data.darkHighContrast),
    underlineLinks: Boolean(data.underlineLinks),
    textSpacing: Boolean(data.textSpacing),
    imagesHidden: Boolean(data.imagesHidden),
    dyslexiaFont: Boolean(data.dyslexiaFont),
    cursorMode,
    lineHeightBoost: Boolean(data.lineHeightBoost),
  };
}

/**
 * Carga preferencias desde localStorage de forma segura.
 */
export function cargarPreferencias(): PreferenciasA11y {
  try {
    const bruto = localStorage.getItem(CLAVE_PREFERENCIAS_A11Y);
    if (!bruto) {
      return { ...PREFERENCIAS_POR_DEFECTO };
    }
    return sanitizarPreferencias(JSON.parse(bruto) as unknown);
  } catch {
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

/**
 * Persiste preferencias en localStorage. Fallos silenciosos (modo privado, cuota).
 */
export function guardarPreferencias(prefs: PreferenciasA11y): void {
  try {
    localStorage.setItem(CLAVE_PREFERENCIAS_A11Y, JSON.stringify(prefs));
  } catch {
    // Sin almacenamiento disponible: la sesión sigue operativa en memoria.
  }
}
