import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotificacionesService } from '../../../../core/services/notificaciones.service';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-notificaciones',
  styleUrl: './admin-notificaciones.css',
  templateUrl: './admin-notificaciones.html',
})
export class AdminNotificaciones implements OnInit {

  private readonly notificacionesService =
    inject(NotificacionesService);

  notificaciones = this.notificacionesService.notificaciones;
  cargando = this.notificacionesService.cargando;

  async ngOnInit(): Promise<void> {
    await this.notificacionesService.cargarTodas();

    console.log(
      'NOTIFICACIONES EN ADMIN:',
      this.notificaciones()
    );
  }

  async cambiarEstado(id: number): Promise<void> {
    const resultado =
      await this.notificacionesService.toggleActiva(id);

    if (resultado) {
      await this.notificacionesService.cargarTodas();
    } else {
      alert('No se pudo cambiar el estado de la notificación.');
    }
  }
}