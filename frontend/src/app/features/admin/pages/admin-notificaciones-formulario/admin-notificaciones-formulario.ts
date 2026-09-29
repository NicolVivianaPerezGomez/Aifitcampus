import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  RutinasService,
  Rutina,
  formatearTiempo,
} from '../../../../core/services/rutinas.service';

import {
  NotificacionesService
} from '../../../../core/services/notificaciones.service';


@Component({
  imports: [
    RouterLink,
    FormsModule
  ],

  selector: 'app-admin-notificaciones-formulario',

  styleUrl: './admin-notificaciones-formulario.css',

  templateUrl: './admin-notificaciones-formulario.html',
})
export class AdminNotificacionesFormulario
  implements OnInit {


  // Servicio para consultar las rutinas.
  private readonly rutinasService =
    inject(RutinasService);


  // Servicio para crear y editar notificaciones.
  private readonly notificacionesService =
    inject(NotificacionesService);


  // Nos permite saber si estamos editando.
  private readonly route =
    inject(ActivatedRoute);


  // Le permite a Angular actualizar la vista
  // después de cargar información.
  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);


  // Lista de rutinas que aparecerán
  // en el select.
  rutinas: Rutina[] = [];


  // Rutina que el usuario seleccionó.
  rutinaSeleccionada: Rutina | null = null;


  // Función para mostrar la duración
  // de la rutina de una forma sencilla.
  formatearTiempo =
    formatearTiempo;


  // Si tiene un número estamos editando.
  // Si es null estamos creando.
  idNotificacion: number | null = null;



  // ==========================================
  // INICIO
  // ==========================================

  async ngOnInit(): Promise<void> {

    // Primero cargamos las rutinas.
    await this.cargarRutinas();


    // Revisamos si la URL tiene un ID.
    const id =
      this.route.snapshot.paramMap.get('id');


    // Si existe un ID significa que estamos
    // editando una notificación.
    if (id) {

      this.idNotificacion =
        Number(id);


      // Cargamos la información
      // de la notificación.
      await this.cargarNotificacion();
    }
  }



  // ==========================================
  // CARGAR RUTINAS
  // ==========================================

  private async cargarRutinas(): Promise<void> {

    try {

      // Pedimos las rutinas al backend.
      this.rutinas =
        await this.rutinasService.listar();


      console.log(
        'Rutinas cargadas:',
        this.rutinas
      );


      // Le avisamos a Angular que ya llegaron
      // las rutinas y debe actualizar la pantalla.
      this.changeDetectorRef.detectChanges();


    } catch (error) {

      console.error(
        'Error al cargar rutinas:',
        error
      );


      this.rutinas = [];
    }
  }



  // ==========================================
  // CARGAR NOTIFICACIÓN PARA EDITAR
  // ==========================================

  private async cargarNotificacion(): Promise<void> {

    // Si no hay ID no hacemos nada.
    if (!this.idNotificacion) {
      return;
    }


    try {

      // Buscamos la notificación.
      const notificacion =
        await this.notificacionesService.obtenerPorId(
          this.idNotificacion
        );


      console.log(
        'Notificación para editar:',
        notificacion
      );


      // Si no encontramos la notificación
      // terminamos.
      if (!notificacion) {
        return;
      }



      // ======================================
      // NOMBRE
      // ======================================

      (
        document.getElementById(
          'nombre-notificacion'
        ) as HTMLInputElement
      ).value =
        notificacion.name;



      // ======================================
      // DESCRIPCIÓN
      // ======================================

      (
        document.getElementById(
          'descripcion-notificacion'
        ) as HTMLTextAreaElement
      ).value =
        notificacion.description ?? '';



      // ======================================
      // RUTINA
      // ======================================

      if (notificacion.routineId) {

        try {

          // Buscamos la información completa
          // de la rutina.
          this.rutinaSeleccionada =
            await this.rutinasService.obtener(
              notificacion.routineId
            );


          console.log(
            'Rutina de la notificación:',
            this.rutinaSeleccionada
          );


          // Actualizamos la vista.
          this.changeDetectorRef.detectChanges();


          // Buscamos el select de rutinas.
          const selectRutina =
            document.getElementById(
              'rutina'
            ) as HTMLSelectElement;


          // Seleccionamos la rutina correspondiente.
          selectRutina.value =
            String(
              notificacion.routineId
            );


        } catch (error) {

          console.error(
            'Error al cargar la rutina:',
            error
          );


          this.rutinaSeleccionada =
            null;
        }


      } else {

        this.rutinaSeleccionada =
          null;
      }



      // ======================================
      // HORA
      // ======================================

      (
        document.getElementById(
          'hora'
        ) as HTMLInputElement
      ).value =
        notificacion.notificationTime ?? '';



      // ======================================
      // ESTADO ACTIVO
      // ======================================

      (
        document.querySelector(
          'input[name="is_active"]'
        ) as HTMLInputElement
      ).checked =
        notificacion.isActive;



      // ======================================
      // RECORDATORIO
      // ======================================

      (
        document.querySelector(
          'input[name="reminder"]'
        ) as HTMLInputElement
      ).checked =
        notificacion.reminder;



      // ======================================
      // MINUTOS DEL RECORDATORIO
      // ======================================

      (
        document.getElementById(
          'minutos-recordatorio'
        ) as HTMLInputElement
      ).value =
        String(
          notificacion.reminderMinutes ?? ''
        );



      // ======================================
      // DÍAS
      // ======================================

      const diasNumeros: Record<string, number> = {

        lunes: 1,

        martes: 2,

        miércoles: 3,

        jueves: 4,

        viernes: 5,

        sábado: 6,

        domingo: 7,

      };


      // Buscamos todos los checkbox
      // de los días.
      const checkboxes =
        document.querySelectorAll(
          '.dias input[type="checkbox"]'
        );


      checkboxes.forEach(
        (input, index) => {


          // Revisamos si el día está
          // guardado en la notificación.
          const diaSeleccionado =
            notificacion.days.some(
              (dia) =>
                diasNumeros[dia] ===
                index + 1
            );


          // Marcamos o desmarcamos
          // el checkbox.
          (
            input as HTMLInputElement
          ).checked =
            diaSeleccionado;
        }
      );


    } catch (error) {

      console.error(
        'Error al cargar la notificación:',
        error
      );
    }
  }



  // ==========================================
  // SELECCIONAR RUTINA
  // ==========================================

  async alSeleccionarRutina(
    event: Event
  ): Promise<void> {


    // Obtenemos el select.
    const select =
      event.target as HTMLSelectElement;


    // Obtenemos el ID seleccionado.
    const id =
      Number(select.value);


    // Si no hay rutina seleccionada
    // quitamos el detalle.
    if (!id) {

      this.rutinaSeleccionada =
        null;

      return;
    }


    try {

      // Buscamos la rutina completa.
      this.rutinaSeleccionada =
        await this.rutinasService.obtener(id);


    } catch {

      this.rutinaSeleccionada =
        null;
    }
  }



  // ==========================================
  // GUARDAR
  // ==========================================

  async guardar(): Promise<void> {


    // ======================================
    // NOMBRE
    // ======================================

    const nombre =
      (
        document.getElementById(
          'nombre-notificacion'
        ) as HTMLInputElement
      ).value;



    // ======================================
    // DESCRIPCIÓN
    // ======================================

    const descripcion =
      (
        document.getElementById(
          'descripcion-notificacion'
        ) as HTMLTextAreaElement
      ).value;



    // ======================================
    // RUTINA
    // ======================================

    const rutinaId =
      Number(
        (
          document.getElementById(
            'rutina'
          ) as HTMLSelectElement
        ).value
      );



    // ======================================
    // HORA
    // ======================================

    const hora =
      (
        document.getElementById(
          'hora'
        ) as HTMLInputElement
      ).value;



    // ======================================
    // ESTADO ACTIVO
    // ======================================

    const activa =
      (
        document.querySelector(
          'input[name="is_active"]'
        ) as HTMLInputElement
      ).checked;



    // ======================================
    // RECORDATORIO
    // ======================================

    const recordatorio =
      (
        document.querySelector(
          'input[name="reminder"]'
        ) as HTMLInputElement
      ).checked;



    // ======================================
    // MINUTOS
    // ======================================

    const minutos =
      Number(
        (
          document.getElementById(
            'minutos-recordatorio'
          ) as HTMLInputElement
        ).value
      );



    // ======================================
    // DÍAS
    // ======================================

    const dias =
      Array.from(
        document.querySelectorAll(
          '.dias input[type="checkbox"]'
        )
      )
        .map(
          (input, index) => ({

            seleccionado:
              (
                input as HTMLInputElement
              ).checked,

            dia:
              index + 1,

          })
        )
        .filter(
          (item) =>
            item.seleccionado
        )
        .map(
          (item) =>
            item.dia
        );



    // ======================================
    // DATOS
    // ======================================

    const datos = {

      name:
        nombre,

      description:
        descripcion,

      routineId:
        rutinaId || null,

      notificationTime:
        hora,

      reminder:
        recordatorio,

      reminderMinutes:
        recordatorio
          ? minutos || null
          : null,

      isActive:
        activa,

      days:
        dias,

    };



    let resultado;



    // ======================================
    // EDITAR
    // ======================================

    if (this.idNotificacion) {


      resultado =
        await this.notificacionesService.actualizar(
          this.idNotificacion,
          datos
        );


      if (resultado) {

        alert(
          'Notificación actualizada correctamente.'
        );


      } else {

        alert(
          'No se pudo actualizar la notificación.'
        );
      }



    } else {


      // ======================================
      // CREAR
      // ======================================

      resultado =
        await this.notificacionesService.crear(
          datos
        );


      if (resultado) {

        alert(
          'Notificación creada correctamente.'
        );


      } else {

        alert(
          'No se pudo crear la notificación.'
        );
      }
    }
  }
}