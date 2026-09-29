import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Registro de auditoría tal como lo devuelve el backend (GET /api/audits) */
export interface AuditEntry {
  id: number;
  userId: number | null;
  action: string;
  entity: string;
  description: string | null;
  createdAt: string | null;
}

export interface AuditFilter {
  userId?: number;
  entity?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

/**
 * Consulta de auditoría para el administrador.
 * Endpoints: /api/audits
 */
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  listar(filtro: AuditFilter = {}): Promise<AuditEntry[]> {
    const params: Record<string, string> = {};
    if (filtro.userId) params['userId'] = String(filtro.userId);
    if (filtro.entity) params['entity'] = filtro.entity;
    if (filtro.action) params['action'] = filtro.action;
    if (filtro.limit) params['limit'] = String(filtro.limit);
    if (filtro.offset) params['offset'] = String(filtro.offset);

    return firstValueFrom(this.http.get<AuditEntry[]>(`${this.api}/audits`, { params }));
  }

  obtener(id: number): Promise<AuditEntry> {
    return firstValueFrom(this.http.get<AuditEntry>(`${this.api}/audits/${id}`));
  }
}
