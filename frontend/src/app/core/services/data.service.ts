import { Injectable, inject, computed } from '@angular/core';
import { ALERT_RULES, DOCUMENTS } from '../data/dummy-data';
import type { User, Project, AlertRule, Document } from '../../shared/models';
import { ProjectService } from './project.service';
import { AdminService } from './admin.service';
import { OrgService } from './org.service';
import { TenantContextService } from './tenant-context.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly projectService = inject(ProjectService);
  private readonly adminService = inject(AdminService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);

  /** Usuarios filtrados por la organización seleccionada (reactivo al cambio de org) */
  readonly usersForCurrentOrg = computed(() => {
    this.orgService.selectedOrgUnitId();
    this.tenantContext.currentTenantId();
    return this.getUsers();
  });

  /** Proyectos filtrados por la organización seleccionada (reactivo al cambio de org) */
  readonly projectsForCurrentOrg = computed(() => {
    this.orgService.selectedOrgUnitId();
    this.tenantContext.currentTenantId();
    return this.projectService.getProjects();
  });

  getUsers(): User[] {
    const all = this.adminService.getUsers();
    const tenantId = this.tenantContext.currentTenantId();
    const orgUnitId = this.orgService.selectedOrgUnitId();
    if (!tenantId || !orgUnitId) return all;
    const scopeIds = new Set(this.orgService.getUserIdsInScope(tenantId, orgUnitId));
    return all.filter((u) => scopeIds.has(u.id));
  }

  getProjects(): Project[] {
    return this.projectsForCurrentOrg();
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
