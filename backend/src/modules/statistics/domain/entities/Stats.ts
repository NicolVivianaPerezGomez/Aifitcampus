export interface WeeklyStats {
  weekStart: string;
  pausas: number;
  cumplimiento: number;
  animoPromedio: number;
  minutos: number;
}

export interface FranjaStats {
  franja: string;
  cantidad: number;
}

export interface DistribucionAnimo {
  animo: string;
  cantidad: number;
}

export interface UsuarioDestacado {
  userId: number;
  nombre: string;
  pausasCompletadas: number;
  racha: number;
}

export interface EjercicioPopular {
  exerciseId: number;
  nombre: string;
  vecesUsado: number;
}

export interface AdvancedStats {
  pausasSemana: number;
  cumplimiento: number;
  animoPromedio: number;
  minutosInvertidos: number;
  pausasOmitidas: number;
  tasaRespuesta: number;
  cumplimientoSemanal: WeeklyStats[];
  animoSemanal: WeeklyStats[];
  minutosSemanales: WeeklyStats[];
  participacionFranja: FranjaStats[];
  distribucionAnimo: DistribucionAnimo[];
  usuariosDestacados: UsuarioDestacado[];
  ejerciciosPopulares: EjercicioPopular[];
}
