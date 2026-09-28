import { Service } from '@angular/core';
//ngZone indica a Angular de forma manual que ocurrio una acción en el teléfono, actualizate
/*Angular por defecto usa Zone.js vigila los eventos al hacer click en pantalla
pero puede fallar con librerias como local-notifications en celulares*/
import { Injectable, NgZone } from '@angular/core'; // CORREGIDO
import { LocalNotifications, LocalNotificationSchema, ActionPerformed} from '@capacitor/local-notifications';
import { LocalNotificationMock } from '../interfaces/local-notification-mock';
import { Router } from '@angular/router';

// Las notificaciones se cargarán desde el backend cuando el módulo esté disponible.
export const MOCK_NOTIFICATIONS: LocalNotificationMock[] = [];

@Injectable({
  //indica que el servicio puede ser ser gestionado por inyector de dependencias de Angular
  providedIn: 'root',
})
export class LocalNotification {
  //cada que se ejecute una instancia del código
  //se inyecta el router para redirigir al usuario al dar click en la notiifcación
  constructor(private router: Router, private ngZone: NgZone) {
    this.initNotificationListeners();
  }

  //MÉTODO PARA NAVEGAR AL DASHBOARD DEL USUARIO

  private initNotificationListeners(): void { //private solo puede ser llamado dentro del mismo servicio
    //addListener método de local-notification para escuchar eventos
    LocalNotifications.addListener(
      'localNotificationActionPerformed', //evento de capacitor que se dispara al darle click a la notif
      (action: ActionPerformed) => { //función que recibe la respuesta del evento
        this.ngZone.run(() => { //ngZone corre manualmente lo que contenga el método
          this.router.navigate(['/user/inicio']); //navega a la url
        });
      },
    );
  }

  /*PERMISOS DEL USUARIO PARA NOTIFIACIONES*/

  //async coniverte a la función en asincrona, devuelve siempre una promesa, un resultado futuro
  //Promesa es un dato que se recibira e el futuro de tipo boolean
  async requestPermissions(): Promise<boolean> {
    //await detiene el código hasta obtener el dato
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted'; //retorna estado "otorgado"
  }

  /* RECIBIR UNA LISTA DE NOTIFIACIONES Y PROGRAMARLAS EN EL SISTEMA */

  //función asincronica que recibe una promesa void
  //una promesa void se completa pero no devuelve nada
  //notificaciones es de tipo interfaz "LocalNotificationMock[]"
  async scheduleAll(notificaciones: LocalNotificationMock[]): Promise<void> {
    //el código espera la respuesta del método requestPermissions()
    const hasPermission = await this.requestPermissions();

    //Si no hay permisos (!)
    if (!hasPermission) {
      //muestra un mensaje de advertencia en consola
      console.warn('Permiso para notifiación denegado');
      return; //se detiene
    }

    //Si SI hay permisos

    /*se debe deben de convertir los /datos en el formato exigido por capacitor
      por eso el tipo de dato es LocalNotificationSchema[]*/

    //map es un método de los array, que devuelve una nueva lista pero con  la misma cantidad de elementos tranformados
    const notificationsList: LocalNotificationSchema[] = notificaciones.map((item) => ({
      //formato exigido por capacitor
      id: item.id,
      title: item.title,
      body: item.body,
      schedule: { at: item.scheduleAt }, //objeto schedule con el horario definido
      smallIcon: 'ic_mi_notificacion', //icono de la barra de notificaciones
      actionTypeId: '', //contiene acciones específicas
      extra: { targetRoute: '/user/inicio' }, //info adicional oculta
    }));

    //PROGRAMAR ENVIO DE TODAS LAS NOTIFICACIONES

    /*localNotifications es un método propio de "capacitor/local-notifications
      su función es tomar el arreglo de objetos y registrarlos en el sistema operativo*/
    await LocalNotifications.schedule({
      //formato de las notificaciones que pide capactior
      notifications: notificationsList, //guarda notificationsList
    });

    console.log(`${notificationsList.length} notificaciones programadas correctamente.`);
  }

  //VER NOTIFICACIONES PENDIENTES EN COLA

  //función asincrona que devuelve las notificaciones pendientes
  async getPendingNotifications() {
    // await detiene el código y espera la respuesta de "LocalNotifications.getPending()" propia de capacitor notifications
    const pending = await LocalNotifications.getPending();
    console.log('Notificaciones pendientes en el dispositivo:', pending); //muestra las notif pendientes
    return pending;
  }
}
