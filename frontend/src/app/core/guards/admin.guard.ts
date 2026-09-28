import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Reserva las rutas de administración para usuarios con rol admin.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado() && auth.esAdministrador()) {
    return true;
  }

  if (auth.estaAutenticado()) {
    return router.createUrlTree(['/user/inicio']);
  }

  return router.createUrlTree(['/login']);
};
