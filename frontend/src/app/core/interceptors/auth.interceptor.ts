import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Agrega "Authorization: Bearer <token>" a las peticiones al backend.
 * Si el backend responde 401 (token vencido o inválido), cierra la sesión.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.obtenerToken();

  const esBackend = req.url.startsWith(environment.apiUrl);
  const peticion =
    token && esBackend ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error) => {
      if (error.status === 401 && esBackend) {
        auth.cerrarSesion();
        void router.navigate(['/login'], {
          queryParams: { error: 'Tu sesión expiró, inicia sesión nuevamente.' },
        });
      }
      return throwError(() => error);
    }),
  );
};
