import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { DataService } from '../../../core/services/data.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { AutomationService } from '../../../core/services/automation.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TaskCardComponent } from '../../../shared/components/task-card/task-card.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { PriorityPillComponent } from '../../../shared/components/priority-pill/priority-pill.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { KanbanBoardComponent } from '../../../shared/components/kanban-board/kanban-board.component';
import type { TaskStatus, Priority } from '../../../shared/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonToggleModule,
    EmptyStateComponent,
    AvatarComponent,
    KanbanBoardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  readonly taskService = inject(TaskService);
  private readonly dataService = inject(DataService);
  readonly connectivity = inject(ConnectivityService);
  readonly workflow = inject(TaskWorkflowService);
  private readonly router = inject(Router);
  private readonly automationService = inject(AutomationService);
  private readonly tenantContext = inject(TenantContextService);

  searchText = signal('');

  ngOnInit(): void {
    const tid = this.tenantContext.currentTenantId();
    if (tid) this.automationService.runEngine(tid);
  }
  quickFilter = signal<'all' | 'hoy' | 'vencidas' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar'>('all');
  /** Estados seleccionados (varios se combinan con OR). Vacío = sin filtro por estado. */
  statusFilter = signal<(TaskStatus | 'completadas')[]>([]);
  /** Prioridades seleccionadas (varias se combinan con OR). Vacío = sin filtro por prioridad. */
  priorityFilter = signal<Priority[]>([]);
  viewMode = signal<'list' | 'board'>('list');
  /** Orden de la lista (como en detalle de proyecto). */
  sortOrder = signal<'default' | 'vencidas-primero' | 'fecha' | 'estado' | 'prioridad'>('default');

  kanbanColumns: { status: TaskStatus; label: string }[] = [
    { status: 'Pendiente', label: 'Pendiente' },
    { status: 'En Progreso', label: 'En Progreso' },
    { status: 'En Espera', label: 'En Espera' },
    { status: 'Vencida', label: 'Vencida' },
    { status: 'Completada', label: 'Completada' },
    { status: 'Liberada', label: 'Liberada' },
    { status: 'Rechazada', label: 'Rechazada' },
    { status: 'Cancelada', label: 'Cancelada' }
  ];

  statuses = this.dataService.getStatuses();
  priorities = this.dataService.getPriorities();
  users = this.dataService.usersForCurrentOrg;
  displayedColumns = ['folio', 'title', 'assignee', 'status', 'priority', 'dueDate', 'risk', 'counts'];

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  getEffectiveStatus(task: import('../../../shared/models').Task) {
    return this.workflow.getEffectiveStatus(task);
  }

  activeCount = computed(() =>
    this.taskService.tasks().filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status)).length
  );
  dueSoonCount = computed(() =>
    this.taskService.tasks().filter(
      (t) =>
        t.riskIndicator === 'por-vencer' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );
  /** Solo tareas con estado efectivo Vencida (pendientes y pasadas de fecha). No incluye Completada/Liberada. */
  overdueCount = computed(() =>
    this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length
  );

  pendingCount = computed(() =>
    this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Pendiente').length
  );
  inProgressCount = computed(() =>
    this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'En Progreso').length
  );
  enEsperaCount = computed(() =>
    this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'En Espera').length
  );
  completedCount = computed(() =>
    this.taskService.tasks().filter((t) =>
      ['Completada', 'Liberada'].includes(this.workflow.getEffectiveStatus(t))
    ).length
  );

  hoyCount = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskService.tasks().filter((t) => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && !['Completada', 'Liberada', 'Cancelada'].includes(t.status);
      }).length;
  });

  /** Tareas con vencimiento esta semana (para filtro rápido, distinto de las tarjetas KPI). */
  estaSemanaCount = computed(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(start);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return this.taskService.tasks().filter((t) => {
      const d = new Date(t.dueDate).getTime();
      return d >= weekStart.getTime() && d <= weekEnd.getTime();
    }).length;
  });

  vencidasCount = computed(() => this.overdueCount());
  altaCount = computed(() =>
    this.taskService.tasks().filter(
      (t) => t.priority === 'Alta' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );
  sinAsignarCount = computed(() =>
    this.taskService.tasks().filter(
      (t) =>
        (!t.assignee || t.assignee === 'Sin asignar') &&
        !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );

  allFilter = (): void => {
    this.quickFilter.set('all');
    this.statusFilter.set([]);
    this.priorityFilter.set([]);
  };

  tasksByStatus = computed(() => {
    const tasks = this.filteredTasks();
    const map = new Map<TaskStatus, import('../../../shared/models').Task[]>();
    for (const col of this.kanbanColumns) {
      map.set(col.status, []);
    }
    for (const task of tasks) {
      const status = this.workflow.getEffectiveStatus(task);
      const list = map.get(status) ?? [];
      list.push(task);
      map.set(status, list);
    }
    return map;
  });

  filteredTasks = computed(() => {
    let list = this.taskService.tasks();
    const search = this.searchText().toLowerCase();
    const qf = this.quickFilter();
    const sfList = this.statusFilter();
    const pfList = this.priorityFilter();

    if (search) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.folio.toLowerCase().includes(search) ||
          t.assignee.toLowerCase().includes(search)
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (qf === 'hoy') {
      list = list.filter((t) => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    } else if (qf === 'vencidas') {
      list = list.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida');
    } else if (qf === 'por-vencer') {
      list = list.filter(
        (t) =>
          t.riskIndicator === 'por-vencer' && !['Completada', 'Liberada', 'Cancelada'].includes(this.workflow.getEffectiveStatus(t))
      );
    } else if (qf === 'esta-semana') {
      const weekStart = new Date(today);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const startT = weekStart.getTime();
      const endT = weekEnd.getTime();
      list = list.filter((t) => {
        const d = new Date(t.dueDate).getTime();
        return d >= startT && d <= endT;
      });
    } else if (qf === 'alta') {
      list = list.filter((t) => t.priority === 'Alta');
    } else if (qf === 'sin-asignar') {
      list = list.filter((t) => !t.assignee || t.assignee === 'Sin asignar');
    }
    if (sfList.length > 0) {
      list = list.filter((t) => {
        const eff = this.workflow.getEffectiveStatus(t);
        return sfList.some((sf) =>
          sf === 'completadas' ? ['Completada', 'Liberada'].includes(eff) : eff === sf
        );
      });
    }
    if (pfList.length > 0) {
      list = list.filter((t) => pfList.includes(t.priority));
    }
    return list;
  });

  /** Tareas filtradas con el orden aplicado (como en proyecto). */
  displayedTasks = computed(() => {
    const list = this.filteredTasks();
    const order = this.sortOrder();
    if (order === 'default') return list;
    const w = this.workflow;
    return [...list].sort((a, b) => {
      if (order === 'vencidas-primero') {
        const aV = w.getEffectiveStatus(a) === 'Vencida' ? 1 : 0;
        const bV = w.getEffectiveStatus(b) === 'Vencida' ? 1 : 0;
        return bV - aV;
      }
      if (order === 'fecha') {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return da - db;
      }
      if (order === 'estado') {
        const sa = w.getEffectiveStatus(a);
        const sb = w.getEffectiveStatus(b);
        return String(sa).localeCompare(String(sb));
      }
      if (order === 'prioridad') {
        const pa = a.priority === 'Alta' ? 3 : a.priority === 'Media' ? 2 : 1;
        const pb = b.priority === 'Alta' ? 3 : b.priority === 'Media' ? 2 : 1;
        return pb - pa;
      }
      return 0;
    });
  });

  openNewTask(): void {
    this.router.navigate(['/tareas', 'nueva']);
  }

  /** Aplicar filtro rápido (sidebar); no incluye "Vencidas" (esa va en las tarjetas KPI). */
  setQuickFilter(filter: 'all' | 'hoy' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar'): void {
    this.quickFilter.set(filter);
  }

  /** Aplicar filtro por estado al hacer clic en las tarjetas KPI (Pendientes, En progreso, etc.). */
  applyStatusFilter(value: 'Pendiente' | 'En Progreso' | 'En Espera' | 'Vencida' | 'completadas'): void {
    if (value === 'Vencida') {
      this.quickFilter.set('vencidas');
      this.statusFilter.set([]);
    } else {
      this.quickFilter.set('all');
      this.statusFilter.set([value]);
    }
  }

  /** Indica si el filtro activo es el de la tarjeta de estado (para resaltar la tarjeta). */
  isStatusFilterActive(value: 'Pendiente' | 'En Progreso' | 'En Espera' | 'Vencida' | 'completadas'): boolean {
    if (value === 'Vencida') return this.quickFilter() === 'vencidas';
    const list = this.statusFilter();
    return list.length === 1 && list[0] === value;
  }

  /** Opciones de estado para checkboxes (incluye Completadas). */
  statusFilterOptions: { value: TaskStatus | 'completadas'; label: string }[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Progreso', label: 'En progreso' },
    { value: 'En Espera', label: 'En espera' },
    { value: 'Vencida', label: 'Vencida' },
    { value: 'completadas', label: 'Completadas' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Liberada', label: 'Liberada' },
    { value: 'Rechazada', label: 'Rechazada' },
    { value: 'Cancelada', label: 'Cancelada' }
  ];

  toggleStatus(value: TaskStatus | 'completadas'): void {
    const list = [...this.statusFilter()];
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1);
    else list.push(value);
    this.statusFilter.set(list);
  }

  isStatusChecked(value: TaskStatus | 'completadas'): boolean {
    return this.statusFilter().includes(value);
  }

  clearStatusFilter(): void {
    this.statusFilter.set([]);
  }

  togglePriority(value: Priority): void {
    const list = [...this.priorityFilter()];
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1);
    else list.push(value);
    this.priorityFilter.set(list);
  }

  isPriorityChecked(value: Priority): boolean {
    return this.priorityFilter().includes(value);
  }

  clearPriorityFilter(): void {
    this.priorityFilter.set([]);
  }
}
