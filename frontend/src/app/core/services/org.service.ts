import { Injectable, inject, signal, computed, effect } from '@angular/core';
import type { OrgUnit, OrgUnitType, OrgUnitTreeNode, UserOrgMembership } from '../../shared/models/org.model';
import { TenantContextService } from './tenant-context.service';
import {
  INITIAL_ORG_UNITS,
  INITIAL_ORG_UNIT_TYPES,
  INITIAL_USER_ORG_MEMBERSHIPS
} from '../data/org-initial';

const STORAGE_PREFIX = 'ctx.';
const STORAGE_SUFFIX_ORG = '.orgUnitId';

@Injectable({ providedIn: 'root' })
export class OrgService {
  private readonly tenantContext = inject(TenantContextService);

  private readonly _units = signal<OrgUnit[]>(INITIAL_ORG_UNITS);
  private readonly _types = signal<OrgUnitType[]>(INITIAL_ORG_UNIT_TYPES);
  private readonly _memberships = signal<UserOrgMembership[]>(INITIAL_USER_ORG_MEMBERSHIPS);

  readonly units = this._units.asReadonly();
  readonly types = this._types.asReadonly();
  readonly memberships = this._memberships.asReadonly();

  private readonly _selectedOrgUnitId = signal<string | null>(null);

