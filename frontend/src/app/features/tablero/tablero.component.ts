import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { TaskService } from '../../core/services/task.service';
import { TaskWorkflowService } from '../../core/services/task-workflow.service';
import { DataService } from '../../core/services/data.service';
import { UiCopyService } from '../../core/services/ui-copy.service';
import { TenantSettingsService } from '../../core/services/tenant-settings.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { CurrentUserService } from '../../core/services/current-user.service';
import { OrgService } from '../../core/services/org.service';
import { ProjectService } from '../../core/services/project.service';
import { FerreteroKpiService } from '../../core/services/ferretero-kpi.service';
import { AutomationService } from '../../core/services/automation.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { KanbanBoardComponent } from '../../shared/components/kanban-board/kanban-board.component';
import { FERRETERO_CATEGORIES } from '../../core/data/ferretero-initial';
import { Chart } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';
import type { Task, TaskStatus } from '../../shared/models';

/** Plugin para mostrar el total en el centro de gráficos tipo doughnut. */
const centerTotalPlugin = {
  id: 'centerTotalLabel',
  afterDraw(chart: { config?: { type?: string }; type?: string; ctx: CanvasRenderingContext2D; chartArea?: { left: number; right: number; top: number; bottom: number }; data?: { datasets?: { data?: number[] }[] }; options?: { plugins?: { centerTotalLabel?: { subtitle?: string } } } }) {
    const chartType = chart.type ?? (chart as { config?: { type?: string } }).config?.type;
    if (chartType !== 'doughnut' || !chart.data?.datasets?.length) return;
    const data = chart.data.datasets[0].data as number[];
    const total = data.reduce((a, b) => a + b, 0);
    const subtitle = chart.options?.plugins?.centerTotalLabel?.subtitle ?? 'tareas';
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    if (!chartArea) return;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#424242';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(String(total), centerX, centerY - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#757575';
    ctx.fillText(subtitle, centerX, centerY + 14);
    ctx.restore();
  }
};

