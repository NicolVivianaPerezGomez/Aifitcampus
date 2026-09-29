import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserSidebar } from '../user-sidebar/user-sidebar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Header } from '../../../../shared/components/header/header';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LocalNotification, MOCK_NOTIFICATIONS } from '../../../../core/services/local-notification'; //cambiar tood de MOCK_NOTIFICATIONS es solo una prueba

@Component({
  imports: [RouterOutlet, MatSidenavModule, UserSidebar, MatToolbarModule, Header],
  selector: 'app-user-layout',
  styleUrl: './user-layout.css',
  templateUrl: './user-layout.html',
})
export class UserLayout {
  //inyección servicio de Angular que permite vigilar la resolución de patalla en tiempo real
  private breakpointObserver = inject(BreakpointObserver);

  // Signal que detecta si estamos en pantalla móvil (menor a 768px aproximadamente)
  isMobile = signal(false); //--> si es mobile

  // Signal que controla si el menú está colapsado (en Desktop) o cerrado (en Mobile)
  collapsed = signal(false); //--> menu solo con iconos

  //en el constructor se inyecta el servicio de notifiaciones
  //el constructor en el método que ejecuta todo el código cuando se crea una nueva instancia
  constructor(private localNotificationService: LocalNotification) {

    //CONTROL DE COLLAPSED CUANDO ES TAMAÑO MODIBLE

    // Escucha los cambios de tamaño de pantalla, monitorea específicamente Breakpoints.Handsety 768px
    this.breakpointObserver
      //Breakpoint.Handset: ruptura estándar de Angular Material y cuando la ventana sea menor 768px
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      //Me suscribo para ejecutar una función cada que se llega al tamaño anterior (suscribise: activar y escuchar un flujo de datos asincorno)
      .subscribe((result) => {
        //actualiza el valor de isMobile a...
        this.isMobile.set(result.matches);
        //si isMobile es true entonces iscollapsed tambien
        if (result.matches) {
          // En móvil siempre arranca colapsado/cerrado
          this.collapsed.set(true);
        }
      });
  }

  // ANCHO DINÁMICO ADAPTATIVO DEL SIDENAV

  //computed es una función que crea valores que dependen de otros datos y se actualizan cuando estos cambian
  sidenavWidth = computed(() => {
    //si isMobile es true el sidenav guardara un tamaño de 260px
    if (this.isMobile()) {
      return '260px'; // Ancho fijo cómodo para móviles cuando se despliega
    }
    //sino isMobile es false, entonces...
    // collapsed true (?): el ancho sera de 4.5 rem
    // collapsed false (:): el tamaño sera un clamp grande
    return this.collapsed() ? '4.5rem' : 'clamp(15rem, 20vw, 18rem)';
  });

  //MARGEN DEL CONTENIDO DE LA PÁGINA

  // Margen del contenido principal para que no se sobreponga en con el menu
  //computed es una función que crea valores que dependen de otros datos y se actualizan cuando estos cambian
  contentMargin = computed(() => {
    //si inMobile es true entonces la margen medira 0px (dato que se guarda) ocupa el 100% de la pantalla
    if (this.isMobile()) {
      return '0px';
    }
    //si inMobile es false entonces devuelve el valor que devuelva sidenadWidth
    //Empuja el contenido a la derehca
    return this.sidenavWidth();
  });

  //togglemenu que invierte el valor actual (osea de false a true o viceversa)
  toggleMenu() {
    this.collapsed.update((v) => !v);
  }

  //LÓGICA DE NOTIFIACIONES -------------------------------------------------------

  //ngOnInit cuando inicia el ciclo de vida del componente
  //función asincronica que ejecuta una promesa vacia, porque solo espera a la ejecución del método 
  async ngOnInit(): Promise<void> {
    await this.inicializarNotificaciones(); //espera la ejecuión del método
  }

  private async inicializarNotificaciones(): Promise<void>{
    try {
      //espsera que todas las notificaciones se envien (método del servicio de notifiaciones)
      await this.localNotificationService.scheduleAll(MOCK_NOTIFICATIONS); //cambiar MOCK_NOTIFICATIONS es solo una prueba
      //espsera que se muestren las notiifaciones pendientes ((método del servicio de notifiaciones)
      await this.localNotificationService.getPendingNotifications();
    } catch (error) {
      console.error('Error programar notificaciones automáticas:', error);
    }
  }
}
