import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfiguracionNotificaciones } from '../interfaces/notificacion';

/** Notificación tal como la devuelve el backend (GET /api/notifications) */
export interface NotificacionApi {

  id: number;
  name: string;
  description: string | null;
  routineId: number | null;
  notificationTime: string | null;
  reminder: boolean;
  reminderMinutes: number | null;
  isActive: boolean;
  days: string[];
}
interface RespuestaNotificacion {
  message?: string;
  data: NotificacionApi | NotificacionApi[];
}

/** Datos para crear/actualizar una notificación en el backend. */
export interface NotificacionInput {
  name: string;
  description: string;
  routineId: number | null;
  notificationTime: string;
  reminder: boolean;
  reminderMinutes: number | null;
  isActive: boolean;
  days: number[];
}

/**
 * Gestiona las notificaciones del sistema conectando con el backend.
 * El administrador crea y administra notificaciones; los usuarios consultan las suyas.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/notifications`;

  /** Estado actual de los canales, el mensaje y los disparadores. */
  readonly configuracion = signal<ConfiguracionNotificaciones>({
    notificacionEscritorio: true,
    bloqueoPantalla: false,
    recordatorioCorreo: false,
    sonidoAviso: true,
    anticipacionMinutos: 5,
    posponerMinutos: 5,
    permitirPosponer: true,
    maxPosposiciones: 2,
    titulo: 'Hora de tu pausa activa',
    cuerpo: 'Tómate un momento para moverte. Tu bienestar también es parte de la jornada.',
    mostrarNombreEjercicio: true,
    mostrarDuracion: true,
    dispararPausaProgramada: true,
    dispararPausaNoRealizada: true,
    dispararInicioJornada: false,
    horarioSilencio: true,
    silencioDesde: '20:00',
    silencioHasta: '07:00',
  });

  /** Lista de notificaciones (admin). */
  readonly notificaciones = signal<NotificacionApi[]>([]);

  /** Notificaciones del usuario autenticado. */
  readonly misNotificaciones = signal<NotificacionApi[]>([]);

  /** True mientras se consulta el backend. */
  readonly cargando = signal(false);

  /**
   * Reemplaza la configuración vigente por la que envía el formulario.
   */
  guardar(ajustes: ConfiguracionNotificaciones): void {
    this.configuracion.set({ ...ajustes });
  }

  /** Obtiene todas las notificaciones (admin). */
  async cargarTodas(): Promise<void> {
  this.cargando.set(true);

  try {
    const respuesta = await firstValueFrom(
      this.http.get<RespuestaNotificacion>(this.url),
    );

    console.log('RESPUESTA DE NOTIFICACIONES:', respuesta);

    this.notificaciones.set(
      respuesta.data as NotificacionApi[]
    );

    console.log(
      'NOTIFICACIONES GUARDADAS EN EL SIGNAL:',
      this.notificaciones()
    );

  } catch (error) {
    console.error(
      'ERROR AL CARGAR NOTIFICACIONES:',
      error
    );

    this.notificaciones.set([]);

  } finally {
    this.cargando.set(false);
  }
}

  /** Obtiene las notificaciones del usuario autenticado. */
  async cargarMias(): Promise<void> {
    try {
      const lista = await firstValueFrom(
        this.http.get<NotificacionApi[]>(`${this.url}/my-notifications`),
      );
      this.misNotificaciones.set(lista);
    } catch {
      this.misNotificaciones.set([]);
    }
  }

  /** Obtiene una notificación por ID (admin). */
 async obtenerPorId(id: number): Promise<NotificacionApi | null> {
  try {
    const respuesta = await firstValueFrom(
      this.http.get<RespuestaNotificacion>(
        `${this.url}/${id}`
      )
    );

    console.log(
      'RESPUESTA DE NOTIFICACIÓN POR ID:',
      respuesta
    );

    return respuesta.data as NotificacionApi;

  } catch (error) {

    console.error(
      'Error al obtener la notificación:',
      error
    );

    return null;
  }
}

  /** Crea una notificación (admin). */
/** Crea una notificación (admin). */
async crear(input: NotificacionInput): Promise<NotificacionApi | null> {

  const cuerpo = {
    name: input.name,
    description: input.description,
    routineId: input.routineId,
    notificationTime: input.notificationTime,
    reminder: input.reminder,
    reminderMinutes: input.reminderMinutes,
    isActive: input.isActive,
    days: input.days,
  };

  console.log(
    'DATOS QUE SE VAN A ENVIAR:',
    cuerpo
  );

  try {

    const respuesta = await firstValueFrom(
      this.http.post<RespuestaNotificacion>(
        this.url,
        cuerpo,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );

    console.log(
      'RESPUESTA CREAR NOTIFICACIÓN:',
      respuesta
    );

    await this.cargarTodas();

    return respuesta.data as NotificacionApi;

  } catch (error) {

    console.error(
      'ERROR AL CREAR NOTIFICACIÓN:',
      error
    );

    return null;
  }
}

  /** Actualiza una notificación (admin). */
  async actualizar(id: number, input: NotificacionInput): Promise<NotificacionApi | null> {
    try {
      const actualizada = await firstValueFrom(
        this.http.put<NotificacionApi>(`${this.url}/${id}`, {
          name: input.name,
          description: input.description,
          routineId: input.routineId,
          notificationTime: input.notificationTime,
          reminder: input.reminder,
          reminderMinutes: input.reminderMinutes,
          isActive: input.isActive,
          days: input.days,
        }),
      );
      await this.cargarTodas();
      return actualizada;
    } catch {
      return null;
    }
  }

  /** Activa/desactiva una notificación (admin). */
  async toggleActiva(id: number): Promise<NotificacionApi | null> {
    try {
      const resultado = await firstValueFrom(
        this.http.patch<NotificacionApi>(`${this.url}/${id}/toggle`, {}),
      );
      await this.cargarTodas();
      return resultado;
    } catch {
      return null;
    }
  }
}
