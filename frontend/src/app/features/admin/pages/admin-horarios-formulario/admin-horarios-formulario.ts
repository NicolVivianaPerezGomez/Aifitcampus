// Importa el decorador Component para declarar un componente de Angular.
import { Component } from '@angular/core';
// Importa RouterLink para volver al listado de horarios.
import { RouterLink } from '@angular/router';

// Declara la configuración del formulario de horarios.
@Component({
  // Permite utilizar routerLink dentro de la plantilla HTML.
  imports: [RouterLink],
  // Define el selector que identifica este componente.
  selector: 'app-admin-horarios-formulario',
  // Asocia el archivo de estilos del formulario.
  styleUrl: './admin-horarios-formulario.css',
  // Asocia el archivo HTML del formulario.
  templateUrl: './admin-horarios-formulario.html',
})
// Exporta el componente para usarlo en las rutas de administración.
export class AdminHorariosFormulario {}
