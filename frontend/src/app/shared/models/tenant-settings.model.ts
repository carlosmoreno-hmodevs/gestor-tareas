/** Modo de sistema por tenant: normal (genérico) o ferretero (perfil ferretería). */
export type SystemMode = 'normal' | 'ferretero';

export interface TenantSettings {
  tenantId: string;
  systemMode: SystemMode;
  updatedAt: string;
  updatedByUserId?: string;
}

export const DEFAULT_SYSTEM_MODE: SystemMode = 'normal';
