import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TenantContextService } from '../services/tenant-context.service';

/** Requiere tenant seleccionado. Si no hay, redirige a /select-tenant. */
export const tenantGuard: CanActivateFn = () => {
  const tenantContext = inject(TenantContextService);
  const router = inject(Router);

  if (tenantContext.hasTenant()) return true;
  return router.createUrlTree(['/select-tenant']);
};
