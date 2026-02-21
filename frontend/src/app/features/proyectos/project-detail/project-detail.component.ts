import { Component, inject, input, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { ProjectService } from '../../../core/services/project.service';
import type { ChartConfiguration } from 'chart.js';
import { AddTasksToProjectDialogComponent } from '../add-tasks-to-project-dialog/add-tasks-to-project-dialog.component';
import { DataService } from '../../../core/services/data.service';
import { TaskService } from '../../../core/services/task.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';
import { UiCopyService } from '../../../core/services/ui-copy.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import type { Project, Task, TaskStatus } from '../../../shared/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    DateFormatPipe,
    RelativeTimePipe,
    AvatarComponent,
    BaseChartDirective
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly taskService = inject(TaskService);
  readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  readonly connectivity = inject(ConnectivityService);
  private readonly tenantSettings = inject(TenantSettingsService);
  readonly uiCopy = inject(UiCopyService);

  /** Query param ?focus=vencidas: acceso directo demo para resaltar vencidas y abrir tab Tareas. */
  private readonly queryParams = toSignal(this.route.queryParams, { initialValue: {} as Record<string, string> });
  readonly focusVencidasFromUrl = computed(() => this.queryParams()?.['focus'] === 'vencidas');
  readonly focusVencidasActive = computed(
    () => this.focusVencidasFromUrl() && this.kpis().tasksOverdue > 0
  );

  selectedTabIndex = signal(0);
  /** Filtro por estado efectivo: 'todas', 'completadas' (Completada+Liberada) o un estado. */
  tasksFilter = signal<'todas' | TaskStatus | 'completadas'>('todas');
  /** Orden de la lista de tareas (siempre disponible en la tab Tareas). */
  tasksSortOrder = signal<'default' | 'vencidas-primero' | 'fecha' | 'estado'>('default');

  /** Opciones de filtro por estado (para el select). */
  readonly taskFilterOptions: { value: 'todas' | TaskStatus | 'completadas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Progreso', label: 'En progreso' },
    { value: 'En Espera', label: 'En espera' },
    { value: 'completadas', label: 'Completadas' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Liberada', label: 'Liberada' },
    { value: 'Rechazada', label: 'Rechazada' },
    { value: 'Vencida', label: 'Vencida' },
    { value: 'Cancelada', label: 'Cancelada' }
  ];

  projectId = input.required<string>({ alias: 'id' });
  project = computed(() => this.projectService.getProjectById(this.projectId()));
  projectsInScope = this.dataService.projectsForCurrentOrg;
  isProjectInScope = computed(() => {
    const p = this.project();
    if (!p) return false;
    return this.projectsInScope().some((pr) => pr.id === p.id);
  });
  kpis = computed(() => this.projectService.computeKPIs(this.projectId()));
  projectTasks = computed(() => this.projectService.getProjectTasks(this.projectId()));

  /** Doughnut: distribución por estado (solo tareas del proyecto). */
  projectMetricsDoughnutData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const k = this.kpis();
    const concluidas = k.completedTasks + k.liberadasTasks;
    return {
      labels: ['Concluidas (Completada + Liberada)', 'Vencidas', 'En progreso', 'En espera', 'Pendientes'],
      datasets: [
        {
          data: [concluidas, k.tasksOverdue, k.tasksInProgress, k.tasksEnEspera, k.tasksPending],
          backgroundColor: ['#2e7d32', '#d32f2f', '#1976d2', '#7b1fa2', '#9e9e9e'],
          hoverBackgroundColor: ['#66bb6a', '#ef5350', '#42a5f5', '#9c27b0', '#bdbdbd'],
          borderWidth: 1
        }
      ]
    };
  });

  projectMetricsDoughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} tarea(s)` } }
    }
  };

  /** Barra: Concluidas vs Vencidas (solo proyecto). */
  projectConcluidasVencidasBarData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const k = this.kpis();
    const concluidas = k.completedTasks + k.liberadasTasks;
    return {
      labels: ['Concluidas', 'Vencidas'],
      datasets: [
        {
          label: 'Tareas',
          data: [concluidas, k.tasksOverdue],
          backgroundColor: ['#2e7d32', '#d32f2f'],
          borderRadius: 8
        }
      ]
    };
  });

  projectConcluidasVencidasBarOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } }
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.06)' } },
      y: { grid: { display: false } }
    }
  };

  /** Tareas a mostrar: aplica filtro y orden elegidos (siempre en la tab Tareas). */
  projectTasksDisplay = computed(() => {
    const tasks = this.projectTasks();
    const w = this.workflow;
    let list = tasks;
    const filter = this.tasksFilter();
    if (filter === 'completadas') {
      list = list.filter((t) => ['Completada', 'Liberada'].includes(w.getEffectiveStatus(t)));
    } else if (filter !== 'todas') {
      list = list.filter((t) => w.getEffectiveStatus(t) === filter);
    }
    const order = this.tasksSortOrder();
    if (order === 'default') return list;
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
      return 0;
    });
  });

  constructor() {
    const hasSwitched = signal(false);
    effect(
      () => {
        if (this.focusVencidasActive() && !hasSwitched()) {
          hasSwitched.set(true);
          // Mostrar primero Overview ~1 s y luego cambiar a Tareas para que se note el acceso desde la URL
          setTimeout(() => {
            this.selectedTabIndex.set(1);
            this.tasksFilter.set('Vencida');
            this.tasksSortOrder.set('vencidas-primero');
          }, 1000);
        }
      },
      { allowSignalWrites: true }
    );
  }

  isFerretero = this.tenantSettings.isFerretero;
  templateTasks = computed(() => {
    const p = this.project();
    if (!p?.templateId) return [];
    return this.projectTasks().filter((t) => t.generatedFromProjectTemplateId === p.templateId);
  });
  templateTasksCompletadas = computed(() =>
    this.templateTasks().filter((t) => ['Completada', 'Liberada'].includes(t.status)).length
  );
  /** Solo tareas con estado efectivo Vencida (pendientes y pasadas de fecha). */
  templateTasksVencidas = computed(() =>
    this.templateTasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length
  );
  templateTasksBloqueadas = computed(() =>
    this.templateTasks().filter((t) => t.status === 'En Espera').length
  );

  users = this.dataService.usersForCurrentOrg;

  /** Por cada miembro del proyecto: nombre, puesto, total tareas, liberadas y % efectividad. */
  teamMemberStats = computed(() => {
    const p = this.project();
    const tasks = this.projectTasks();
    this.users();
    if (!p?.members?.length) return [];
    return p.members.map((m) => {
      const user = this.getUserById(m.userId);
      const memberTasks = tasks.filter((t) => t.assigneeId === m.userId);
      const total = memberTasks.length;
      const liberadas = memberTasks.filter((t) => t.status === 'Liberada').length;
      const effectiveness = total > 0 ? Math.round((liberadas / total) * 100) : 0;
      let level: 'high' | 'medium' | 'low' = 'low';
      if (total === 0) level = 'medium';
      else if (effectiveness >= 80) level = 'high';
      else if (effectiveness >= 50) level = 'medium';
      return {
        userId: m.userId,
        name: user?.name ?? m.userId,
        position: user?.position ?? m.role ?? '',
        total,
        liberadas,
        effectiveness,
        effectivenessLevel: level
      };
    });
  });

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  /** Ir al tab Tareas y opcionalmente aplicar filtro por estado. */
  goToTasksWithFilter(status?: 'todas' | TaskStatus | 'completadas'): void {
    this.selectedTabIndex.set(1);
    if (status !== undefined) this.tasksFilter.set(status);
  }

  getMilestoneLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      'in-progress': 'En progreso',
      completed: 'Completado'
    };
    return labels[status] ?? status;
  }

  getActivityLabel(type: string): string {
    const labels: Record<string, string> = {
      CREATED: 'Creó el proyecto',
      TASK_ADDED: 'Añadió una tarea',
      TASK_REMOVED: 'Quitó una tarea del proyecto',
      TASK_COMPLETED: 'Completó una tarea',
      UPDATED: 'Actualizó el proyecto',
      FILE_UPLOADED: 'Subió un archivo'
    };
    return labels[type] ?? type;
  }

  openAddTask(): void {
    if (!this.connectivity.isOnline()) return;
    this.router.navigate(['/tareas/nueva'], {
      queryParams: { projectId: this.projectId() }
    });
  }

  openAddExistingTasks(): void {
    if (!this.connectivity.isOnline()) return;
    const p = this.project();
    if (!p) return;
    const ref = this.dialog.open(AddTasksToProjectDialogComponent, {
      data: {
        projectId: p.id,
        projectName: p.name,
        excludeTaskIds: this.projectTasks().map((t) => t.id)
      },
      width: '90vw',
      maxWidth: '640px'
    });
    ref.afterClosed().subscribe((result: { added: number } | null) => {
      if (result?.added != null && result.added > 0) {
        this.snackBar.open(`${result.added} tarea(s) agregada(s)`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  unlinkTask(task: { id: string; title: string }): void {
    if (!confirm(`¿Quitar la tarea "${task.title}" del proyecto? La tarea no se eliminará.`)) return;
    this.projectService.unlinkTaskFromProject(this.projectId(), task.id);
    this.snackBar.open('Tarea desvinculada del proyecto', 'Cerrar', { duration: 2000 });
  }

  onMenuAction(action: string): void {
    this.snackBar.open(`Acción "${action}" (placeholder)`, 'Cerrar', { duration: 1500 });
  }

  goToTask(taskId: string): void {
    this.router.navigate(['/tareas', taskId]);
  }

  getTaskLinkLabels(taskId: string): string[] {
    const links = this.taskService.getLinksForTask(taskId);
    const labels: string[] = [];
    for (const l of links.blocking) {
      const other = this.projectTasks().find((t) => t.id === l.toTaskId);
      if (other) labels.push('bloquea a: ' + other.title);
    }
    for (const l of links.blockedBy) {
      const other = this.projectTasks().find((t) => t.id === l.fromTaskId);
      if (other) labels.push('bloqueada por: ' + other.title);
    }
    return labels;
  }

  goBack(): void {
    this.router.navigate(['/proyectos']);
  }

  generateTemplateTasks(): void {
    if (!this.connectivity.isOnline()) return;
    const p = this.project();
    if (!p?.templateId) return;
    const count = this.projectService.generateTasksFromProjectTemplate(p.id);
    this.snackBar.open(count > 0 ? `Se crearon ${count} tareas del template` : 'No se pudieron generar tareas', 'Cerrar', {
      duration: 3000
    });
  }

  showGenerateTemplateButton(): boolean {
    const p = this.project();
    if (!p?.templateId || !this.isFerretero()) return false;
    return p.templateTasksGenerated !== true;
  }
}
