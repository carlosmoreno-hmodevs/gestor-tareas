import { Injectable, inject, signal } from '@angular/core';
import { ConnectivityService } from './connectivity.service';
import { TenantContextService } from './tenant-context.service';
import type {
  AdminUser,
  Role,
  AdminCategory,
  AdminPriority,
  AdminStatus,
  AdminProjectStatus,
  AdminTeam,
  AdminTagSuggestion,
  AdminProjectType,
  DueDateRules,
  NotificationRule,
  AdminSnapshot
} from '../../shared/models/admin.model';
import type { Category, StatusConfig, PriorityConfig, Team } from '../../shared/models';
import {
  PERMISSIONS,
  INITIAL_ROLES,
  INITIAL_ADMIN_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PRIORITIES,
  INITIAL_TASK_STATUSES,
  INITIAL_PROJECT_STATUSES,
  INITIAL_TEAMS,
  INITIAL_TAG_SUGGESTIONS,
  INITIAL_PROJECT_TYPES,
  INITIAL_DUE_DATE_RULES,
  INITIAL_NOTIFICATION_RULES
} from '../data/admin-initial';
import { ADMIN_SNAPSHOT_VERSION } from '../../shared/models/admin.model';

const STORAGE_PREFIX = 'gestor-tareas:snapshot:admin.';

