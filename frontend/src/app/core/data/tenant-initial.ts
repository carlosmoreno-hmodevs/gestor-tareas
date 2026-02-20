import type { Tenant, TenantUser } from '../../shared/models/tenant.model';

export const INITIAL_TENANTS: Tenant[] = [
  { id: 'tenant-1', name: 'Ferretería y Construcción Norte', slug: 'ferreteria-norte' },
  { id: 'tenant-2', name: 'Cadena Retail Sur', slug: 'cadena-retail-sur' }
];

/** Usuarios asignados a cada tenant con globalRole. Permissions vienen de roles (AdminService). */
export const INITIAL_TENANT_USERS: TenantUser[] = [
  { tenantId: 'tenant-1', userId: 'user-owner', globalRole: 'OWNER' },
  { tenantId: 'tenant-1', userId: 'user-1', globalRole: 'TENANT_ADMIN' },
  { tenantId: 'tenant-1', userId: 'user-2', globalRole: 'MEMBER' },
  { tenantId: 'tenant-1', userId: 'user-3', globalRole: 'MEMBER' },
  { tenantId: 'tenant-1', userId: 'user-7', globalRole: 'MEMBER' },
  { tenantId: 'tenant-1', userId: 'user-8', globalRole: 'MEMBER' },
  { tenantId: 'tenant-2', userId: 'user-owner', globalRole: 'OWNER' },
  { tenantId: 'tenant-2', userId: 'user-1', globalRole: 'TENANT_ADMIN' },
  { tenantId: 'tenant-2', userId: 'user-4', globalRole: 'MEMBER' },
  { tenantId: 'tenant-2', userId: 'user-5', globalRole: 'MEMBER' },
  { tenantId: 'tenant-2', userId: 'user-6', globalRole: 'VIEWER' }
];
