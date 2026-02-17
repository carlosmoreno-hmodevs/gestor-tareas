import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.scss'
})
export class AdminRolesComponent {
  private readonly adminService = inject(AdminService);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  roles = this.adminService.roles;
  permissions = this.adminService.permissions;
  selectedRoleId = signal<string | null>(null);

  selectRole(roleId: string): void {
    this.selectedRoleId.set(roleId);
  }

  togglePermission(roleId: string, permKey: string): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requires connection', 'Close', { duration: 2000 });
      return;
    }
    const role = this.adminService.roles().find((r) => r.id === roleId);
    if (!role || role.isSystem && roleId === 'role-owner') return;
    const perms = role.permissions.includes(permKey)
      ? role.permissions.filter((p) => p !== permKey)
      : [...role.permissions, permKey];
    this.adminService.updateRolePermissions(roleId, perms);
    this.snackBar.open('Permisos actualizados', 'Cerrar', { duration: 2000 });
  }

  hasPermission(roleId: string, permKey: string): boolean {
    return this.adminService.roles().find((r) => r.id === roleId)?.permissions?.includes(permKey) ?? false;
  }

  onSave(): void {
    this.snackBar.open('Los cambios se guardan automáticamente', 'Cerrar', { duration: 2000 });
  }

  groupByModule = (perms: { key: string; label: string; group: string }[]) => {
    const g: Record<string, typeof perms> = {};
    perms.forEach((p) => {
      if (!g[p.group]) g[p.group] = [];
      g[p.group].push(p);
    });
    return Object.entries(g);
  };
}