function hydrateDates<T extends { createdAt?: Date }>(obj: T): T {
  if (obj.createdAt && typeof obj.createdAt === 'string') {
    return { ...obj, createdAt: new Date(obj.createdAt) };
  }
  return obj;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly tenantContext = inject(TenantContextService);

  private readonly _users = signal<AdminUser[]>([]);
  private readonly _roles = signal<Role[]>([]);
  private readonly _categories = signal<AdminCategory[]>([]);
  private readonly _priorities = signal<AdminPriority[]>([]);
  private readonly _taskStatuses = signal<AdminStatus[]>([]);
  private readonly _projectStatuses = signal<AdminProjectStatus[]>([]);
  private readonly _teams = signal<AdminTeam[]>([]);
  private readonly _tagSuggestions = signal<AdminTagSuggestion[]>([]);
  private readonly _projectTypes = signal<AdminProjectType[]>([]);
  private readonly _dueDateRules = signal<DueDateRules>(INITIAL_DUE_DATE_RULES);
  private readonly _notificationRules = signal<NotificationRule[]>(INITIAL_NOTIFICATION_RULES);

  readonly permissions = PERMISSIONS;

  constructor() {
    this.loadFromStorage();
  }

  private storageKey(): string {
    const tid = this.tenantContext.currentTenantId();
    return tid ? STORAGE_PREFIX + tid : '';
  }

  private loadFromStorage(): void {
    const key = this.storageKey();
    if (!key) {
      this.resetToInitial();
      return;
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const snap = JSON.parse(raw) as AdminSnapshot;
        const users = (snap.users ?? []).map((u) => hydrateDates(u) as AdminUser);
        this._users.set(users);
        this._roles.set(snap.roles ?? INITIAL_ROLES);
        this._categories.set(snap.categories ?? INITIAL_CATEGORIES);
        this._priorities.set(snap.priorities ?? INITIAL_PRIORITIES);
        this._taskStatuses.set(snap.taskStatuses ?? INITIAL_TASK_STATUSES);
        this._projectStatuses.set(snap.projectStatuses ?? INITIAL_PROJECT_STATUSES);
        this._teams.set(snap.teams ?? INITIAL_TEAMS);
        this._tagSuggestions.set(snap.tagSuggestions ?? INITIAL_TAG_SUGGESTIONS);
        this._projectTypes.set(snap.projectTypes ?? INITIAL_PROJECT_TYPES);
        this._dueDateRules.set(snap.dueDateRules ?? INITIAL_DUE_DATE_RULES);
        this._notificationRules.set(snap.notificationRules ?? INITIAL_NOTIFICATION_RULES);
        return;
      }
    } catch {
      /* fall through to defaults */
    }
    this.resetToInitial();
  }

  private resetToInitial(): void {
    this._users.set(INITIAL_ADMIN_USERS.map((u) => ({ ...u })));
    this._roles.set(INITIAL_ROLES.map((r) => ({ ...r, permissions: [...r.permissions] })));
    this._categories.set([...INITIAL_CATEGORIES]);
    this._priorities.set([...INITIAL_PRIORITIES]);
    this._taskStatuses.set([...INITIAL_TASK_STATUSES]);
    this._projectStatuses.set([...INITIAL_PROJECT_STATUSES]);
    this._teams.set([...INITIAL_TEAMS]);
    this._tagSuggestions.set([...INITIAL_TAG_SUGGESTIONS]);
    this._projectTypes.set([...INITIAL_PROJECT_TYPES]);
    this._dueDateRules.set({ ...INITIAL_DUE_DATE_RULES });
    this._notificationRules.set(INITIAL_NOTIFICATION_RULES.map((r) => ({ ...r })));
    this.persist();
  }

  private persist(): void {
    if (!this.connectivity.isOnline()) return;
    const key = this.storageKey();
    if (!key) return;
    try {
      const snap: AdminSnapshot = {
        version: ADMIN_SNAPSHOT_VERSION,
        users: this._users().map((u) => ({
          ...u,
          createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt
        })) as AdminUser[],
        roles: this._roles(),
        categories: this._categories(),
        priorities: this._priorities(),
        taskStatuses: this._taskStatuses(),
        projectStatuses: this._projectStatuses(),
        teams: this._teams(),
        tagSuggestions: this._tagSuggestions(),
        projectTypes: this._projectTypes(),
        dueDateRules: this._dueDateRules(),
        notificationRules: this._notificationRules(),
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(snap));
    } catch (e) {
      console.warn('AdminService: could not persist', e);
    }
  }

  // --- Getters (signals) ---
  users = this._users.asReadonly();
  roles = this._roles.asReadonly();
  categories = this._categories.asReadonly();
  priorities = this._priorities.asReadonly();
  taskStatuses = this._taskStatuses.asReadonly();
  projectStatuses = this._projectStatuses.asReadonly();
  teams = this._teams.asReadonly();
  tagSuggestions = this._tagSuggestions.asReadonly();
  projectTypes = this._projectTypes.asReadonly();
  dueDateRules = this._dueDateRules.asReadonly();
  notificationRules = this._notificationRules.asReadonly();

  // --- Compatibility with DataService (Category, PriorityConfig, StatusConfig, Team) ---
  getCategories(): Category[] {
    return this._categories()
      .filter((c) => c.active)
      .map((c) => ({ id: c.id, name: c.name, order: c.order, color: c.color }));
  }

  getPriorities(): PriorityConfig[] {
    return this._priorities()
      .filter((p) => p.active)
      .map((p) => ({ id: p.id, name: p.name, value: p.value as 'Alta' | 'Media' | 'Baja', order: p.order }));
  }

  getStatuses(): StatusConfig[] {
    return this._taskStatuses()
      .filter((s) => s.active)
      .map((s) => ({ id: s.id, name: s.name, value: s.value as import('../../shared/models').TaskStatus, order: s.order }));
  }

  getTeams(): Team[] {
    return this._teams()
      .filter((t) => t.active)
      .map((t) => ({ id: t.id, name: t.name, area: t.area, order: t.order }));
  }

  getUsers(): Array<{ id: string; name: string; email: string; role: string; team: string }> {
    const tid = this.tenantContext.currentTenantId();
    const tenantUserIds = tid ? this.tenantContext.getTenantUsers(tid) : [];
    const roles = this._roles();
    const teams = this._teams();
    return this._users()
      .filter((u) => u.isActive && (!tid || tenantUserIds.includes(u.id)))
      .map((u) => {
        const role = roles.find((r) => r.id === u.roleId);
        const team = teams.find((t) => t.id === u.teamId);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: role?.name ?? u.roleId,
          team: team?.name ?? u.teamId
        };
      });
  }

  getUserById(id: string): AdminUser | undefined {
    return this._users().find((u) => u.id === id);
  }

  getRoleById(id: string): Role | undefined {
    return this._roles().find((r) => r.id === id);
  }

  getTeamById(id: string): AdminTeam | undefined {
    return this._teams().find((t) => t.id === id);
  }

  // --- User CRUD ---
  createUser(payload: Omit<AdminUser, 'id'>): AdminUser {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const exists = this._users().some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error('Email already exists');
    const id = `user-${Date.now()}`;
    const user: AdminUser = {
      ...payload,
      id,
      isActive: payload.isActive ?? true,
      createdAt: new Date()
    };
    this._users.update((list) => [...list, user]);
    this.persist();
    return user;
  }

  updateUser(id: string, payload: Partial<AdminUser>): AdminUser {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const idx = this._users().findIndex((u) => u.id === id);
    if (idx < 0) throw new Error('User not found');
    if (payload.email) {
      const exists = this._users().some((u) => u.id !== id && u.email.toLowerCase() === payload.email!.toLowerCase());
      if (exists) throw new Error('Email already exists');
    }
    const updated = { ...this._users()[idx], ...payload };
    this._users.update((list) => list.map((u) => (u.id === id ? updated : u)));
    this.persist();
    return updated;
  }

  setUserActive(id: string, isActive: boolean): void {
    this.updateUser(id, { isActive });
  }

  // --- Role CRUD (permissions only for non-system) ---
  updateRolePermissions(roleId: string, permissions: string[]): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    this._roles.update((list) =>
      list.map((r) => (r.id === roleId ? { ...r, permissions: [...permissions] } : r))
    );
    this.persist();
  }

  // --- Catalog CRUD ---
  addCategory(payload: Omit<AdminCategory, 'id'>): AdminCategory {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const exists = this._categories().some(
      (c) => c.name.toLowerCase() === payload.name.toLowerCase()
    );
    if (exists) throw new Error('Name already exists');
    const id = `cat-${Date.now()}`;
    const item: AdminCategory = { ...payload, id };
    this._categories.update((l) => [...l, item]);
    this.persist();
    return item;
  }

  updateCategory(id: string, payload: Partial<AdminCategory>): AdminCategory {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const cat = this._categories().find((c) => c.id === id);
    if (!cat) throw new Error('Category not found');
    if (payload.name) {
      const exists = this._categories().some(
        (c) => c.id !== id && c.name.toLowerCase() === payload.name!.toLowerCase()
      );
      if (exists) throw new Error('Name already exists');
    }
    const updated = { ...cat, ...payload };
    this._categories.update((l) => l.map((c) => (c.id === id ? updated : c)));
    this.persist();
    return updated;
  }

  deleteCategory(id: string, inUse: () => boolean): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    if (inUse()) {
      this._categories.update((l) => l.map((c) => (c.id === id ? { ...c, active: false } : c)));
    } else {
      this._categories.update((l) => l.filter((c) => c.id !== id));
    }
    this.persist();
  }

  addPriority(payload: Omit<AdminPriority, 'id'>): AdminPriority {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const exists = this._priorities().some(
      (p) => p.name.toLowerCase() === payload.name.toLowerCase()
    );
    if (exists) throw new Error('Name already exists');
    const id = `pr-${Date.now()}`;
    const item: AdminPriority = { ...payload, id };
    this._priorities.update((l) => [...l, item]);
    this.persist();
    return item;
  }

  updatePriority(id: string, payload: Partial<AdminPriority>): AdminPriority {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const p = this._priorities().find((x) => x.id === id);
    if (!p) throw new Error('Priority not found');
    const updated = { ...p, ...payload };
    this._priorities.update((l) => l.map((x) => (x.id === id ? updated : x)));
    this.persist();
    return updated;
  }

  deletePriority(id: string, inUse: () => boolean): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    if (inUse()) {
      this._priorities.update((l) => l.map((x) => (x.id === id ? { ...x, active: false } : x)));
    } else {
      this._priorities.update((l) => l.filter((x) => x.id !== id));
    }
    this.persist();
  }

  addTeam(payload: Omit<AdminTeam, 'id'>): AdminTeam {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const exists = this._teams().some((t) => t.name.toLowerCase() === payload.name.toLowerCase());
    if (exists) throw new Error('Name already exists');
    const id = `team-${Date.now()}`;
    const item: AdminTeam = { ...payload, id };
    this._teams.update((l) => [...l, item]);
    this.persist();
    return item;
  }

  updateTeam(id: string, payload: Partial<AdminTeam>): AdminTeam {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    const t = this._teams().find((x) => x.id === id);
    if (!t) throw new Error('Team not found');
    const updated = { ...t, ...payload };
    this._teams.update((l) => l.map((x) => (x.id === id ? updated : x)));
    this.persist();
    return updated;
  }

  deleteTeam(id: string, inUse: () => boolean): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    if (inUse()) {
      this._teams.update((l) => l.map((x) => (x.id === id ? { ...x, active: false } : x)));
    } else {
      this._teams.update((l) => l.filter((x) => x.id !== id));
    }
    this.persist();
  }

  // --- Rules ---
  updateDueDateRules(rules: Partial<DueDateRules>): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    this._dueDateRules.update((r) => ({ ...r, ...rules }));
    this.persist();
  }

  updateNotificationRule(id: string, payload: Partial<NotificationRule>): void {
    if (!this.connectivity.isOnline()) throw new Error('Requires connection');
    this._notificationRules.update((list) =>
      list.map((r) => (r.id === id ? { ...r, ...payload } : r))
    );
    this.persist();
  }
}