  readonly selectedOrgUnitId = this._selectedOrgUnitId.asReadonly();

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      this._selectedOrgUnitId.set(tid ? this.loadStoredOrgUnitIdFor(tid) : null);
    }, { allowSignalWrites: true });
  }

  readonly currentTenantId = this.tenantContext.currentTenantId;

  readonly selectedOrgUnit = computed(() => {
    const id = this._selectedOrgUnitId();
    const tid = this.tenantContext.currentTenantId();
    if (!id || !tid) return null;
    return this._units().find((u) => u.id === id && u.tenantId === tid) ?? null;
  });

  private loadStoredOrgUnitIdFor(tid: string): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + tid + STORAGE_SUFFIX_ORG);
      if (raw) {
        const id = raw.trim();
        if (this._units().some((u) => u.id === id && u.tenantId === tid)) return id;
      }
      // Por defecto: primera unidad organizativa del tenant para no pedir selección en cada recarga
      const units = this.getOrgUnits(tid);
      return units.length > 0 ? units[0].id : null;
    } catch {
      return null;
    }
  }

  setSelectedOrgUnit(orgUnitId: string | null): void {
    this._selectedOrgUnitId.set(orgUnitId);
    const tid = this.tenantContext.currentTenantId();
    if (tid) {
      try {
        if (orgUnitId) {
          localStorage.setItem(STORAGE_PREFIX + tid + STORAGE_SUFFIX_ORG, orgUnitId);
        } else {
          localStorage.removeItem(STORAGE_PREFIX + tid + STORAGE_SUFFIX_ORG);
        }
      } catch {
        /* ignore */
      }
    }
  }

  getOrgUnitTypes(tenantId: string): OrgUnitType[] {
    return this._types().filter((t) => t.tenantId === tenantId).sort((a, b) => a.order - b.order);
  }

  getOrgUnits(tenantId: string): OrgUnit[] {
    return this._units().filter((u) => u.tenantId === tenantId && u.isActive);
  }

  getOrgTree(tenantId: string): OrgUnitTreeNode[] {
    const flat = this.getOrgUnits(tenantId);
    const byParent = new Map<string | undefined, OrgUnit[]>();
    for (const u of flat) {
      const parent = u.parentId ?? undefined;
      if (!byParent.has(parent)) byParent.set(parent, []);
      byParent.get(parent)!.push(u);
    }
    const build = (parentId: string | undefined): OrgUnitTreeNode[] => {
      const list = byParent.get(parentId) ?? [];
      return list.map((u) => ({
        ...u,
        children: build(u.id)
      }));
    };
    return build(undefined);
  }

  getDescendants(orgUnitId: string): string[] {
    const all = this._units();
    const result: string[] = [];
    const collect = (id: string) => {
      for (const u of all) {
        if (u.parentId === id && u.isActive) {
          result.push(u.id);
          collect(u.id);
        }
      }
    };
    collect(orgUnitId);
    return result;
  }

  /** IDs de unidades en scope: la unidad seleccionada + sus descendientes */
  getScopeOrgUnitIds(tenantId: string, selectedOrgUnitId: string | null): string[] | null {
    if (!selectedOrgUnitId) return null;
    const unit = this._units().find((u) => u.id === selectedOrgUnitId && u.tenantId === tenantId);
    if (!unit) return null;
    const ids = [unit.id, ...this.getDescendants(unit.id)];
    return ids;
  }

  isUserInOrgScope(userId: string, orgUnitId: string): boolean {
    const ids = [orgUnitId, ...this.getDescendants(orgUnitId)];
    return this._memberships().some(
      (m) => m.userId === userId && ids.includes(m.orgUnitId)
    );
  }

  getOrgUnitById(id: string): OrgUnit | undefined {
    return this._units().find((u) => u.id === id);
  }

  addOrgUnit(payload: Omit<OrgUnit, 'id'>): OrgUnit {
    const id = `ou-${Date.now()}`;
    const unit: OrgUnit = { ...payload, id };
    this._units.update((list) => [...list, unit]);
    return unit;
  }

  updateOrgUnit(id: string, payload: Partial<OrgUnit>): OrgUnit {
    const idx = this._units().findIndex((u) => u.id === id);
    if (idx < 0) throw new Error('OrgUnit not found');
    const updated = { ...this._units()[idx], ...payload };
    this._units.update((list) => list.map((u) => (u.id === id ? updated : u)));
    return updated;
  }

  deactivateOrgUnit(id: string): void {
    this.updateOrgUnit(id, { isActive: false });
  }

  assignUserToOrgUnit(userId: string, orgUnitId: string, tenantId: string): void {
    const exists = this._memberships().some(
      (m) => m.userId === userId && m.orgUnitId === orgUnitId && m.tenantId === tenantId
    );
    if (exists) return;
    const id = `uom-${Date.now()}`;
    this._memberships.update((list) => [
      ...list,
      { id, tenantId, userId, orgUnitId }
    ]);
  }

  removeUserFromOrgUnit(membershipId: string): void {
    this._memberships.update((list) => list.filter((m) => m.id !== membershipId));
  }

  /** IDs de usuarios en el scope (unidad + descendientes) */
  getUserIdsInScope(tenantId: string, orgUnitId: string): string[] {
    const ids = [orgUnitId, ...this.getDescendants(orgUnitId)];
    const userIds = this._memberships()
      .filter((m) => m.tenantId === tenantId && ids.includes(m.orgUnitId))
      .map((m) => m.userId);
    return [...new Set(userIds)];
  }

  /** Memberships de un usuario en el tenant (para mostrar/editar) */
  getMembershipsByOrgUnit(tenantId: string, orgUnitId: string): UserOrgMembership[] {
    return this._memberships().filter(
      (m) => m.tenantId === tenantId && m.orgUnitId === orgUnitId
    );
  }

  /** IDs de unidades a las que pertenece un usuario en el tenant */
  getOrgUnitIdsForUser(tenantId: string, userId: string): string[] {
    return this._memberships()
      .filter((m) => m.tenantId === tenantId && m.userId === userId)
      .map((m) => m.orgUnitId);
  }

  /** Reemplaza las unidades asignadas a un usuario (para guardar desde el form de usuario) */
  setUserOrgUnits(tenantId: string, userId: string, orgUnitIds: string[]): void {
    this._memberships.update((list) => {
      const without = list.filter((m) => !(m.tenantId === tenantId && m.userId === userId));
      const validIds = (orgUnitIds ?? []).filter(
        (id) => id && this._units().some((u) => u.id === id && u.tenantId === tenantId)
      );
      const toAdd = validIds.map((orgUnitId, i) => ({
        id: `uom-${Date.now()}-${i}`,
        tenantId,
        userId,
        orgUnitId
      }));
      return [...without, ...toAdd];
    });
  }

  /** Persistir cambios en localStorage (mock - para paso posterior si se requiere) */
  persist(): void {
    /* Mock: los signals ya mantienen el estado en memoria */
  }
}
