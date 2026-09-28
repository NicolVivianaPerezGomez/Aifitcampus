import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PuntoGrafico, ResumenEstadisticas, ResumenUsuario } from '../interfaces/estadisticas';
import { AuthService } from './auth.service';

/** Usuario tal como lo devuelve el backend (GET /api/users) */
interface UsuarioApi {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  statusId: number;
  role: { id: number; name: string } | null;
}

/** Ejercicio tal como lo devuelve el backend (GET /api/exercises) */
interface EjercicioApi {
  id: number;
  name: string;
  isActive: boolean;
}

/** Rutina log del backend (GET /api/routines/history/me) */
interface RoutineLogApi {
  id: number;
  routineId: number;
  routineName: string | null;
  startedAt: string;
  endedAt: string | null;
  completionPercentage: number | null;
  status: string | null;
  durationSeconds: number | null;
}

/**
 * Entrega los indicadores de bienestar y cumplimiento.
 * Los datos vienen del backend: /api/users, /api/exercises, /api/routines/history/me
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly urlUsuarios = `${environment.apiUrl}/users`;
  private readonly urlEjercicios = `${environment.apiUrl}/exercises`;
  private readonly urlHistorial = `${environment.apiUrl}/routines/history/me`;

  /**
   * Devuelve el resumen que alimenta el panel del administrador.
   * Los datos vienen del backend: /api/users y /api/exercises.
   * Las métricas que no tienen endpoint disponible se calculan con los datos
   * que sí existen o se dejan en 0 para que el admin vea que aún no hay datos.
   */
  async obtenerResumenAdmin(): Promise<ResumenEstadisticas> {
    try {
      const [usuarios, ejercicios] = await Promise.all([
        firstValueFrom(this.http.get<UsuarioApi[]>(this.urlUsuarios)),
        firstValueFrom(this.http.get<EjercicioApi[]>(this.urlEjercicios)),
      ]);

      const usuariosActivos = usuarios.filter((u) => u.statusId === 1).length;
      const ejerciciosActivos = ejercicios.filter((e) => e.isActive).length;

      return {
        usuariosActivos,
        usuariosTotales: usuarios.length,
        ejerciciosActivos,
        pausasSemana: 0,
        cumplimiento: 0,
        animoPromedio: 0,
        minutosInvertidos: 0,
        pausasOmitidas: 0,
        tasaRespuesta: 0,
        cumplimientoSemanal: [],
        animoSemanal: [],
        minutosSemanales: [],
        participacionFranja: [],
        distribucionAnimo: [],
        usuariosDestacados: [],
        ejerciciosPopulares: [],
      };
    } catch {
      return this.resumenVacio();
    }
  }

  /**
   * Devuelve los indicadores personales del tablero del colaborador.
   */
  async obtenerResumenUsuario(nombre: string): Promise<ResumenUsuario> {
    try {
      const logs = await firstValueFrom(this.http.get<RoutineLogApi[]>(this.urlHistorial));
      const completados = logs.filter((l) => l.status === 'completed');
      const totalSegundos = completados.reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);

      return {
        nombre,
        saludo: this.generarSaludo(),
        pausasCompletadas: completados.length,
        sesionesSemana: logs.length,
        rachaDias: this.calcularRacha(logs),
        cumplimiento: logs.length > 0 ? Math.round((completados.length / logs.length) * 100) : 0,
        minutosInvertidos: Math.round(totalSegundos / 60),
        proximaPausa: {
          dia: 'Por definir',
          hora: '--:--',
          duracionMinutos: 0,
          dias: 'Por definir',
        },
        actividadSemana: this.generarActividadSemana(logs),
      };
    } catch {
      return {
        nombre,
        saludo: this.generarSaludo(),
        pausasCompletadas: 0,
        sesionesSemana: 0,
        rachaDias: 0,
        cumplimiento: 0,
        minutosInvertidos: 0,
        proximaPausa: {
          dia: 'Por definir',
          hora: '--:--',
          duracionMinutos: 0,
          dias: 'Por definir',
        },
        actividadSemana: [],
      };
    }
  }

  /** Genera el saludo según la hora del día. */
  private generarSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  /** Calcula la racha de días consecutivos con actividad. */
  private calcularRacha(logs: RoutineLogApi[]): number {
    if (logs.length === 0) return 0;
    const dias = new Set(logs.map((l) => l.startedAt.slice(0, 10)));
    let racha = 0;
    const hoy = new Date();
    for (let i = 0; i < 365; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const clave = fecha.toISOString().slice(0, 10);
      if (dias.has(clave)) {
        racha++;
      } else if (i > 0) {
        break;
      }
    }
    return racha;
  }

  /** Genera los puntos para el gráfico de actividad semanal. */
  private generarActividadSemana(logs: RoutineLogApi[]): PuntoGrafico[] {
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const primerDia = new Date(hoy);
    primerDia.setDate(hoy.getDate() - ((diaActual + 6) % 7));

    return diasSemana.map((etiqueta, i) => {
      const fecha = new Date(primerDia);
      fecha.setDate(primerDia.getDate() + i);
      const clave = fecha.toISOString().slice(0, 10);
      const count = logs.filter((l) => l.startedAt.slice(0, 10) === clave).length;
      return { etiqueta, valor: count };
    });
  }

  private resumenVacio(): ResumenEstadisticas {
    return {
      usuariosActivos: 0,
      usuariosTotales: 0,
      pausasSemana: 0,
      cumplimiento: 0,
      animoPromedio: 0,
      minutosInvertidos: 0,
      pausasOmitidas: 0,
      tasaRespuesta: 0,
      ejerciciosActivos: 0,
      cumplimientoSemanal: [],
      animoSemanal: [],
      minutosSemanales: [],
      participacionFranja: [],
      distribucionAnimo: [],
      usuariosDestacados: [],
      ejerciciosPopulares: [],
    };
  }
}
