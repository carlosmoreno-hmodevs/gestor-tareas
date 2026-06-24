import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Responsables: admin o coordinador (Fase 6.8). */
export const contactsManageGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.user()?.role;
  if (role === 'admin' || role === 'coordinator') {
    return true;
  }
  return router.createUrlTree(['/admin/denied']);
};
