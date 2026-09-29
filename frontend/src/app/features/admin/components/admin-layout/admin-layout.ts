import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Header } from '../../../../shared/components/header/header';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  imports: [RouterOutlet, MatSidenavModule, AdminSidebar, MatToolbarModule, Header],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  //inyección servicio de Angular que permite vigilar la resolución de patalla en tiempo real
  private breakpointObserver = inject(BreakpointObserver);

  // Signal que detecta si estamos en pantalla móvil (menor a 768px aproximadamente)
  isMobile = signal(false); //--> si esta en modo mobile

  // Signal que controla si el menú está colapsado (en Desktop) o cerrado (en Mobile)
  collapsed = signal(false); //--> menu solo con iconos 

  constructor() {

    //CONTROL DE COLLAPSED CUANDO ES TAMAÑO MOBILE

    // Escucha los cambios de tamaño de pantalla
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
    // collapsed true (?): el ancho sera de 4.5 rem -> menu con iconos
    // collapsed false (:): el tamaño sera un clamp grande -> menu normal
    return this.collapsed() ? '4.5rem' : 'clamp(15rem, 20vw, 18rem)';
  });

  //MARGEN DEL CONTENIDO DE LA PÁGINA 

  // Margen del contenido principal (0px en móvil para usar todo el ancho de la pantalla)
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
}
