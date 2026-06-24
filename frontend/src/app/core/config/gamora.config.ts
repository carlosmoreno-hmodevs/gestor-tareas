import { environment } from '../../../environments/environment';

/** Mapeo tenant frontend → workspace slug API */
export const GAMORA_WORKSPACE_BY_TENANT: Record<string, string> = {
  'tenant-1': 'ferreteria-luisito',
};

/** Mapeo inverso workspace slug → tenant frontend */
export const GAMORA_TENANT_BY_WORKSPACE: Record<string, string> = Object.fromEntries(
  Object.entries(GAMORA_WORKSPACE_BY_TENANT).map(([tenantId, slug]) => [slug, tenantId])
);

export function tenantForWorkspaceSlug(slug: string): string | null {
  return GAMORA_TENANT_BY_WORKSPACE[slug] ?? null;
}

export function isGamoraApiTenant(tenantId: string | null): boolean {
  return (
    environment.gamoraApiEnabled &&
    !!tenantId &&
    tenantId in GAMORA_WORKSPACE_BY_TENANT
  );
}

export function workspaceSlugForTenant(tenantId: string): string {
  return GAMORA_WORKSPACE_BY_TENANT[tenantId] ?? 'ferreteria-luisito';
}
