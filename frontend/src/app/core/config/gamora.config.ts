import { environment } from '../../../environments/environment';

/** Mapeo tenant frontend → workspace slug API */
export const GAMORA_WORKSPACE_BY_TENANT: Record<string, string> = {
  'tenant-1': 'ferreteria-luisito',
};

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

/** Contactos demo seed (Ferretería Luisito) para actor en transiciones dev */
export const GAMORA_DEV_CONTACTS = {
  luisito: '00000000-0000-4000-8000-000000000001',
  panchito: '00000000-0000-4000-8000-000000000002',
  marco: '00000000-0000-4000-8000-000000000003',
} as const;
