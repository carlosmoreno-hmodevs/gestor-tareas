import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Administración: rol backend `admin` (MVP Fase 6). */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.user()?.role;
  if (role === 'admin') return true;

  return router.createUrlTree(['/admin', 'denied']);
};
