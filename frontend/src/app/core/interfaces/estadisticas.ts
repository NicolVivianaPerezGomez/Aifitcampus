/**
 * Punto genérico para gráficos de barras o de líneas.
 */
export interface PuntoGrafico {
  etiqueta: string;
  valor: number;
  /** Segunda barra del día (p. ej. pausas no completadas el sábado). */
  valorSecundario?: number;
}

/**
 * Colaborador destacado en el ranking de pausas.
 */
export interface UsuarioDestacado {
  nombre: string;
  pausas: number;
}

/**
 * Resumen de indicadores del panel administrativo.
 */
export interface ResumenEstadisticas {
  usuariosActivos: number;
  usuariosTotales: number;
  pausasSemana: number;
  cumplimiento: number;
  animoPromedio: number;
  minutosInvertidos: number;
  pausasOmitidas: number;
  tasaRespuesta: number;
  ejerciciosActivos: number;
  cumplimientoSemanal: PuntoGrafico[];
  animoSemanal: PuntoGrafico[];
  minutosSemanales: PuntoGrafico[];
  participacionFranja: PuntoGrafico[];
  distribucionAnimo: PuntoGrafico[];
  usuariosDestacados: UsuarioDestacado[];
  ejerciciosPopulares: { nombre: string; usos: number }[];
}

/**
 * Indicadores personales que se muestran en el inicio del usuario.
 */
export interface ResumenUsuario {
  nombre: string;
  saludo: string;
  pausasCompletadas: number;
  sesionesSemana: number;
  rachaDias: number;
  cumplimiento: number;
  minutosInvertidos: number;
  proximaPausa: ProximaPausa;
  actividadSemana: PuntoGrafico[];
}

/**
 * Próxima pausa programada para el colaborador.
 */
export interface ProximaPausa {
  dia: string;
  hora: string;
  duracionMinutos: number;
  dias: string;
}
