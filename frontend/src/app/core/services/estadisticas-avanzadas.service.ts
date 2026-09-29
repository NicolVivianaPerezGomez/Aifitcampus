import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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

/**
 * Estadísticas avanzadas del panel de administrador.
 * Endpoint: GET /api/stats/advanced
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasAvanzadasService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  obtener(): Promise<AdvancedStats> {
    return firstValueFrom(this.http.get<AdvancedStats>(`${this.api}/stats/advanced`));
  }
}
