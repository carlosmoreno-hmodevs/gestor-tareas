import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';
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
  private readonly router = inject(Router);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  users = this.adminService.users;
  roles = this.adminService.roles;
  teams = this.adminService.teams;

  getRoleName(roleId: string): string {
    return this.adminService.getRoleById(roleId)?.name ?? roleId;
  }

  getTeamName(teamId: string): string {
    return this.adminService.getTeamById(teamId)?.name ?? teamId;
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