Chart.register(centerTotalPlugin);

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
    KanbanBoardComponent,
    BaseChartDirective
  ],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss'
})
export class TableroComponent {
  private readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly dataService = inject(DataService);
  readonly uiCopy = inject(UiCopyService);
  private readonly tenantSettings = inject(TenantSettingsService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly route = inject(ActivatedRoute);
  private readonly orgService = inject(OrgService);
  private readonly projectService = inject(ProjectService);
  readonly ferreteroKpiService = inject(FerreteroKpiService);
  private readonly automationService = inject(AutomationService);

  /** Estado de KPIs ferretero (solo tiene datos cuando isFerretero). */
  ferreteroKpi = this.ferreteroKpiService.kpiState;

  ngOnInit(): void {
    const tid = this.tenantContext.currentTenantId();
    if (tid) this.automationService.runEngine(tid);
  }

  /** Gráfico de backlog por área (modo ferretero). */
  backlogByAreaChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const areas = this.ferreteroKpi().chartsData.backlogByArea;
    return {
      labels: areas.map((a) => a.areaName),
      datasets: [
        {
          label: 'Backlog activo',
          data: areas.map((a) => a.count),
          backgroundColor: areas.map((a) => a.color),
          borderRadius: 6
        }
      ]
    };
  });

  backlogByAreaChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } }
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { display: false } }
    }
  };

  /** Donut: distribución por estado. */
  statusDonutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const items = this.ferreteroKpi().chartsData.statusDistribution;
    return {
      labels: items.map((i) => i.label),
      datasets: [{ data: items.map((i) => i.count), backgroundColor: items.map((i) => i.color), borderWidth: 1 }]
    };
  });
  statusDonutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...({ centerTotalLabel: { subtitle: 'tareas' } } as Record<string, unknown>),
      legend: { position: 'right' },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} tarea(s)` } }
    }
  };

  /** Barras: riesgo por vencimiento (Fuera de plazo, 0–24h, 24–48h, 48–72h, >72h). */
  riskBucketsChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const buckets = this.ferreteroKpi().chartsData.riskBuckets;
    return {
      labels: buckets.map((b) => b.label),
      datasets: [{ label: 'Tareas', data: buckets.map((b) => b.count), backgroundColor: buckets.map((b) => b.color), borderRadius: 6 }]
    };
  });
  riskBucketsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } } },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } }, y: { grid: { display: false } } }
  };

  /** Línea: tendencia últimos 7 días (completadas/liberadas y vencidas por día). */
  trendLineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const trend = this.ferreteroKpi().chartsData.trendData;
    return {
      labels: trend.map((d) => d.label),
      datasets: [
        { label: 'Liberadas/completadas', data: trend.map((d) => d.completed), borderColor: '#00897b', backgroundColor: 'rgba(0,137,123,0.1)', fill: true, tension: 0.3 },
        { label: 'Vencidas (por día)', data: trend.map((d) => d.overdue), borderColor: '#d32f2f', backgroundColor: 'rgba(211,47,47,0.1)', fill: true, tension: 0.3 }
      ]
    };
  });
  trendLineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  /** Barras: rechazadas por categoría (top 5). */
  rejectedByAreaChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const areas = this.ferreteroKpi().chartsData.rejectedByArea;
    return {
      labels: areas.map((a) => a.areaName),
      datasets: [{ label: 'Rechazadas', data: areas.map((a) => a.count), backgroundColor: areas.map((a) => a.color), borderRadius: 6 }]
    };
  });
  rejectedByAreaChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } } },
    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } }, y: { grid: { display: false } } }
  };

  /** Doughnut: top motivos de bloqueo. */
  blockedReasonsDonutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const reasons = this.ferreteroKpi().topBlockedReasons;
    const colors = ['#7b1fa2', '#9c27b0', '#ab47bc', '#ba68c8', '#ce93d8'];
    return {
      labels: reasons.map((r) => r.reason),
      datasets: [{ data: reasons.map((r) => r.count), backgroundColor: reasons.slice(0, 5).map((_, i) => colors[i % colors.length]), borderWidth: 1 }]
    };
  });
  blockedReasonsDonutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...({ centerTotalLabel: { subtitle: 'bloqueadas' } } as Record<string, unknown>),
      legend: { position: 'right' },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} tarea(s)` } }
    }
  };

  selectedPeriod = signal('7');

  constructor() {
    effect(() => {
      if (this.tenantSettings.isFerretero()) {
        this.ferreteroKpiService.setPeriodDays(Number(this.selectedPeriod()) || 7);
      }
    });
  }

  /** Query params para navegar a lista filtrada desde una card ferretero. */
  getFiltroForCard(cardId: string): Record<string, string> {
    const map: Record<string, Record<string, string>> = {
      overdue: { status: 'Vencida' },
      due24: { due: '24h' },
      due48: { due: '48h' },
      due72: { due: '72h' },
      blocked: { status: 'En Espera' },
      rejected: { status: 'Rechazada' },
      preventive: { category: 'fcat-mantenimiento' }
    };
    return map[cardId] ?? {};
  }

  /** Tooltip corto por KPI (ferretero). */
  getTooltipForCard(cardId: string): string {
    const map: Record<string, string> = {
      overdue: 'Tareas con fecha límite pasada y no finalizadas.',
      due24: 'Tareas que vencen en las próximas 0–24 horas.',
      due48: 'Tareas que vencen entre 24 y 48 horas.',
      due72: 'Tareas que vencen entre 48 y 72 horas.',
      blocked: 'Tareas en espera (bloqueadas por proveedor, autorización, etc.).',
      rejected: 'Tareas rechazadas en revisión (no liberadas).',
      preventive: 'Tareas de mantenimiento preventivo: liberadas vs total y vencidas.'
    };
    return map[cardId] ?? '';
  }
  users = this.dataService.usersForCurrentOrg;

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  activeCount = this.taskService.activeCount;
  overdueCount = this.taskService.overdueCount;
  dueSoonCount = this.taskService.dueSoonCount;
  completedCount = this.taskService.completedCount;

  totalTasks = computed(
    () =>
      this.activeCount() + this.overdueCount() + this.dueSoonCount() + this.completedCount()
  );

  overdueAltaCount = computed(() =>
    this.taskService
      .tasks()
      .filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida' && t.priority === 'Alta').length
  );

  /** Tareas en estado En Espera (Bloqueadas en ferretero). */
  blockedCount = computed(() =>
    this.taskService.tasks().filter((t) => t.status === 'En Espera').length
  );

  isFerretero = this.tenantSettings.isFerretero;
  currentUser = this.currentUserService.currentUser;

  /** Admin funcional del tenant: OWNER o TENANT_ADMIN. */
  private readonly isTenantAdmin = computed(() => {
    const tid = this.tenantContext.currentTenantId();
    const uid = this.currentUser().id;
    if (!tid || !uid) return false;
    const role = this.tenantContext.getGlobalRole(tid, uid);
    return role === 'OWNER' || role === 'TENANT_ADMIN';
  });

  readonly isOperationalRoute = computed(() => this.route.snapshot.routeConfig?.path === 'tablero-operativo');
  canViewGlobalDashboard = computed(() => false);
  private readonly isSupervisorProfile = computed(() =>
    String(this.currentUser().role ?? '').toLowerCase().includes('supervisor')
  );

  private readonly userBranchOrgIds = computed(() => {
    const tid = this.tenantContext.currentTenantId();
    const uid = this.currentUser().id;
    if (!tid || !uid) return new Set<string>();
    const roots = this.orgService.getOrgUnitIdsForUser(tid, uid);
    const ids = new Set<string>(roots);
    for (const rootId of roots) {
      for (const childId of this.orgService.getDescendants(rootId)) ids.add(childId);
    }
    return ids;
  });

  private readonly userBranchUserIds = computed(() => {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return new Set<string>();
    const ids = new Set<string>();
    for (const orgId of this.userBranchOrgIds()) {
      for (const userId of this.orgService.getUserIdsInScope(tid, orgId)) ids.add(userId);
    }
    return ids;
  });

  /** Tablero operativo con alcance según rol/jerarquía. */
  operationalTasks = computed(() => {
    if (!this.isOperationalRoute()) return [] as Task[];
    const base = this.taskService.tasks();
    const uid = this.currentUser().id;
    if (!uid) return base;
    if (this.isTenantAdmin()) return base;

    if (!this.isSupervisorProfile()) {
      return base.filter((t) => t.assigneeId === uid || t.createdBy === uid);
    }

    const orgIds = this.userBranchOrgIds();
    const userIds = this.userBranchUserIds();
    return base.filter((t) => {
      const taskOrgId = this.getTaskOrgUnitId(t);
      if (taskOrgId && orgIds.has(taskOrgId)) return true;
      if (t.assigneeId && userIds.has(t.assigneeId)) return true;
      if (t.createdBy && userIds.has(t.createdBy)) return true;
      return false;
    });
  });

  operationalScopeHint = computed(() => {
    if (this.isTenantAdmin()) return 'Vista global del scope organizacional seleccionado.';
    if (this.isSupervisorProfile()) return 'Vista operativa de tu rama (unidad y descendencia).';
    return 'Vista operativa personal: tareas asignadas o creadas por ti.';
  });

  operationalKpiCards = computed(() => {
    const tasks = this.operationalTasks();
    const active = tasks.filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status)).length;
    const overdue = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length;
    const dueSoon = tasks.filter((t) => t.riskIndicator === 'por-vencer' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)).length;
    const blocked = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'En Espera').length;
    const inProgress = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'En Progreso').length;
    const done = tasks.filter((t) => ['Completada', 'Liberada'].includes(this.workflow.getEffectiveStatus(t))).length;
    return [
      { id: 'active', value: active, label: 'Operativas activas', sublabel: 'Pendientes en ejecución', variant: 'default' as const },
      { id: 'overdue', value: overdue, label: 'Fuera de plazo', sublabel: 'Requieren atención inmediata', variant: 'danger' as const },
      { id: 'dueSoon', value: dueSoon, label: 'Próximas 48h', sublabel: 'Riesgo por vencimiento', variant: 'warning' as const },
      { id: 'blocked', value: blocked, label: 'En espera', sublabel: 'Bloqueadas o detenidas', variant: 'warning' as const },
      { id: 'inProgress', value: inProgress, label: 'En progreso', sublabel: 'Trabajo activo en curso', variant: 'default' as const },
      { id: 'done', value: done, label: 'Cerradas', sublabel: 'Completadas y liberadas', variant: 'default' as const }
    ];
  });

  operationalStatusBreakdown = computed(() => {
    const tasks = this.operationalTasks();
    const statuses: TaskStatus[] = ['Pendiente', 'En Progreso', 'En Espera', 'Vencida', 'Completada', 'Liberada', 'Rechazada', 'Cancelada'];
    return statuses
      .map((status) => ({ status, count: tasks.filter((t) => this.workflow.getEffectiveStatus(t) === status).length }))
      .filter((x) => x.count > 0);
  });

  operationalTopAssignees = computed(() => {
    const map = new Map<string, number>();
    for (const t of this.operationalTasks()) {
      const key = t.assignee || 'Sin asignar';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  });

  operationalUpcomingTasks = computed(() =>
    this.operationalTasks()
      .filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 10)
  );

  getOperationalCardQuery(cardId: string): Record<string, string> {
    const map: Record<string, Record<string, string>> = {
      overdue: { filtro: 'vencidas' },
      dueSoon: { filtro: 'por-vencer' },
      blocked: { estado: 'En Espera' },
      inProgress: { estado: 'En Progreso' }
    };
    return map[cardId] ?? {};
  }

  private readonly operationalDaysWindow = computed(() => Number(this.selectedPeriod()) || 7);

  operationalTasksInPeriod = computed(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const start = new Date(now);
    start.setDate(start.getDate() - this.operationalDaysWindow() + 1);
    start.setHours(0, 0, 0, 0);
    return this.operationalTasks().filter((t) => {
      const due = new Date(t.dueDate).getTime();
      return due >= start.getTime() && due <= now.getTime();
    });
  });

  operationalOutcome = computed(() => {
    const list = this.operationalTasks();
    const total = list.length || 1;
    const success = list.filter((t) => ['Completada', 'Liberada'].includes(this.workflow.getEffectiveStatus(t))).length;
    const failed = list.filter((t) => this.workflow.getEffectiveStatus(t) === 'Rechazada').length;
    const overdue = list.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length;
    const blocked = list.filter((t) => this.workflow.getEffectiveStatus(t) === 'En Espera').length;
    return {
      success,
      failed,
      overdue,
      blocked,
      successRate: Math.round((success / total) * 100),
      failureRate: Math.round(((failed + overdue) / total) * 100)
    };
  });

  operationalProjectsSummary = computed(() => {
    const list = this.operationalTasks();
    const byProject = new Map<string, Task[]>();
    for (const t of list) {
      if (!t.projectId) continue;
      const arr = byProject.get(t.projectId) ?? [];
      arr.push(t);
      byProject.set(t.projectId, arr);
    }
    let healthy = 0;
    let risk = 0;
    let critical = 0;
    for (const [, tasks] of byProject) {
      const total = tasks.length || 1;
      const done = tasks.filter((t) => ['Completada', 'Liberada'].includes(this.workflow.getEffectiveStatus(t))).length;
      const overdue = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length;
      const blocked = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'En Espera').length;
      const donePct = (done / total) * 100;
      const overduePct = (overdue / total) * 100;
      if (overduePct >= 40 || blocked >= 2) critical++;
      else if (donePct >= 70 && overduePct < 20) healthy++;
      else risk++;
    }
    return {
      total: byProject.size,
      healthy,
      risk,
      critical
    };
  });

  operationalStatusDonutData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const items = this.operationalStatusBreakdown();
    const colorMap: Record<string, string> = {
      Pendiente: '#1976d2',
      'En Progreso': '#ed6c02',
      'En Espera': '#8e24aa',
      Vencida: '#d32f2f',
      Completada: '#2e7d32',
      Liberada: '#00897b',
      Rechazada: '#c62828',
      Cancelada: '#757575'
    };
    return {
      labels: items.map((x) => x.status),
      datasets: [{
        data: items.map((x) => x.count),
        backgroundColor: items.map((x) => colorMap[x.status] ?? '#90a4ae'),
        borderWidth: 1
      }]
    };
  });

  operationalStatusDonutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  operationalPriorityBarData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const tasks = this.operationalTasks();
    const priorities: Array<'Alta' | 'Media' | 'Baja'> = ['Alta', 'Media', 'Baja'];
    const counts = priorities.map((p) => tasks.filter((t) => t.priority === p).length);
    return {
      labels: priorities,
      datasets: [{
        label: 'Tareas',
        data: counts,
        backgroundColor: ['#d32f2f', '#ed6c02', '#2e7d32'],
        borderRadius: 6
      }]
    };
  });

  operationalPriorityBarOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  operationalTrendData = computed<ChartConfiguration<'line'>['data']>(() => {
    const days = this.operationalDaysWindow();
    const labels: string[] = [];
    const done: number[] = [];
    const overdue: number[] = [];
    const active: number[] = [];
    const now = new Date();
    const tasks = this.operationalTasks();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.getTime();
      labels.push(d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }));
      let cDone = 0;
      let cOver = 0;
      let cActive = 0;
      for (const t of tasks) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due.getTime() !== key) continue;
        const st = this.workflow.getEffectiveStatus(t);
        if (['Completada', 'Liberada'].includes(st)) cDone++;
        else if (st === 'Vencida') cOver++;
        else cActive++;
      }
      done.push(cDone);
      overdue.push(cOver);
      active.push(cActive);
    }
    return {
      labels,
      datasets: [
        { label: 'Exitosas', data: done, borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.1)', fill: true, tension: 0.25 },
        { label: 'Fallidas/Vencidas', data: overdue, borderColor: '#d32f2f', backgroundColor: 'rgba(211,47,47,0.1)', fill: true, tension: 0.25 },
        { label: 'Activas', data: active, borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.1)', fill: true, tension: 0.25 }
      ]
    };
  });

  operationalTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  operationalProjectHealthData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const s = this.operationalProjectsSummary();
    return {
      labels: ['Salud proyectos'],
      datasets: [
        { label: 'Saludables', data: [s.healthy], backgroundColor: '#2e7d32', borderRadius: 6 },
        { label: 'En riesgo', data: [s.risk], backgroundColor: '#ed6c02', borderRadius: 6 },
        { label: 'Críticos', data: [s.critical], backgroundColor: '#d32f2f', borderRadius: 6 }
      ]
    };
  });

  operationalProjectHealthOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  /** Tablero personal: por defecto muestra tareas asignadas y creadas por el usuario. */
  myTasks = computed(() => {
    const uid = this.currentUser().id;
    const scope = this.personalTaskScope();
    if (scope === 'assigned') {
      return this.taskService.tasks().filter((t) => t.assigneeId === uid);
    }
    if (scope === 'created') {
      return this.taskService.tasks().filter((t) => t.createdBy === uid);
    }
    return this.taskService.tasks().filter((t) => t.assigneeId === uid || t.createdBy === uid);
  });

  selectedProjectId = signal('all');
  personalTaskScope = signal<'all' | 'assigned' | 'created'>('all');
  personalQuickFilter = signal<'all' | 'urgent' | 'due48'>('all');

  myProjectOptions = computed(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const t of this.myTasks()) {
      const pid = t.projectId;
      if (!pid) continue;
      const project = this.projectService.getProjectById(pid);
      const current = map.get(pid);
      if (current) {
        current.count += 1;
      } else {
        map.set(pid, { id: pid, name: project?.name ?? pid, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  myTasksByProject = computed(() => {
    const pid = this.selectedProjectId();
    if (pid === 'all') return this.myTasks();
    return this.myTasks().filter((t) => t.projectId === pid);
  });

  myTasksFiltered = computed(() => {
    const quick = this.personalQuickFilter();
    const base = this.myTasksByProject();
    if (quick === 'all') return base;
    if (quick === 'urgent') {
      return base.filter((t) => {
        const effective = this.workflow.getEffectiveStatus(t);
        if (effective === 'Vencida') return true;
        return t.priority === 'Alta' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status);
      });
    }
    const now = Date.now();
    const maxMs = 48 * 60 * 60 * 1000;
    return base
      .filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status))
      .filter((t) => {
        const dueMs = new Date(t.dueDate).getTime();
        const delta = dueMs - now;
        return delta >= 0 && delta <= maxMs;
      });
  });

  setPersonalQuickFilter(filter: 'urgent' | 'due48'): void {
    this.personalQuickFilter.update((current) => current === filter ? 'all' : filter);
  }

  personalTaskScopeLabel = computed(() => {
    const scope = this.personalTaskScope();
    if (scope === 'assigned') return 'Solo asignadas a mí';
    if (scope === 'created') return 'Solo creadas por mí';
    return 'Asignadas a mí + creadas por mí';
  });

  boardTitle = computed(() => {
    const pid = this.selectedProjectId();
    const quick = this.personalQuickFilter();
    const projectLabel = pid === 'all'
      ? 'tareas'
      : (this.myProjectOptions().find((p) => p.id === pid)?.name ?? 'tareas');
    if (quick === 'urgent') return pid === 'all' ? 'Tareas urgentes' : `Urgentes: ${projectLabel}`;
    if (quick === 'due48') return pid === 'all' ? 'Tareas próximas 48h' : `Próximas 48h: ${projectLabel}`;
    if (pid === 'all') return 'Todas mis tareas';
    const option = this.myProjectOptions().find((p) => p.id === pid);
    return option ? option.name : 'Todas mis tareas';
  });

  boardSubtitle = computed(() => {
    const quick = this.personalQuickFilter();
    const scopeInfo = this.personalTaskScopeLabel();
    if (quick === 'urgent') return `Filtro activo: vencidas o prioridad alta · ${scopeInfo}`;
    if (quick === 'due48') return `Filtro activo: tareas con vencimiento en 48 horas · ${scopeInfo}`;
    return this.selectedProjectId() === 'all'
      ? `Vista tipo tablero por estado · ${scopeInfo}`
      : `Vista tipo tablero del proyecto seleccionado · ${scopeInfo}`;
  });

  /** Tareas urgentes: vencidas o alta prioridad activa. */
  myUrgentTasks = computed(() =>
    this.myTasksByProject()
      .filter((t) => {
        const effective = this.workflow.getEffectiveStatus(t);
        if (effective === 'Vencida') return true;
        return t.priority === 'Alta' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status);
      })
      .slice(0, 6)
  );

  /** Próximas por vencer en 48h, ordenadas por fecha. */
  myDueSoonTasks = computed(() => {
    const now = Date.now();
    const maxMs = 48 * 60 * 60 * 1000;
    return this.myTasksByProject()
      .filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status))
      .filter((t) => {
        const dueMs = new Date(t.dueDate).getTime();
        const delta = dueMs - now;
        return delta >= 0 && delta <= maxMs;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 6);
  });

  /** Modo ferretero: tareas agrupadas por categoría operativa (nombre + color). */
  loadByCategoryFerretero = computed(() => {
    const tasks = this.taskService.tasks();
    const tid = this.tenantContext.currentTenantId();
    const map = new Map<string, { count: number; color: string }>();
    for (const c of FERRETERO_CATEGORIES) {
      map.set(c.name, { count: 0, color: c.color ?? '#757575' });
    }
    for (const t of tasks) {
      const name = t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name ?? 'Sin categoría';
      const entry = map.get(name);
      if (entry) entry.count++;
      else map.set(name, { count: 1, color: '#757575' });
    }
    return Array.from(map.entries())
      .filter(([, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([label, v]) => ({ label, count: v.count, color: v.color }));
  });

  /** Modo ferretero: tareas agrupadas por unidad organizativa (tienda/región). */
  loadByOrgUnitFerretero = computed(() => {
    const tasks = this.taskService.tasks();
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    const map = new Map<string, number>();
    for (const t of tasks) {
      const name = t.orgUnitId
        ? (this.orgService.getOrgUnitById(t.orgUnitId)?.name ?? t.orgUnitId)
        : 'Sin unidad';
      map.set(name, (map.get(name) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  });

  /** Modo ferretero: completadas vs pendientes por categoría (para stacked bar). */
  statusByCategoryFerretero = computed(() => {
    const tasks = this.taskService.tasks();
    const categories = [...new Set(tasks.map((t) => t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name ?? 'Sin categoría').filter(Boolean))];
    const completadas = categories.map((cat) => tasks.filter((t) => (t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name) === cat && ['Completada', 'Liberada'].includes(t.status)).length);
    const pendientes = categories.map((cat) => tasks.filter((t) => (t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name) === cat && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)).length);
    return { categories, completadas, pendientes };
  });

  /** Modo ferretero: tareas liberadas/validadas (KPI). */
  liberatedCount = computed(() =>
    this.taskService.tasks().filter((t) => t.status === 'Liberada').length
  );

  /** Modo ferretero: proyectos activos con plantilla. */
  activeProjectsFerreteroCount = computed(() =>
    this.projectService.projects().filter((p) => p.templateId && (p.status === 'Activo' || p.status === 'En curso')).length
  );

  loadByAssignee = computed(() => {
    const tasks = this.taskService.tasks();
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) continue;
      const key = t.assignee || 'Sin asignar';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  });

  loadByPriority = computed(() => {
    const tasks = this.taskService.tasks();
    const map = new Map<string, number>();
    for (const t of tasks) {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) continue;
      map.set(t.priority, (map.get(t.priority) ?? 0) + 1);
    }
    const arr = Array.from(map.entries());
    const order = ['Alta', 'Media', 'Baja'];
    arr.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    return arr;
  });

  trendByDay = computed(() => {
    const days = 7;
    const now = new Date();
    const labels: string[] = [];
    const completadas: number[] = [];
    const pendientes: number[] = [];
    const vencidas: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      labels.push(d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }));

      const tasks = this.taskService.tasks();
      let comp = 0;
      let pend = 0;
      let venc = 0;
      for (const t of tasks) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due.getTime() !== d.getTime()) continue;
        if (['Completada', 'Liberada'].includes(t.status)) comp++;
        else if (this.workflow.getEffectiveStatus(t) === 'Vencida') venc++;
        else pend++;
      }
      completadas.push(comp);
      pendientes.push(pend);
      vencidas.push(venc);
    }
    return { labels, completadas, pendientes, vencidas };
  });

  doughnutChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: ['Pendientes', 'Por vencer', this.uiCopy.statusLabel('Vencida'), 'Completadas'],
    datasets: [
      {
        data: [
          this.activeCount(),
          this.dueSoonCount(),
          this.overdueCount(),
          this.completedCount()
        ],
        backgroundColor: ['#1976d2', '#ed6c02', '#d32f2f', '#2e7d32'],
        hoverBackgroundColor: ['#42a5f5', '#ff9800', '#ef5350', '#66bb6a'],
        borderWidth: 0
      }
    ]
  }));

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true }
      }
    }
  };

  barAssigneeChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByAssignee();
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          label: 'Tareas asignadas',
          data: load.map((x) => x[1]),
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
          borderRadius: 6
        }
      ]
    };
  });

  barAssigneeChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.x} tarea(s)`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      y: {
        grid: { display: false }
      }
    }
  };

  barPriorityChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByPriority();
    const colors = ['#d32f2f', '#ed6c02', '#2e7d32'];
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          label: 'Tareas',
          data: load.map((x) => x[1]),
          backgroundColor: load.map((_, i) => colors[i] ?? '#757575'),
          borderRadius: 6
        }
      ]
    };
  });

  barPriorityChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} tarea(s)`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  lineTrendChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const t = this.trendByDay();
    return {
      labels: t.labels,
      datasets: [
        {
          label: 'Completadas',
          data: t.completadas,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Pendientes',
          data: t.pendientes,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Vencidas',
          data: t.vencidas,
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  });

  lineTrendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 12, usePointStyle: true }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    }
  };

  radarChartData = computed<ChartConfiguration<'radar'>['data']>(() => {
    const load = this.loadByAssignee();
    const max = Math.max(1, ...load.map((x) => x[1]));
    return {
      labels: load.map((x) => x[0].split(' ')[0]),
      datasets: [
        {
          label: 'Carga de trabajo',
          data: load.map((x) => x[1]),
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderColor: '#1976d2',
          pointBackgroundColor: '#1976d2',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#1976d2'
        }
      ]
    };
  });

  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.r} tarea(s)`
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  polarAreaChartData = computed<ChartConfiguration<'polarArea'>['data']>(() => {
    const load = this.loadByPriority();
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          data: load.map((x) => x[1]),
          backgroundColor: [
            'rgba(211, 47, 47, 0.7)',
            'rgba(237, 108, 2, 0.7)',
            'rgba(46, 125, 50, 0.7)'
          ],
          hoverBackgroundColor: ['#d32f2f', '#ed6c02', '#2e7d32']
        }
      ]
    };
  });

  polarAreaChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 12, usePointStyle: true }
      }
    },
    scales: {
      r: {
        display: false
      }
    }
  };

  // --- Gráficos modo ferretero ---

  barCategoryFerreteroChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByCategoryFerretero();
    return {
      labels: load.map((x) => x.label),
      datasets: [
        {
          label: 'Tareas',
          data: load.map((x) => x.count),
          backgroundColor: load.map((x) => x.color),
          borderRadius: 6
        }
      ]
    };
  });

  barCategoryFerreteroChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } }
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { display: false } }
    }
  };

  barOrgUnitFerreteroChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const load = this.loadByOrgUnitFerretero();
    return {
      labels: load.map((x) => x[0]),
      datasets: [
        {
          label: 'Tareas por unidad',
          data: load.map((x) => x[1]),
          backgroundColor: 'rgba(123, 31, 162, 0.8)',
          borderRadius: 6
        }
      ]
    };
  });

  barOrgUnitFerreteroChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} tarea(s)` } }
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { grid: { display: false } }
    }
  };

  doughnutCategoryFerreteroChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const load = this.loadByCategoryFerretero();
    return {
      labels: load.map((x) => x.label),
      datasets: [
        {
          data: load.map((x) => x.count),
          backgroundColor: load.map((x) => x.color),
          hoverBackgroundColor: load.map((x) => x.color),
          borderWidth: 0
        }
      ]
    };
  });

  doughnutCategoryFerreteroChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    cutout: '60%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } }
    }
  };

  barStackedStatusByCategoryFerreteroChartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const s = this.statusByCategoryFerretero();
    return {
      labels: s.categories,
      datasets: [
        {
          label: 'Completadas / Liberadas',
          data: s.completadas,
          backgroundColor: '#2e7d32',
          borderRadius: 4
        },
        {
          label: 'Pendientes / En curso',
          data: s.pendientes,
          backgroundColor: '#1976d2',
          borderRadius: 4
        }
      ]
    };
  });

  barStackedStatusByCategoryFerreteroChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.9,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, boxWidth: 14 } }
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  private getTaskOrgUnitId(task: Task): string | undefined {
    if (task.orgUnitId) return task.orgUnitId;
    if (!task.projectId) return undefined;
    return this.projectService.getProjectById(task.projectId)?.primaryOrgUnitId;
  }
}
