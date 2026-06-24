import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  UsersApiService,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  isUserActive,
  type WorkspaceUserDto,
  type ApiUserStatus,
} from '../../../core/api/users-api.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { mapGamoraApiError } from '../../../core/api/gamora-api-error.mapper';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    AvatarComponent,
    PageHeaderComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  private readonly usersApi = inject(UsersApiService);
  private readonly router = inject(Router);
  private readonly breakpoint = inject(BreakpointObserver);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  readonly users = signal<WorkspaceUserDto[]>([]);
  readonly loading = signal(true);
  readonly isMobile = signal(false);
  readonly menuUser = signal<WorkspaceUserDto | null>(null);

  readonly displayedColumns = ['avatar', 'name', 'email', 'role', 'contact', 'status', 'actions'];

  ngOnInit(): void {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    this.breakpoint.observe('(max-width: 767px)').subscribe((r) => this.isMobile.set(r.matches));
    void this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await this.usersApi.list();
      this.users.set(list);
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

  getRoleLabel(role: string): string {
    return USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] ?? role;
  }

  getStatusLabel(status: string): string {
    return USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS] ?? status;
  }

  isActive(user: WorkspaceUserDto): boolean {
    return isUserActive(user.status);
  }

  openCreate(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Se requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/usuarios/nueva']);
  }

  openEdit(user: WorkspaceUserDto): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Se requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/usuarios', user.id, 'editar']);
  }

  async toggleActive(user: WorkspaceUserDto): Promise<void> {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Se requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    const nextStatus: ApiUserStatus = this.isActive(user) ? 'inactive' : 'active';
    try {
      await this.usersApi.updateStatus(user.id, nextStatus);
      await this.loadUsers();
      this.snackBar.open(
        nextStatus === 'active' ? 'Usuario activado' : 'Usuario desactivado',
        'Cerrar',
        { duration: 2000 }
      );
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    }
  }
}
