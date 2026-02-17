import { CanActivateFn } from '@angular/router';

/** Permite acceso a administración a todos los usuarios. */
export const adminGuard: CanActivateFn = () => true;
