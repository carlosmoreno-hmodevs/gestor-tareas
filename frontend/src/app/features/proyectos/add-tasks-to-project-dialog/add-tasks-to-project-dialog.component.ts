import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { DataService } from '../../../core/services/data.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import type { Task, TaskStatus } from '../../../shared/models';

export interface AddTasksToProjectDialogData {
  projectId: string;
  projectName: string;
  /** IDs de tareas ya en el proyecto (no mostrarlas) */
  excludeTaskIds: string[];
  /** Si true, mostrar solo tareas del scope org actual */
  scopeOnly?: boolean;
}

export interface AddTasksToProjectDialogResult {
  added: number;
}

@Component({
  selector: 'app-add-tasks-to-project-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-tasks-to-project-dialog.component.html',
  styleUrl: './add-tasks-to-project-dialog.component.scss'
})
export class AddTasksToProjectDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTasksToProjectDialogComponent>);
  readonly data = inject<AddTasksToProjectDialogData>(MAT_DIALOG_DATA);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);

  searchText = signal('');
  scopeOnly = signal(true);
  statusFilter = signal<TaskStatus | ''>('');
  categoryFilter = signal<string>('');
  selectedIds = signal<Set<string>>(new Set());
  saving = signal(false);
  confirmMove = signal(false);

  categories = this.dataService.getCategories();

  /** Tareas del tenant; si scopeOnly, filtrar por org actual */
  candidateTasks = computed(() => {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    let list = this.taskService.getAllTasksForTenant();
    if (this.scopeOnly()) {
      const scopeOuId = this.orgService.selectedOrgUnitId();
      const scopeIds = tid ? this.orgService.getScopeOrgUnitIds(tid, scopeOuId) : null;
      if (scopeIds?.length) {
        list = list.filter((t) => {
          if (t.orgUnitId) return scopeIds.includes(t.orgUnitId);
          if (t.projectId) {
            const proj = this.projectService.getProjectById(t.projectId);
            return proj?.primaryOrgUnitId ? scopeIds.includes(proj.primaryOrgUnitId) : true;
          }
          return true;
        });
      }
    }
    const exclude = new Set(this.data.excludeTaskIds ?? []);
    return list.filter((t) => !exclude.has(t.id));
  });

  filteredTasks = computed(() => {
    const list = this.candidateTasks();
    const q = (this.searchText() ?? '').trim().toLowerCase();
    const status = this.statusFilter();
    const category = this.categoryFilter();
    return list.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q) && !t.folio.toLowerCase().includes(q)) return false;
      if (status && t.status !== status) return false;
      if (category && t.categoryId !== category) return false;
      return true;
    });
  });

  selectedCount = computed(() => this.selectedIds().size);

  /** Si alguna tarea seleccionada está en otro proyecto */
  hasTasksInOtherProject = computed(() => {
    const ids = this.selectedIds();
    const list = this.candidateTasks();
    const projectId = this.data.projectId;
    return list.some((t) => ids.has(t.id) && t.projectId && t.projectId !== projectId);
  });

  toggleTask(id: string): void {
    const set = new Set(this.selectedIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedIds.set(set);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  selectAll(): void {
    const list = this.filteredTasks();
    this.selectedIds.set(new Set(list.map((t) => t.id)));
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  add(): void {
    if (this.selectedCount() === 0) return;
    if (this.hasTasksInOtherProject() && !this.confirmMove()) return;
    this.saving.set(true);
    const ids = Array.from(this.selectedIds());
    const result = this.projectService.linkTasksToProject(this.data.projectId, ids, true);
    this.saving.set(false);
    this.dialogRef.close({ added: result.linked } as AddTasksToProjectDialogResult);
  }
}
