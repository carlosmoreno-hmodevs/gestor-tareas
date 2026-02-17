import { Injectable, inject } from '@angular/core';
import type { User } from '../../shared/models';
import { AdminService } from './admin.service';

/** Mock current user for workflow (role checks, assignee filtering). */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly adminService = inject(AdminService);

  /** Returns first active user as current (Admin) for demo. Change to inject real auth when available. */
  getCurrentUser(): User {
    const users = this.adminService.getUsers();
    return users[0] ?? { id: 'user-1', name: 'Usuario Demo', email: 'demo@empresa.com', role: 'Admin', team: 'Operaciones' };
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
