import { Injectable, inject, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import type { Tenant } from '../../shared/models/tenant.model';
import { INITIAL_TENANTS, INITIAL_TENANT_USERS } from '../data/tenant-initial';

const STORAGE_KEY_TENANT = 'ctx.currentTenantId';

@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly _currentTenantId = signal<string | null>(this.loadStoredTenantId());
  private readonly _tenantUsers = INITIAL_TENANT_USERS;
  private readonly _tenants = INITIAL_TENANTS;

  readonly currentTenantId = this._currentTenantId.asReadonly();
  readonly tenants = this._tenants;

  readonly currentTenant = computed<Tenant | null>(() => {
    const id = this._currentTenantId();
    return id ? this._tenants.find((t) => t.id === id) ?? null : null;
  });

  readonly tenant$ = toObservable(this.currentTenant);

  readonly hasTenant = computed(() => this._currentTenantId() !== null);

  private loadStoredTenantId(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TENANT);
      if (!raw) return null;
      const id = raw.trim();
      return this._tenants.some((t) => t.id === id) ? id : null;
    } catch {
      return null;
    }
  }

  setCurrentTenant(tenantId: string | null): void {
    if (tenantId && !this._tenants.some((t) => t.id === tenantId)) return;
    this._currentTenantId.set(tenantId);
    try {
      if (tenantId) {
        localStorage.setItem(STORAGE_KEY_TENANT, tenantId);
      } else {
        localStorage.removeItem(STORAGE_KEY_TENANT);
      }
    } catch {
      /* ignore */
    }
  }

  getTenants(): Tenant[] {
    return [...this._tenants];
  }

  getTenantById(id: string): Tenant | undefined {
    return this._tenants.find((t) => t.id === id);
  }

  getTenantUsers(tenantId: string): string[] {
    return this._tenantUsers.filter((tu) => tu.tenantId === tenantId).map((tu) => tu.userId);
  }

  getGlobalRole(tenantId: string, userId: string): import('../../shared/models/tenant.model').GlobalRole | undefined {
    return this._tenantUsers.find((tu) => tu.tenantId === tenantId && tu.userId === userId)?.globalRole;
  }

  isUserInTenant(tenantId: string, userId: string): boolean {
    return this._tenantUsers.some((tu) => tu.tenantId === tenantId && tu.userId === userId);
  }
}
