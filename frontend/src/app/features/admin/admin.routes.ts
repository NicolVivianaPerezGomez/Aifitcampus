import { Routes } from '@angular/router';
import { AdminLayout } from './components/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { AdminEjercicios } from './pages/admin-ejercicios/admin-ejercicios';
import { AdminEjerciciosFormulario } from './pages/admin-ejercicios-formulario/admin-ejercicios-formulario';
import { AdminHorarios } from './pages/admin-horarios/admin-horarios';
import { AdminHorariosFormulario } from './pages/admin-horarios-formulario/admin-horarios-formulario';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';
import { AdminRutinas } from './pages/admin-rutinas/admin-rutinas';
import { AdminRutinasFormulario } from './pages/admin-rutinas-formulario/admin-rutinas-formulario';
import { Notifications } from './pages/notifications/notifications';
import { AdminNotificaciones } from './pages/admin-notificaciones/admin-notificaciones';
import { AdminNotificacionesFormulario } from './pages/admin-notificaciones-formulario/admin-notificaciones-formulario';
import { AdminInsignias } from './pages/admin-insignias/admin-insignias';
import { AdminInsigniasFormulario } from './pages/admin-insignias-formulario/admin-insignias-formulario';

/**
 * Rutas del módulo de administración.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: 'adminDashboard', component: Dashboard },
      { path: 'adminHorarios', component: AdminHorarios },
      { path: 'adminHorariosFormulario', component: AdminHorariosFormulario },
      { path: 'adminEjercicios', component: AdminEjercicios },
      { path: 'adminEjerciciosFormulario', component: AdminEjerciciosFormulario },
      { path: 'adminUsuarios', component: AdminUsuarios },
      { path: 'adminRutinas', component: AdminRutinas },
      { path: 'adminRutinasFormulario', component: AdminRutinasFormulario },
      { path: 'notificaciones', component: Notifications },
      { path: 'adminNotificaciones', component: AdminNotificaciones },
      { path: 'adminNotificacionesFormulario', component: AdminNotificacionesFormulario },
      { path: 'adminInsignias', component: AdminInsignias },
      { path: 'adminInsigniasFormulario', component: AdminInsigniasFormulario },
    ],
  },
];
