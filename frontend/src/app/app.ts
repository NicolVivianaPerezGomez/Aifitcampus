import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraAccesibilidad } from './shared/components/barra-accesibilidad/barra-accesibilidad';

@Component({
  imports: [RouterOutlet, BarraAccesibilidad],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Pausas-activas-frontend');
}
