import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';
import { TaskService } from '../../../core/services/task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { AdminCategory, AdminPriority, AdminTeam, AdminPosition } from '../../../shared/models/admin.model';

@Component({
  selector: 'app-admin-catalogos',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-catalogos.component.html',
  styleUrl: './admin-catalogos.component.scss'
})
export class AdminCatalogosComponent {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  readonly adminService = inject(AdminService);
  readonly connectivity = inject(ConnectivityService);
  readonly tenantSettings = inject(TenantSettingsService);

  /** En modo ferretero los catálogos base están bloqueados (solo lectura). */
  catalogLocked = this.tenantSettings.isFerretero;

  categories = this.adminService.categories;
  priorities = this.adminService.priorities;
  teams = this.adminService.teams;
  positions = this.adminService.positions;

  addCategory(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/categorias/nueva']);
  }

  editCategory(c: AdminCategory): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/categorias', c.id, 'editar']);
  }

  deleteCategory(c: AdminCategory): void {
    if (this.catalogLocked()) return;
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    const inUse = () => this.taskService.getAllTasksForTenant().some((t) => t.categoryId === c.id);
    try {
      this.adminService.deleteCategory(c.id, inUse);
      this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  addPriority(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/prioridades/nueva']);
  }

  editPriority(p: AdminPriority): void {
    if (this.catalogLocked()) return;
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/prioridades', p.id, 'editar']);
  }

  deletePriority(p: AdminPriority): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    if (!confirm(`¿Eliminar la prioridad "${p.name}"?`)) return;
    const inUse = () =>
      this.taskService.getAllTasksForTenant().some((t) => t.priority === p.value);
    try {
      this.adminService.deletePriority(p.id, inUse);
      this.snackBar.open('Prioridad eliminada', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  addTeam(): void {
    if (this.catalogLocked()) return;
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/equipos/nueva']);
  }

  editTeam(t: AdminTeam): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    this.router.navigate(['/admin/catalogos/equipos', t.id, 'editar']);
  }

  deleteTeam(t: AdminTeam): void {
    if (this.catalogLocked()) return;
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    if (!confirm(`¿Eliminar el equipo "${t.name}"?`)) return;
    const inUse = () => this.adminService.users().some((u) => u.teamId === t.id);
    try {
      this.adminService.deleteTeam(t.id, inUse);
      this.snackBar.open('Equipo eliminado', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  addPosition(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    const name = prompt('Nombre del puesto', 'Nuevo puesto')?.trim() || 'Nuevo puesto';
    const maxOrder = Math.max(0, ...this.positions().map((p) => p.order));
    try {
      this.adminService.addPosition({ name, order: maxOrder + 1, active: true });
      this.snackBar.open('Puesto agregado', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  deletePosition(pos: AdminPosition): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión', 'Cerrar', { duration: 2000 });
      return;
    }
    if (!confirm(`¿Eliminar el puesto "${pos.name}"?`)) return;
    try {
      this.adminService.deletePosition(pos.id);
      this.snackBar.open('Puesto eliminado', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }
}
