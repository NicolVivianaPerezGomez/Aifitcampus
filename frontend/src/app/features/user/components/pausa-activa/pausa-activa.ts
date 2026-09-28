import { Component, output, signal, } from '@angular/core';
import { RelojContador } from '../../../../shared/components/reloj-contador/reloj-contador';


@Component({
  imports: [RelojContador],
  selector: 'app-pausa-activa',
  styleUrl: './pausa-activa.css',
  templateUrl: './pausa-activa.html',
})
export class PausaActiva {
  pausa_nombre: string = '';
  categoria: string = '';
  descripcion: string = '';

  //INDICADOR DE PAUSA
  isPaused = signal<boolean>(false);

  //función para cambiar el estado de al presionar el botón de pausa
  togglePausa() {
    this.isPaused.update((estado) => !estado);
  }

  //función que dice el tiempo finalizo
  onTiempoAgotado() {
    console.log('El tiempo finalizó.');
  }
}
