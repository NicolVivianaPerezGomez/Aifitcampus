/**
 * Ítem clicable del menú lateral.
 */
export interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

/**
 * Agrupa ítems relacionados en el sidebar (p. ej. Mis pausas + Historial).
 */
export interface MenuGroup {
  id: string;
  /** Etiqueta opcional de sección; se oculta cuando el menú está colapsado. */
  label?: string;
  items: MenuItem[];
}
