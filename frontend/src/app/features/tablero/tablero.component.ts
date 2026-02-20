import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { TaskService } from '../../core/services/task.service';
import { TaskWorkflowService } from '../../core/services/task-workflow.service';
import { DataService } from '../../core/services/data.service';
import { UiCopyService } from '../../core/services/ui-copy.service';
import { TenantSettingsService } from '../../core/services/tenant-settings.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { OrgService } from '../../core/services/org.service';
import { ProjectService } from '../../core/services/project.service';
import { FerreteroKpiService } from '../../core/services/ferretero-kpi.service';
import { AutomationService } from '../../core/services/automation.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FERRETERO_CATEGORIES } from '../../core/data/ferretero-initial';
import { Chart } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

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
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    PageHeaderComponent,
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
}
