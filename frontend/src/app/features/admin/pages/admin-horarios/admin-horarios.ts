// Importa el decorador Component para declarar un componente de Angular.
import { Component } from '@angular/core';
// Importa RouterLink para navegar al formulario de horarios.
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-horarios',
  styleUrl: './admin-horarios.css',
  templateUrl: './admin-horarios.html',
})
export class AdminHorarios {
  
}
