import { Component, inject, signal, computed, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { DataService } from '../../../core/services/data.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import type { Task, TaskStatus } from '../../../shared/models';

@Component({
  selector: 'app-task-picker-inline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './task-picker-inline.component.html',
  styleUrl: './task-picker-inline.component.scss'
})
export class TaskPickerInlineComponent {
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);

  /** IDs de tareas a excluir (ej. ya asociadas) */
  excludeTaskIds = input<string[]>([]);
  /** IDs preseleccionados (modo edición) */
  initialSelectedIds = input<string[]>([]);
  /** Emite al cambiar la selección */
  selectedIdsChange = output<string[]>();
  /** Emite si puede proceder (false cuando hay tareas en otro proyecto sin confirmar) */
  canProceedChange = output<boolean>();

  searchText = signal('');
  scopeOnly = signal(true);
  statusFilter = signal<TaskStatus | ''>('');
  categoryFilter = signal<string>('');
  selectedIds = signal<Set<string>>(new Set());
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
    const exclude = new Set(this.excludeTaskIds());
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

  /** Si alguna tarea seleccionada pertenece a otro proyecto (modo creación: cualquiera con projectId) */
  hasTasksInOtherProject = computed(() => {
    const ids = this.selectedIds();
    const list = this.candidateTasks();
    return list.some((t) => ids.has(t.id) && !!t.projectId);
  });

  /** Puede proceder: no hay tareas en otro proyecto o usuario confirmó mover */
  canProceed = computed(() => !this.hasTasksInOtherProject() || this.confirmMove());

  constructor() {
    effect(() => {
      this.canProceedChange.emit(this.canProceed());
    });
  }

  toggleTask(id: string): void {
    const set = new Set(this.selectedIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedIds.set(set);
    this.emitSelection();
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  selectAll(): void {
    const list = this.filteredTasks();
    this.selectedIds.set(new Set(list.map((t) => t.id)));
    this.emitSelection();
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
    this.emitSelection();
  }

  private emitSelection(): void {
    this.selectedIdsChange.emit(Array.from(this.selectedIds()));
  }
}
