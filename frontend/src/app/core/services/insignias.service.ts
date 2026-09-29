import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Insignia tal como la devuelve el backend (GET /api/badges) */
export interface Insignia {
  id: number;
  name: string;
  description: string | null;
  condition: string | null;
  targetValue: number | null;
  isActive: boolean;
}

/** Insignia asignada a un usuario (GET /api/user-badges/user/:userId) */
export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  earnedAt: string | null;
  progress: number | null;
}

/**
 * Gestión de insignias y asignación de insignias a usuarios.
 * Endpoints: /api/badges y /api/user-badges
 */
@Injectable({ providedIn: 'root' })
export class InsigniasService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // Insignias
  listar(): Promise<Insignia[]> {
    return firstValueFrom(this.http.get<Insignia[]>(`${this.api}/badges`));
  }

  obtener(id: number): Promise<Insignia> {
    return firstValueFrom(this.http.get<Insignia>(`${this.api}/badges/${id}`));
  }

  crear(datos: {
    name: string;
    description?: string;
    condition?: string;
    targetValue?: number;
  }): Promise<Insignia> {
    return firstValueFrom(this.http.post<Insignia>(`${this.api}/badges`, datos));
  }

  editar(
    id: number,
    datos: Partial<{
      name: string;
      description: string;
      condition: string;
      targetValue: number;
      isActive: boolean;
    }>
  ): Promise<Insignia> {
    return firstValueFrom(this.http.patch<Insignia>(`${this.api}/badges/${id}`, datos));
  }

  eliminar(id: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.api}/badges/${id}`));
  }

  // UserBadges
  listarPorUsuario(userId: number): Promise<UserBadge[]> {
    return firstValueFrom(this.http.get<UserBadge[]>(`${this.api}/user-badges/user/${userId}`));
  }

  asignar(userId: number, badgeId: number, progress?: number): Promise<UserBadge> {
    return firstValueFrom(this.http.post<UserBadge>(`${this.api}/user-badges`, { userId, badgeId, progress }));
  }

  remover(id: number): Promise<unknown> {
    return firstValueFrom(this.http.delete(`${this.api}/user-badges/${id}`));
  }
}
