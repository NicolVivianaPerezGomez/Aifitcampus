import { Routes } from '@angular/router';
import { UserLayout } from './components/user-layout/user-layout';

/**
 * Rutas del colaborador.
 * Menú: Inicio · Ejercicios · Mis pausas (incluye historial) · Dashboard (incluye estadísticas)
 */
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'ejercicios',
        loadComponent: () => import('./pages/ejercicios/ejercicios').then((m) => m.Ejercicios),
      },
      {
        path: 'mis-pausas',
        loadComponent: () => import('./pages/mis-pausas/mis-pausas').then((m) => m.MisPausas),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      /* Compatibilidad */
      { path: 'reproducir', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'historial', redirectTo: 'mis-pausas', pathMatch: 'full' },
      { path: 'estadisticas', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'userDashboard', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'pausaActiva', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
  {
    path: 'sesion',
    loadComponent: () => import('./pages/session/session').then((m) => m.Session),
  },
  {
    path: 'completar-registro',
    loadComponent: () =>
      import('./pages/completar-registro/completar-registro').then((m) => m.CompletarRegistro),
  },
];
