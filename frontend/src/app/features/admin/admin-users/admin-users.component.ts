import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AdminService } from '../../../core/services/admin.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';
import type { AdminUser } from '../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    AvatarComponent,
    PageHeaderComponent
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  private readonly adminService = inject(AdminService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);
  private readonly breakpoint = inject(BreakpointObserver);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  isMobile = signal(false);
  menuUser = signal<AdminUser | null>(null);

  /** Usuarios filtrados por tenant y por la organización seleccionada */
  users = computed(() => {
    const all = this.adminService.users();
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return all;
    const tenantUserIds = this.tenantContext.getTenantUsers(tid);
    const byTenant = tenantUserIds.length > 0 ? all.filter((u) => tenantUserIds.includes(u.id)) : all;
    const orgUnitId = this.orgService.selectedOrgUnitId();
    if (!orgUnitId) return byTenant;
    const scopeIds = new Set(this.orgService.getUserIdsInScope(tid, orgUnitId));
    return byTenant.filter((u) => scopeIds.has(u.id));
  });

  constructor() {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    this.breakpoint.observe('(max-width: 767px)').subscribe((r) => this.isMobile.set(r.matches));
  }
  roles = this.adminService.roles;
  teams = this.adminService.teams;

  getRoleName(roleId: string): string {
    return this.adminService.getRoleById(roleId)?.name ?? roleId;
  }

  getTeamName(teamId: string): string {
    return this.adminService.getTeamById(teamId)?.name ?? teamId;
  }

  getUnitNames(userId: string): string {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return '—';
    const ids = this.orgService.getOrgUnitIdsForUser(tid, userId);
    if (ids.length === 0) return '—';
    return ids
      .map((id) => this.orgService.getOrgUnitById(id)?.name ?? id)
      .join(', ');
  }

  openCreate(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requires connection', 'Close', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/usuarios/nueva']);
  }

  openEdit(user: AdminUser): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requires connection', 'Close', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/usuarios', user.id, 'editar']);
  }

  toggleActive(user: AdminUser): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requires connection', 'Close', { duration: 2000 });
      return;
    }
    try {
      this.adminService.setUserActive(user.id, !user.isActive);
      this.snackBar.open(user.isActive ? 'Usuario desactivado' : 'Usuario activado', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }
}
