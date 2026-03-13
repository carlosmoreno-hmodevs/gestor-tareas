import { Injectable, inject, computed, signal, effect } from '@angular/core';
import type { User } from '../../shared/models';
import { AdminService } from './admin.service';
import { TenantContextService } from './tenant-context.service';

/** Usuario actual seleccionable por tenant. */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly adminService = inject(AdminService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly _selectedUserId = signal<string | null>(null);

  private storageKey(): string {
    const tid = this.tenantContext.currentTenantId() ?? 'default';
    return `ctx.currentUserId.${tid}`;
  }

  private readStoredUserId(): string | null {
    try {
      return localStorage.getItem(this.storageKey());
    } catch {
      return null;
    }
  }

  private writeStoredUserId(userId: string): void {
    try {
      localStorage.setItem(this.storageKey(), userId);
    } catch {
      /* ignore */
    }
  }

  readonly availableUsers = computed(() => this.adminService.getUsers());

  constructor() {
    effect(
      () => {
        this.tenantContext.currentTenantId();
        const users = this.availableUsers();
        const stored = this.readStoredUserId();
        const valid = stored && users.some((u) => u.id === stored) ? stored : users[0]?.id ?? null;
        this._selectedUserId.set(valid);
        if (valid) this.writeStoredUserId(valid);
      },
      { allowSignalWrites: true }
    );
  }

  readonly currentUser = computed<User>(() => {
    const users = this.availableUsers();
    const selectedId = this._selectedUserId();
    const selected = selectedId ? users.find((u) => u.id === selectedId) : undefined;
    const fallback = users[0] ?? { id: 'user-1', name: 'Usuario Demo', email: 'demo@empresa.com', role: 'Admin', team: 'Operaciones' };
    return selected ?? fallback;
  });

  getCurrentUser(): User {
    return this.currentUser();
  }

  setCurrentUser(userId: string): void {
    const exists = this.availableUsers().some((u) => u.id === userId);
    if (!exists) return;
    this._selectedUserId.set(userId);
    this.writeStoredUserId(userId);
  }

  get role(): string {
    return this.getCurrentUser().role;
  }

  get team(): string {
    return this.getCurrentUser().team;
  }

  get id(): string {
    return this.getCurrentUser().id;
  }

  get name(): string {
    return this.getCurrentUser().name;
  }
}
