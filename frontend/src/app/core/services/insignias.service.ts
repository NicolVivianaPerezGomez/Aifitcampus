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

/**
 * Gestión de insignias para el administrador.
 * Endpoints: /api/badges
 */
@Injectable({ providedIn: 'root' })
export class InsigniasService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

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
}
