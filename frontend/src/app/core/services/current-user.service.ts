import { Injectable, inject, computed } from '@angular/core';
import type { User } from '../../shared/models';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  assignee: 'Operador',
  viewer: 'Solo lectura',
};

/** Usuario actual — sesión JWT real o fallback admin mock (legacy). */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);

  readonly useRealAuth = computed(() => this.authService.isAuthenticated());

  readonly availableUsers = computed(() => this.adminService.getUsers());

  readonly currentUser = computed<User>(() => {
    const sessionUser = this.authService.user();
    if (sessionUser) {
      return {
        id: sessionUser.id,
        name: sessionUser.displayName,
        email: sessionUser.email,
        role: ROLE_LABELS[sessionUser.role] ?? sessionUser.role,
        team: 'Operaciones',
        avatarUrl: null,
      };
    }

    const users = this.availableUsers();
    const fallback = users[0];
    if (!fallback) {
      return {
        id: 'user-1',
        name: 'Usuario Demo',
        email: 'demo@empresa.com',
        role: 'Admin',
        team: 'Operaciones',
        avatarUrl: null,
      };
    }
    return {
      id: fallback.id,
      name: fallback.name,
      email: fallback.email,
      role: typeof fallback.role === 'string' ? fallback.role : 'Member',
      team: 'team' in fallback && typeof fallback.team === 'string' ? fallback.team : 'Operaciones',
      avatarUrl: null,
    };
  });

  getCurrentUser(): User {
    return this.currentUser();
  }

  setCurrentUser(_userId: string): void {
    /* Deshabilitado con auth real — el usuario viene de la sesión JWT */
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

  /** Contacto operativo Gamora vinculado al usuario autenticado. */
  get gamoraContactId(): string | null {
    return this.authService.contactId();
  }
}
