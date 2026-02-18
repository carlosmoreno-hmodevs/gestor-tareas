/** Multi-tenant SaaS: tenant, membership, session */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  theme?: Record<string, string>;
}

export type GlobalRole = 'OWNER' | 'TENANT_ADMIN' | 'MEMBER' | 'VIEWER';

export interface TenantUser {
  tenantId: string;
  userId: string;
  globalRole: GlobalRole;
}

export interface CurrentSession {
  tenantId: string;
  userId: string;
}
