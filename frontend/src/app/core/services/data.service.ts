import { Injectable, inject } from '@angular/core';
import { ALERT_RULES, DOCUMENTS } from '../data/dummy-data';
import type { User, Project, AlertRule, Document } from '../../shared/models';
import { ProjectService } from './project.service';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly projectService = inject(ProjectService);
  private readonly adminService = inject(AdminService);

  getUsers(): User[] {
    return this.adminService.getUsers();
  }

  getProjects(): Project[] {
    return this.projectService.getProjects();
  }

  getAlertRules(): AlertRule[] {
    return [...ALERT_RULES];
  }

  getDocuments(): Document[] {
    return [...DOCUMENTS];
  }

  getCategories() {
    return this.adminService.getCategories();
  }

  getStatuses() {
    return this.adminService.getStatuses();
  }

  getPriorities() {
    return this.adminService.getPriorities();
  }

  getTeams() {
    return this.adminService.getTeams();
  }
}
