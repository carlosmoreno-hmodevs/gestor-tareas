import { Injectable, inject, signal, computed } from '@angular/core';
import { TenantContextService } from './tenant-context.service';
import type { SystemMode, TenantSettings } from '../../shared/models/tenant-settings.model';
import { DEFAULT_SYSTEM_MODE } from '../../shared/models/tenant-settings.model';

const STORAGE_PREFIX = 'gestor-tareas:snapshot:settings.';

@Injectable({ providedIn: 'root' })
export class TenantSettingsService {
  private readonly tenantContext = inject(TenantContextService);

  private readonly _settingsByTenant = signal<Record<string, TenantSettings>>({});

  constructor() {
    this._settingsByTenant.set(this.loadAllStoredSettings());
  }

  /** Clave localStorage para un tenant. */
  private storageKey(tenantId: string): string {
    return STORAGE_PREFIX + tenantId;
  }

  private loadAllStoredSettings(): Record<string, TenantSettings> {
    const out: Record<string, TenantSettings> = {};
    try {
      const prefix = STORAGE_PREFIX;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          const tenantId = key.slice(prefix.length);
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as TenantSettings;
            if (parsed.tenantId) {
              // Modo único soportado actualmente: normal.
              out[tenantId] = {
                ...parsed,
                systemMode: 'normal'
              };
            }
          }
        }
      }
    } catch {
      /* ignore */
    }
    return out;
  }

  /**
   * Obtiene la configuración del tenant. Si no existe, devuelve default (systemMode por defecto: normal).
   */
  getSettings(tenantId: string): TenantSettings {
    const stored = this._settingsByTenant()[tenantId];
    if (stored) return { ...stored };
    const now = new Date().toISOString();
    return {
      tenantId,
      systemMode: DEFAULT_SYSTEM_MODE,
      updatedAt: now
    };
  }

  /**
   * Establece el modo de sistema para el tenant y persiste.
   * Solo debe llamarse desde Admin (OWNER/TENANT_ADMIN).
   */
  setSystemMode(tenantId: string, mode: SystemMode, updatedByUserId?: string): void {
    const now = new Date().toISOString();
    const settings: TenantSettings = {
      tenantId,
      // Modo único soportado actualmente: normal.
      systemMode: 'normal',
      updatedAt: now,
      updatedByUserId
    };
    this._settingsByTenant.update((m) => ({ ...m, [tenantId]: settings }));
    try {
      localStorage.setItem(this.storageKey(tenantId), JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    if (mode === 'ferretero') {
      // Sin efecto: se mantiene modo normal.
      return;
    }
  }

  /** Modo de sistema del tenant actual (reactivo). */
  readonly systemMode = computed<SystemMode>(() => {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return DEFAULT_SYSTEM_MODE;
    return this.getSettings(tid).systemMode;
  });

  readonly isFerretero = computed(() => this.systemMode() === 'ferretero');
  readonly isNormal = computed(() => this.systemMode() === 'normal');
}
