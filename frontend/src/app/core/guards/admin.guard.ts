import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TenantContextService } from '../services/tenant-context.service';
import { CurrentUserService } from '../services/current-user.service';

/** Verifica globalRole: solo OWNER y TENANT_ADMIN pueden acceder a administración. */
export const adminGuard: CanActivateFn = () => {
  const tenantContext = inject(TenantContextService);
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);

  const tid = tenantContext.currentTenantId();
  if (!tid) return router.createUrlTree(['/select-tenant']);

  const globalRole = tenantContext.getGlobalRole(tid, currentUser.id);
  const hasAccess = globalRole === 'OWNER' || globalRole === 'TENANT_ADMIN';

  if (hasAccess) return true;
  return router.createUrlTree(['/admin', 'denied']);
};
