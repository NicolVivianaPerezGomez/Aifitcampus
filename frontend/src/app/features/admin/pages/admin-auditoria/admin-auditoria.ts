import { Component, OnInit, inject, signal } from '@angular/core';
import { AuditoriaService, AuditEntry } from '../../../../core/services/auditoria.service';
import { mensajeError } from '../../../../core/services/api-error';

/**
 * Auditoría: listado de acciones registradas en el sistema.
 * Datos del backend: GET /api/audits
 */
@Component({
  selector: 'app-admin-auditoria',
  styleUrl: './admin-auditoria.css',
  templateUrl: './admin-auditoria.html',
})
export class AdminAuditoria implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);

  readonly registros = signal<AuditEntry[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.registros.set(await this.auditoriaService.listar({ limit: 100 }));
    } catch (error) {
      this.error.set(mensajeError(error, 'No fue posible cargar la auditoría.'));
    } finally {
      this.cargando.set(false);
    }
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
