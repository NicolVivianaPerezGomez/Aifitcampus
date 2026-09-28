import { Component, input } from '@angular/core';

/**
 * Panel izquierdo decorativo de las pantallas de autenticación.
 */
@Component({
  selector: 'app-panel-bienvenida',
  templateUrl: './panel-bienvenida.html',
  styleUrl: './panel-bienvenida.css',
})
export class PanelBienvenida {
  readonly titulo = input('Pausas Activas');
  readonly descripcion = input(
    'Estira, respira y recupera energía durante tu jornada académica y laboral.'
  );
}
