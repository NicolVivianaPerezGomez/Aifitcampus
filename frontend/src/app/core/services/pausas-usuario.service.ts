import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResumenMisPausas, HistorialPausa } from '../interfaces/mis-pausas';
import { AuthService } from './auth.service';

/** Rutina log tal como la devuelve el backend (GET /api/routines/history/me) */
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
 * Historial y métricas personales del colaborador (Mis pausas).
 * Los datos vienen del backend: GET /api/routines/history/me
 */
@Injectable({ providedIn: 'root' })
export class PausasUsuarioService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly url = `${environment.apiUrl}/routines/history/me`;

  readonly cargando = signal(false);
  private readonly resumenSubject = new BehaviorSubject<ResumenMisPausas | null>(null);
  readonly resumen$ = this.resumenSubject.asObservable();

  async obtenerResumen(): Promise<ResumenMisPausas> {
    this.cargando.set(true);
    try {
      const logs = await firstValueFrom(this.http.get<RoutineLogApi[]>(this.url));
      const resumen = this.calcularResumen(logs);
      this.resumenSubject.next(resumen);
      return resumen;
    } catch {
      const vacio = this.resumenVacio();
      this.resumenSubject.next(vacio);
      return vacio;
    } finally {
      this.cargando.set(false);
    }
  }

  /** Notifica que una rutina se completó y refresca los datos. */
  async notificarRutinaCompletada(): Promise<void> {
    await this.obtenerResumen();
  }

  private calcularResumen(logs: RoutineLogApi[]): ResumenMisPausas {
    const completadas = logs.filter((l) => l.status === 'completed');
    const totalSegundos = completadas.reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);

    const historial: HistorialPausa[] = logs.map((l, i) => ({
      id: String(l.id),
      fecha: this.formatearFecha(l.startedAt),
      ejercicio: l.routineName ?? 'Rutina',
      duracionSegundos: l.durationSeconds ?? 0,
      porcentaje: l.completionPercentage ?? 0,
      animo: this.animoDesdeEstado(l.status),
      completada: l.status === 'completed',
    }));

    return {
      rachaDias: this.calcularRacha(logs),
      cumplimiento: logs.length > 0 ? Math.round((completadas.length / logs.length) * 100) : 0,
      pausasCompletadas: completadas.length,
      pausasProgramadas: logs.length,
      sesionesSemana: logs.length,
      minutosInvertidos: Math.round(totalSegundos / 60),
      diasActivosMes: new Set(logs.map((l) => l.startedAt.slice(0, 10))).size,
      tasaFinalizacion: logs.length > 0 ? Math.round((completadas.length / logs.length) * 100) : 0,
      historial,
    };
  }

  private resumenVacio(): ResumenMisPausas {
    return {
      rachaDias: 0,
      cumplimiento: 0,
      pausasCompletadas: 0,
      pausasProgramadas: 0,
      sesionesSemana: 0,
      minutosInvertidos: 0,
      diasActivosMes: 0,
      tasaFinalizacion: 0,
      historial: [],
    };
  }

  private formatearFecha(iso: string): string {
    const fecha = new Date(iso);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    const esHoy = fecha.toDateString() === hoy.toDateString();
    const esAyer = fecha.toDateString() === ayer.toDateString();

    const hora = fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
    if (esHoy) return `Hoy · ${hora}`;
    if (esAyer) return `Ayer · ${hora}`;

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${dias[fecha.getDay()]} · ${hora}`;
  }

  private animoDesdeEstado(status: string | null): string {
    switch (status) {
      case 'completed': return 'Bien';
      case 'partial': return 'Normal';
      default: return 'Cansado';
    }
  }

  private calcularRacha(logs: RoutineLogApi[]): number {
    if (logs.length === 0) return 0;
    const dias = new Set(logs.map((l) => l.startedAt.slice(0, 10)));
    let racha = 0;
    const hoy = new Date();
    for (let i = 0; i < 365; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      const clave = fecha.toISOString().slice(0, 10);
      if (dias.has(clave)) racha++;
      else if (i > 0) break;
    }
    return racha;
  }
}
