import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { CurrentUserService } from '../services/current-user.service';

/** Verifies user has admin.view permission. Uses role -> permissions mapping. */
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const adminService = inject(AdminService);
  const currentUser = inject(CurrentUserService);

  const adminUser = adminService.getUserById(currentUser.id);
  const role = adminUser
    ? adminService.getRoleById(adminUser.roleId)
    : adminService.roles().find((r) => r.name.toLowerCase() === currentUser.role?.toLowerCase());

  const effectiveRole = role;

  const hasAccess =
    effectiveRole?.permissions?.includes('admin.view') ||
    effectiveRole?.permissions?.includes('admin.manageUsers') ||
    ['Admin', 'Owner', 'Superadmin'].some(
      (r) => currentUser.role?.toLowerCase() === r.toLowerCase()
    );

  if (hasAccess) return true;
  return router.createUrlTree(['/admin', 'denied']);
};
