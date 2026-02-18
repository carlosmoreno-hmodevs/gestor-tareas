import { Injectable, inject } from '@angular/core';
import type { User } from '../../shared/models';
import { AdminService } from './admin.service';

/** Mock current user for workflow (role checks, assignee). Siempre devuelve el primer usuario activo del tenant. */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly adminService = inject(AdminService);

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
