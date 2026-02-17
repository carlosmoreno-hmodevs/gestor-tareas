import { Component, inject, computed, signal } from '@angular/core';
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
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  private readonly dataService = inject(DataService);
  readonly connectivity = inject(ConnectivityService);
  readonly workflow = inject(TaskWorkflowService);
  private readonly router = inject(Router);

  searchText = signal('');
  quickFilter = signal<'all' | 'hoy' | 'vencidas' | 'alta' | 'sin-asignar'>('all');
  statusFilter = signal<TaskStatus | ''>('');
  priorityFilter = signal<Priority | ''>('');
  viewMode = signal<'list' | 'board'>('list');

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
  users = this.dataService.getUsers();
  displayedColumns = ['folio', 'title', 'assignee', 'status', 'priority', 'dueDate', 'risk', 'counts'];

  getUserById(id: string) {
    return this.users.find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users.find((u) => u.name === name);
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
  overdueCount = computed(() =>
    this.taskService.tasks().filter(
      (t) => this.workflow.getEffectiveStatus(t) === 'Vencida' || t.riskIndicator === 'vencida'
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
    const sf = this.statusFilter();
    const pf = this.priorityFilter();

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
      list = list.filter((t) => t.riskIndicator === 'vencida');
    } else if (qf === 'alta') {
      list = list.filter((t) => t.priority === 'Alta');
    } else if (qf === 'sin-asignar') {
      list = list.filter((t) => !t.assignee || t.assignee === 'Sin asignar');
    }
    if (sf) list = list.filter((t) => this.workflow.getEffectiveStatus(t) === sf);
    if (pf) list = list.filter((t) => t.priority === pf);
    return list;
  });

  openNewTask(): void {
    this.router.navigate(['/tareas', 'nueva']);
  }
}
