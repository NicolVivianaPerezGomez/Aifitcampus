import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthCallback } from './pages/auth-callback/auth-callback';

/**
 * Rutas públicas del módulo de autenticación.
 */
export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  // El backend redirige aquí después del login con Microsoft
  { path: 'auth/callback', component: AuthCallback },
];
