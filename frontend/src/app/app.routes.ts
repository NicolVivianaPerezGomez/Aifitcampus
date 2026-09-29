import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AUTH_ROUTES } from './features/auth/auth.routes';

/**
 * Enrutado raíz: autenticación pública, admin protegido y espacio del colaborador.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  ...AUTH_ROUTES,
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
  },
  { path: '**', redirectTo: 'login' },
];
