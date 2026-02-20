import { Injectable, inject, computed, signal } from '@angular/core';
import type { Task, TaskStatus } from '../../shared/models';
import type { TaskBlockedReason, TaskRejectedReason } from '../../shared/models/reason-catalog.model';
import { TaskService } from './task.service';
import { TaskWorkflowService } from './task-workflow.service';
import { TenantSettingsService } from './tenant-settings.service';
import { FERRETERO_CATEGORIES } from '../data/ferretero-initial';

/** Categoría Mantenimiento para KPI preventivos */
const FERRETERO_CATEGORY_MANTENIMIENTO_ID = 'fcat-mantenimiento';

const ACTIVE_STATES: TaskStatus[] = ['Pendiente', 'En Progreso', 'En Espera', 'Rechazada'];
const DONE_STATES: TaskStatus[] = ['Liberada', 'Completada'];
const OVERDUE_EXEMPT: TaskStatus[] = ['Completada', 'Liberada', 'Cancelada', 'Rechazada'];

/** Interpola entre dos colores hex; t en [0,1]. */
function lerpHex(hex1: string, hex2: string, t: number): string {
  const parse = (h: string) => {
    const n = h.replace('#', '');
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Color por nivel de carga: más tareas = más rojo (advertencia/peligro), menos = más amarillo. */
function colorByBacklogDanger(count: number, minCount: number, maxCount: number): string {
  const range = maxCount - minCount || 1;
  const t = (count - minCount) / range;
  return lerpHex('#ffeb3b', '#b71c1c', t);
}

/** Normaliza texto legacy para agrupar: trim, minúsculas, sin tildes, colapsar espacios. */
function normalizeLegacyReason(s: string): string {
  const t = (s ?? '').trim();
  if (!t) return 'Sin catalogar';
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ');
}

/** Obtiene clave de agrupación y etiqueta para motivo de bloqueo. */
function blockedReasonGroup(task: Task): { key: string; label: string } {
  const r = task.blockedReason;
  if (r == null) return { key: 'sin-motivo', label: 'Sin motivo' };
  if (typeof r === 'string') {
    const n = normalizeLegacyReason(r);
    return { key: n, label: n === 'Sin catalogar' ? 'Sin catalogar' : r.trim() };
  }
  const obj = r as TaskBlockedReason;
  if (obj.code) {
    const label = obj.code.startsWith('OTHER_') ? 'Otro' : (obj.label ?? obj.code);
    return { key: obj.code, label };
  }
  const custom = (obj.customText ?? '').trim();
  if (custom) return { key: normalizeLegacyReason(custom), label: custom };
  return { key: 'sin-catalogar', label: 'Sin catalogar' };
}

/** Obtiene clave de agrupación y etiqueta para motivo de rechazo. */
function rejectedReasonGroup(task: Task): { key: string; label: string } {
  const r = task.rejectedReason;
  if (r != null && typeof r === 'object') {
    const obj = r as TaskRejectedReason;
    if (obj.code) {
      const label = obj.code.startsWith('OTHER_') ? 'Otro' : (obj.label ?? obj.code);
      return { key: obj.code, label };
    }
    const custom = (obj.customText ?? '').trim();
    if (custom) return { key: normalizeLegacyReason(custom), label: custom };
  }
  const legacy = (task.correctedReason ?? task.rejectionComment ?? '').trim();
  if (!legacy) return { key: 'sin-motivo', label: 'Sin motivo' };
  const n = normalizeLegacyReason(legacy);
  return { key: n, label: n === 'Sin catalogar' ? 'Sin catalogar' : legacy };
}

/** Colores por estado para gráficos (labels ferretero). */
const STATUS_CHART_COLORS: Record<string, string> = {
  Pendiente: '#9e9e9e',
  'En Progreso': '#1976d2',
  'En Espera': '#7b1fa2',
  Vencida: '#d32f2f',
  Completada: '#388e3c',
  Liberada: '#00897b',
  Rechazada: '#ed6c02',
  Cancelada: '#616161'
};

export interface KpiSummaryCard {
  id: string;
  value: number | string;
  valueSuffix?: string;
  label: string;
  sublabel: string;
  variant: 'danger' | 'warning' | 'info' | 'success' | 'neutral';
}

export interface BacklogByAreaItem {
  areaName: string;
  areaId: string;
  count: number;
  color: string;
}

export interface ReasonCount {
  reason: string;
  count: number;
}

export interface StatusDistributionItem {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface RiskBucketItem {
  label: string;
  count: number;
  color: string;
}

export interface TrendDayItem {
  label: string;
  completed: number;
  overdue: number;
}

export interface FerreteroChartsData {
  backlogByArea: BacklogByAreaItem[];
  statusDistribution: StatusDistributionItem[];
  riskBuckets: RiskBucketItem[];
  trendData: TrendDayItem[];
  rejectedByArea: BacklogByAreaItem[];
}

export interface FerreteroKpiState {
  /** % Fuera de plazo y conteo */
  overdueCount: number;
  totalActive: number;
  overduePct: number;
  /** Por vencer: buckets 24h, 48h, 72h (independientes) */
  dueSoon24: number;
  dueSoon48: number;
  dueSoon72: number;
  /** Bloqueadas */
  blockedCount: number;
  topBlockedReasons: ReasonCount[];
  avgBlockedTimeHours: number | null;
  /** No liberadas (Rechazadas) */
  rejectedCount: number;
  totalReviewed: number;
  rejectedPct: number;
  topRejectedReasons: ReasonCount[];
  /** Preventivos (Mantenimiento) */
  preventiveDone: number;
  preventiveOverdue: number;
  preventiveTotal: number;
  /** Checklist */
  checklistItemsTotal: number;
  checklistItemsDone: number;
  checklistCompletionPct: number;
  hasAnyChecklist: boolean;
  /** Resumen para cards */
  summaryCards: KpiSummaryCard[];
  chartsData: FerreteroChartsData;
}

@Injectable({ providedIn: 'root' })
export class FerreteroKpiService {
  private readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly tenantSettings = inject(TenantSettingsService);

  /** Tareas ya filtradas por tenant + org scope (TaskService.tasks) */
  private tasks = computed(() => this.taskService.tasks());

  /** Días del período para filtrar por dueDate: [now - periodDays, now + periodDays]. El tablero debe llamar setPeriodDays. */
  readonly periodDays = signal(7);
  setPeriodDays(days: number): void {
    this.periodDays.set(days);
  }

  private isOverdue(task: Task, now: Date): boolean {
    const due = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return due < now && !OVERDUE_EXEMPT.includes(task.status);
  }

  private dueInHours(task: Task, now: Date): number {
    const due = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return (due.getTime() - now.getTime()) / 3600000;
  }

  /** Estado efectivo (Vencida si pasó fecha y no está exenta) */
  private effectiveStatus(task: Task): TaskStatus {
    return this.workflow.getEffectiveStatus(task);
  }

  /** KPI completo: solo tiene sentido en modo ferretero; si no, devolvemos estado vacío. */
  private static readonly RISK_CARD_IDS = ['overdue', 'due24', 'due48', 'due72', 'blocked', 'rejected'] as const;

  /** Cards para la sección "Hoy / Riesgo" (sin preventivos ni checklist). */
  readonly riskSummaryCards = computed<KpiSummaryCard[]>(() =>
    this.kpiState().summaryCards.filter((c) =>
      (FerreteroKpiService.RISK_CARD_IDS as readonly string[]).includes(c.id)
    )
  );

  readonly kpiState = computed<FerreteroKpiState>(() => {
    if (!this.tenantSettings.isFerretero()) {
      return this.emptyState();
    }
    const rawTasks = this.tasks();
    const now = new Date();
    const periodDays = this.periodDays();
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - periodDays);
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);
    const tasks = rawTasks.filter((t) => {
      const due = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
      return due >= periodStart && due <= periodEnd;
    });

    const overdueCount = tasks.filter(
      (t) => this.effectiveStatus(t) === 'Vencida' || (this.isOverdue(t, now) && t.status !== 'Cancelada')
    ).length;
    const totalActive = tasks.filter(
      (t) => (ACTIVE_STATES.includes(t.status) || t.status === 'Vencida') && t.status !== 'Cancelada'
    ).length;
    const overduePct = totalActive > 0 ? (overdueCount / totalActive) * 100 : 0;

    const dueSoon24 = tasks.filter((t) => {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) return false;
      const h = this.dueInHours(t, now);
      return h >= 0 && h <= 24;
    }).length;
    const dueSoon48 = tasks.filter((t) => {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) return false;
      const h = this.dueInHours(t, now);
      return h > 24 && h <= 48;
    }).length;
    const dueSoon72 = tasks.filter((t) => {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) return false;
      const h = this.dueInHours(t, now);
      return h > 48 && h <= 72;
    }).length;

    const blockedCount = tasks.filter((t) => t.status === 'En Espera').length;
    const blockedByReason = new Map<string, number>();
    const blockedLabelByKey = new Map<string, string>();
    for (const t of tasks) {
      if (t.status !== 'En Espera') continue;
      const { key, label } = blockedReasonGroup(t);
      blockedByReason.set(key, (blockedByReason.get(key) ?? 0) + 1);
      if (!blockedLabelByKey.has(key)) blockedLabelByKey.set(key, label);
    }
    const topBlockedReasons: ReasonCount[] = Array.from(blockedByReason.entries())
      .map(([key, count]) => ({ reason: blockedLabelByKey.get(key) ?? key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    let avgBlockedTimeHours: number | null = null;
    const blockedWithTimestamp = tasks.filter((t) => t.status === 'En Espera' && t.blockedAt);
    if (blockedWithTimestamp.length > 0) {
      let totalHours = 0;
      for (const t of blockedWithTimestamp) {
        const start = new Date(t.blockedAt!);
        const end = t.unblockedAt ? new Date(t.unblockedAt) : now;
        totalHours += (end.getTime() - start.getTime()) / 3600000;
      }
      avgBlockedTimeHours = totalHours / blockedWithTimestamp.length;
    }

    const rejectedCount = tasks.filter((t) => t.status === 'Rechazada').length;
    const totalReviewed = tasks.filter((t) =>
      ['Completada', 'Rechazada', 'Liberada'].includes(t.status)
    ).length;
    const rejectedPct = totalReviewed > 0 ? (rejectedCount / totalReviewed) * 100 : 0;
    const rejectedByReason = new Map<string, number>();
    const rejectedLabelByKey = new Map<string, string>();
    for (const t of tasks) {
      if (t.status !== 'Rechazada') continue;
      const { key, label } = rejectedReasonGroup(t);
      rejectedByReason.set(key, (rejectedByReason.get(key) ?? 0) + 1);
      if (!rejectedLabelByKey.has(key)) rejectedLabelByKey.set(key, label);
    }
    const topRejectedReasons: ReasonCount[] = Array.from(rejectedByReason.entries())
      .map(([key, count]) => ({ reason: rejectedLabelByKey.get(key) ?? key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const preventiveTasks = tasks.filter(
      (t) => t.categoryId === FERRETERO_CATEGORY_MANTENIMIENTO_ID
    );
    const preventiveTotal = preventiveTasks.length;
    const preventiveDone = preventiveTasks.filter((t) => DONE_STATES.includes(t.status)).length;
    const preventiveOverdue = preventiveTasks.filter((t) => this.isOverdue(t, now)).length;

    let checklistItemsTotal = 0;
    let checklistItemsDone = 0;
    for (const t of tasks) {
      const list = t.checklist ?? [];
      checklistItemsTotal += list.length;
      checklistItemsDone += list.filter((i) => i.isDone).length;
    }
    const hasAnyChecklist = checklistItemsTotal > 0;
    const checklistCompletionPct =
      checklistItemsTotal > 0 ? (checklistItemsDone / checklistItemsTotal) * 100 : 0;

    const backlogByAreaMap = new Map<string, number>();
    const backlogTasks = tasks.filter(
      (t) =>
        (ACTIVE_STATES.includes(t.status) || t.status === 'Vencida') &&
        t.status !== 'Cancelada'
    );
    for (const t of backlogTasks) {
      const name = t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name ?? 'Sin categoría';
      backlogByAreaMap.set(name, (backlogByAreaMap.get(name) ?? 0) + 1);
    }
    const sorted = Array.from(backlogByAreaMap.entries())
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxCount = sorted[0]?.[1] ?? 0;
    const minCount = sorted[sorted.length - 1]?.[1] ?? 0;
    const backlogByArea: BacklogByAreaItem[] = sorted.map(([areaName, count]) => ({
      areaName,
      areaId: FERRETERO_CATEGORIES.find((c) => c.name === areaName)?.id ?? '',
      count,
      color: colorByBacklogDanger(count, minCount, maxCount)
    }));

    const statusByEffective = new Map<string, number>();
    for (const t of tasks) {
      const s = this.effectiveStatus(t);
      statusByEffective.set(s, (statusByEffective.get(s) ?? 0) + 1);
    }
    const statusDistribution: StatusDistributionItem[] = Array.from(statusByEffective.entries())
      .map(([status, count]) => ({
        status,
        label: status,
        count,
        color: STATUS_CHART_COLORS[status] ?? '#757575'
      }))
      .sort((a, b) => b.count - a.count);

    const dueBeyond72 = tasks.filter((t) => {
      if (['Completada', 'Liberada', 'Cancelada'].includes(t.status)) return false;
      return this.dueInHours(t, now) > 72;
    }).length;
    const riskBuckets: RiskBucketItem[] = [
      { label: 'Fuera de plazo', count: overdueCount, color: '#d32f2f' },
      { label: '0–24h', count: dueSoon24, color: '#ed6c02' },
      { label: '24–48h', count: dueSoon48, color: '#f9a825' },
      { label: '48–72h', count: dueSoon72, color: '#7b1fa2' },
      { label: '>72h', count: dueBeyond72, color: '#9e9e9e' }
    ];

    const trendDays = 7;
    const trendData: TrendDayItem[] = [];
    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const completed = tasks.filter((t) => {
        const lib = t.liberatedAt ? new Date(t.liberatedAt) : null;
        return lib && lib >= d && lib <= dayEnd;
      }).length;
      const overdue = tasks.filter((t) => {
        const due = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
        return due >= d && due <= dayEnd && due < now && !OVERDUE_EXEMPT.includes(t.status);
      }).length;
      trendData.push({
        label: d.toLocaleDateString('es', { day: '2-digit', month: 'short' }),
        completed,
        overdue
      });
    }

    const rejectedByAreaMap = new Map<string, { count: number; color: string }>();
    for (const c of FERRETERO_CATEGORIES) {
      rejectedByAreaMap.set(c.name, { count: 0, color: c.color ?? '#757575' });
    }
    for (const t of tasks) {
      if (t.status !== 'Rechazada') continue;
      const name = t.categoryName ?? FERRETERO_CATEGORIES.find((c) => c.id === t.categoryId)?.name ?? 'Sin categoría';
      const entry = rejectedByAreaMap.get(name);
      if (entry) entry.count++;
      else rejectedByAreaMap.set(name, { count: 1, color: '#757575' });
    }
    const rejectedByArea: BacklogByAreaItem[] = Array.from(rejectedByAreaMap.entries())
      .filter(([, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([areaName, v]) => ({
        areaName,
        areaId: FERRETERO_CATEGORIES.find((c) => c.name === areaName)?.id ?? '',
        count: v.count,
        color: v.color
      }));

    const summaryCards: KpiSummaryCard[] = [
      {
        id: 'overdue',
        value: overdueCount,
        valueSuffix: totalActive > 0 ? ` (${overduePct.toFixed(0)}%)` : '',
        label: 'Fuera de plazo',
        sublabel: 'del backlog activo',
        variant: overdueCount > 0 ? 'danger' : 'neutral'
      },
      {
        id: 'due24',
        value: dueSoon24,
        label: 'Por vencer 24h',
        sublabel: 'próximas 24 horas',
        variant: dueSoon24 > 0 ? 'warning' : 'neutral'
      },
      {
        id: 'due48',
        value: dueSoon48,
        label: 'Por vencer 48h',
        sublabel: '24–48 horas',
        variant: dueSoon48 > 0 ? 'warning' : 'neutral'
      },
      {
        id: 'due72',
        value: dueSoon72,
        label: 'Por vencer 72h',
        sublabel: '48–72 horas',
        variant: dueSoon72 > 0 ? 'info' : 'neutral'
      },
      {
        id: 'blocked',
        value: blockedCount,
        label: 'Bloqueadas',
        sublabel: 'En espera',
        variant: blockedCount > 0 ? 'warning' : 'neutral'
      },
      {
        id: 'rejected',
        value: rejectedCount,
        valueSuffix: totalReviewed > 0 ? ` (${rejectedPct.toFixed(0)}%)` : '',
        label: 'No liberadas',
        sublabel: 'Rechazadas / corrección',
        variant: rejectedCount > 0 ? 'danger' : 'neutral'
      },
      {
        id: 'preventive',
        value: `${preventiveDone}/${preventiveTotal}`,
        label: 'Preventivos',
        sublabel: 'Liberadas vs vencidas',
        variant: preventiveOverdue > 0 ? 'warning' : 'success'
      },
      {
        id: 'checklist',
        value: hasAnyChecklist ? `${checklistCompletionPct.toFixed(0)}%` : '—',
        label: 'Checklists',
        sublabel: hasAnyChecklist ? `${checklistItemsDone}/${checklistItemsTotal} ítems` : 'Sin checklists aún',
        variant: 'neutral'
      }
    ];

    return {
      overdueCount,
      totalActive,
      overduePct,
      dueSoon24,
      dueSoon48,
      dueSoon72,
      blockedCount,
      topBlockedReasons,
      avgBlockedTimeHours,
      rejectedCount,
      totalReviewed,
      rejectedPct,
      topRejectedReasons,
      preventiveDone,
      preventiveOverdue,
      preventiveTotal,
      checklistItemsTotal,
      checklistItemsDone,
      checklistCompletionPct,
      hasAnyChecklist,
      summaryCards,
      chartsData: {
        backlogByArea,
        statusDistribution,
        riskBuckets,
        trendData,
        rejectedByArea
      }
    };
  });

  private emptyState(): FerreteroKpiState {
    return {
      overdueCount: 0,
      totalActive: 0,
      overduePct: 0,
      dueSoon24: 0,
      dueSoon48: 0,
      dueSoon72: 0,
      blockedCount: 0,
      topBlockedReasons: [],
      avgBlockedTimeHours: null,
      rejectedCount: 0,
      totalReviewed: 0,
      rejectedPct: 0,
      topRejectedReasons: [],
      preventiveDone: 0,
      preventiveOverdue: 0,
      preventiveTotal: 0,
      checklistItemsTotal: 0,
      checklistItemsDone: 0,
      checklistCompletionPct: 0,
      hasAnyChecklist: false,
      summaryCards: [],
      chartsData: {
        backlogByArea: [],
        statusDistribution: [],
        riskBuckets: [],
        trendData: [],
        rejectedByArea: []
      }
    };
  }
}
