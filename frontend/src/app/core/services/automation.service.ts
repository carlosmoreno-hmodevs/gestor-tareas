import { Injectable, inject } from '@angular/core';
import type { Automation, AutomationFrequency, DayOfWeek } from '../../shared/models/automation.model';
import type { Task } from '../../shared/models';
import { TenantContextService } from './tenant-context.service';
import { TaskService } from './task.service';
import { AdminService } from './admin.service';
import { ProjectService } from './project.service';

const STORAGE_PREFIX = 'gestor-tareas:snapshot:automations.';
const SYSTEM_USER_ID = 'system';
const SYSTEM_USER_NAME = 'Sistema';

/** Parsea "HH:mm" a { hours, minutes } */
function parseTimeOfDay(timeOfDay: string): { hours: number; minutes: number } {
  const [h, m] = (timeOfDay || '09:00').split(':').map(Number);
  return { hours: isNaN(h) ? 9 : h, minutes: isNaN(m) ? 0 : m };
}

/** Fija la hora en una fecha (local) */
function setTimeOfDay(d: Date, timeOfDay: string): Date {
  const { hours, minutes } = parseTimeOfDay(timeOfDay);
  const out = new Date(d);
  out.setHours(hours, minutes, 0, 0);
  return out;
}

/** Calcula la próxima ejecución desde "from" para una automatización (sin modificar nextRunAt en el objeto). */
export function computeNextRunAt(
  automation: Pick<Automation, 'frequency' | 'interval' | 'timeOfDay' | 'weeklyDays' | 'monthlyDay' | 'monthEndRule' | 'startDate' | 'endDate'>,
  from: Date
): Date {
  const fromTime = setTimeOfDay(from, automation.timeOfDay);
  const start = new Date(automation.startDate);
  start.setHours(0, 0, 0, 0);
  const end = automation.endDate ? new Date(automation.endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);

  if (automation.frequency === 'daily') {
    const { hours, minutes } = parseTimeOfDay(automation.timeOfDay);
    let next = new Date(from);
    next.setHours(hours, minutes, 0, 0);
    if (next <= from) next.setDate(next.getDate() + automation.interval);
    while (next < start) next.setDate(next.getDate() + automation.interval);
    if (end && next > end) return end;
    return next;
  }

  if (automation.frequency === 'weekly') {
    const days = (automation.weeklyDays ?? [1]) as number[];
    const { hours, minutes } = parseTimeOfDay(automation.timeOfDay);
    let next = new Date(from);
    next.setHours(hours, minutes, 0, 0);
    if (next <= from) next.setDate(next.getDate() + 1);
    while (!days.includes(next.getDay())) next.setDate(next.getDate() + 1);
    if (next < start) {
      next = new Date(start);
      next.setHours(hours, minutes, 0, 0);
      if (next <= from) next.setDate(next.getDate() + 1);
      while (!days.includes(next.getDay())) next.setDate(next.getDate() + 1);
    }
    if (automation.interval > 1) next.setDate(next.getDate() + 7 * (automation.interval - 1));
    if (end && next > end) return end;
    return next;
  }

  if (automation.frequency === 'monthly') {
    const day = Math.min(automation.monthlyDay ?? 1, 28);
    const { hours, minutes } = parseTimeOfDay(automation.timeOfDay);
    let next = new Date(from.getFullYear(), from.getMonth(), day, hours, minutes, 0, 0);
    if (next <= from || next < start) {
      next = new Date(from.getFullYear(), from.getMonth() + 1, 1, hours, minutes, 0, 0);
      const lastDay = new Date(next.getFullYear(), next.getMonth(), 0).getDate();
      const useDay = automation.monthEndRule === 'last_day'
        ? lastDay
        : Math.min(day, lastDay);
      next.setDate(useDay);
    }
    if (day > 28 && automation.monthEndRule === 'last_day') {
      const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(lastDay);
    }
    let step = 0;
    while (next < start && step < 24) {
      next.setMonth(next.getMonth() + automation.interval);
      step++;
    }
    if (end && next > end) return end;
    return next;
  }

  return setTimeOfDay(new Date(from.getTime() + 24 * 60 * 60 * 1000), automation.timeOfDay);
}

@Injectable({ providedIn: 'root' })
export class AutomationService {
  private readonly tenantContext = inject(TenantContextService);
  private readonly taskService = inject(TaskService);
  private readonly adminService = inject(AdminService);
  private readonly projectService = inject(ProjectService);

  private storageKey(tenantId: string): string {
    return STORAGE_PREFIX + tenantId;
  }

  private readAutomationsFromStorage(tenantId: string): Automation[] {
    const key = this.storageKey(tenantId);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Automation[];
      return Array.isArray(parsed) ? parsed.filter((a) => !a.deletedAt) : [];
    } catch {
      return [];
    }
  }

  getAutomations(tenantId: string): Automation[] {
    let list = this.readAutomationsFromStorage(tenantId);
    if (list.length === 0) {
      this.seedDemoAutomations(tenantId);
      list = this.readAutomationsFromStorage(tenantId);
    }
    return list;
  }

  private seedDemoAutomations(tenantId: string): void {
    if (this.readAutomationsFromStorage(tenantId).length > 0) return;
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const nextRunPast = new Date(now.getTime() - 3600000).toISOString();
    const demo: Automation[] = [
      {
        id: `auto-demo-1-${tenantId}`,
        tenantId,
        name: 'Revisión diaria de operaciones',
        active: true,
        type: 'task_template',
        taskBlueprint: {
          title: 'Revisión diaria de operaciones',
          description: 'Tarea creada automáticamente por la automatización "Revisión diaria".',
          dueInDays: 1
        },
        frequency: 'daily',
        interval: 1,
        timeOfDay: '09:00',
        startDate: today,
        nextRunAt: nextRunPast,
        runCount: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: `auto-demo-2-${tenantId}`,
        tenantId,
        name: 'Revisión semanal',
        active: true,
        type: 'task_template',
        taskBlueprint: {
          title: 'Revisión semanal',
          description: 'Tarea generada por automatización semanal.',
          dueInDays: 7
        },
        frequency: 'weekly',
        interval: 1,
        timeOfDay: '10:00',
        weeklyDays: [1],
        startDate: today,
        nextRunAt: nextRunPast,
        runCount: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];
    this.persist(tenantId, demo);
  }

  getById(tenantId: string, id: string): Automation | undefined {
    return this.getAutomations(tenantId).find((a) => a.id === id);
  }

  private persist(tenantId: string, list: Automation[]): void {
    const key = this.storageKey(tenantId);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn('AutomationService: could not persist', e);
    }
  }

  create(tenantId: string, automation: Omit<Automation, 'id' | 'tenantId' | 'runCount' | 'lastRunAt' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Automation {
    const list = this.getAutomations(tenantId);
    const id = `auto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const nextRunAt = automation.nextRunAt || this.computeInitialNextRunAt(automation);
    const created: Automation = {
      ...automation,
      id,
      tenantId,
      runCount: 0,
      nextRunAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(created);
    this.persist(tenantId, list);
    return created;
  }

  update(tenantId: string, id: string, patch: Partial<Automation>): Automation | null {
    const list = this.getAutomations(tenantId);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated: Automation = {
      ...list[idx],
      ...patch,
      id: list[idx].id,
      tenantId,
      updatedAt: new Date().toISOString()
    };
    if (patch.frequency !== undefined || patch.interval !== undefined || patch.timeOfDay !== undefined ||
        patch.weeklyDays !== undefined || patch.monthlyDay !== undefined || patch.monthEndRule !== undefined ||
        patch.startDate !== undefined || patch.endDate !== undefined) {
      updated.nextRunAt = computeNextRunAt(updated, new Date()).toISOString();
    }
    list[idx] = updated;
    this.persist(tenantId, list);
    return updated;
  }

  setActive(tenantId: string, id: string, active: boolean): Automation | null {
    return this.update(tenantId, id, { active });
  }

  remove(tenantId: string, id: string): void {
    const list = this.getAutomations(tenantId);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return;
    const soft = { ...list[idx], deletedAt: new Date().toISOString() };
    list[idx] = soft;
    this.persist(tenantId, list);
  }

  /** Calcula la primera nextRunAt desde startDate. */
  computeInitialNextRunAt(automation: Pick<Automation, 'startDate' | 'frequency' | 'interval' | 'timeOfDay' | 'weeklyDays' | 'monthlyDay' | 'monthEndRule' | 'endDate'>): string {
    const start = new Date(automation.startDate);
    start.setHours(0, 0, 0, 0);
    const from = setTimeOfDay(start, automation.timeOfDay);
    if (from < new Date()) return computeNextRunAt(automation as Automation, new Date()).toISOString();
    return computeNextRunAt(automation as Automation, from).toISOString();
  }

  /**
   * Ejecuta ahora (simulación): crea la tarea sin avanzar nextRunAt de forma permanente
   * para que la próxima corrida normal no se salte. Opcionalmente podemos avanzar runCount + nextRunAt
   * para pruebas. Aquí "Ejecutar ahora" = crear tarea y actualizar como si hubiera corrido (nextRunAt, lastRunAt, runCount).
   */
  runNow(tenantId: string, id: string): { task: Task } | { error: string } {
    const auto = this.getById(tenantId, id);
    if (!auto) return { error: 'Automatización no encontrada' };
    const now = new Date();
    if (auto.endDate && now > new Date(auto.endDate)) return { error: 'Fuera del rango de fechas' };
    const task = this.createTaskFromAutomation(tenantId, auto);
    if (!task) return { error: 'No se pudo crear la tarea' };
    const list = this.getAutomations(tenantId);
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      const next = computeNextRunAt(auto, now);
      list[idx] = {
        ...list[idx],
        lastRunAt: now.toISOString(),
        nextRunAt: next.toISOString(),
        runCount: list[idx].runCount + 1,
        updatedAt: now.toISOString()
      };
      this.persist(tenantId, list);
    }
    return { task };
  }

  /**
   * Motor: evalúa todas las automatizaciones activas del tenant y ejecuta las que deban correr.
   * Anti-duplicado: solo corre si now >= nextRunAt; tras crear tarea(s) actualiza nextRunAt/lastRunAt/runCount.
   */
  runEngine(tenantId: string): number {
    const now = new Date();
    const automations = this.getAutomations(tenantId).filter((a) => a.active && !a.deletedAt);
    let executed = 0;
    for (const auto of automations) {
      const next = new Date(auto.nextRunAt);
      if (now < next) continue;
      if (auto.endDate && now > new Date(auto.endDate)) continue;
      if (new Date(auto.startDate) > now) continue;
      const task = this.createTaskFromAutomation(tenantId, auto);
      if (task) {
        executed++;
        const list = this.getAutomations(tenantId);
        const idx = list.findIndex((a) => a.id === auto.id);
        if (idx !== -1) {
          const nextRun = computeNextRunAt(auto, now);
          list[idx] = {
            ...list[idx],
            lastRunAt: now.toISOString(),
            nextRunAt: nextRun.toISOString(),
            runCount: list[idx].runCount + 1,
            updatedAt: now.toISOString()
          };
          this.persist(tenantId, list);
        }
      }
    }
    return executed;
  }

  private createTaskFromAutomation(tenantId: string, auto: Automation): Task | null {
    const blueprint = auto.taskBlueprint;
    const dueInDays = blueprint.dueInDays ?? 7;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueInDays);
    dueDate.setHours(12, 0, 0, 0);

    let projectId = blueprint.projectId ?? auto.projectId;
    let orgUnitId = blueprint.orgUnitId;
    if (auto.type === 'project_linked' && auto.projectId) {
      projectId = auto.projectId;
      const proj = this.projectService.getProjectById(auto.projectId);
      if (proj && !orgUnitId) orgUnitId = proj.primaryOrgUnitId;
    }

    const assigneeId = blueprint.assigneeId ?? '';
    const assigneeName = assigneeId ? (this.adminService.getUserById(assigneeId)?.name ?? 'Sin asignar') : 'Sin asignar';
    const categoryName = blueprint.categoryId
      ? (this.adminService.getCategories().find((c) => c.id === blueprint.categoryId)?.name ?? '')
      : '';

    const folio = `AUTO-${auto.id.slice(-6)}-${Date.now().toString(36)}`;
    const taskPayload: Omit<Task, 'id' | 'history'> & { history?: Task['history'] } = {
      tenantId,
      folio,
      title: blueprint.title,
      description: blueprint.description ?? `Creada automáticamente por "${auto.name}".`,
      assignee: assigneeName,
      assigneeId,
      status: 'Pendiente',
      priority: 'Media',
      dueDate,
      riskIndicator: 'ok',
      tags: blueprint.tags ?? [],
      attachmentsCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      createdBy: SYSTEM_USER_ID,
      createdByName: SYSTEM_USER_NAME,
      projectId,
      orgUnitId,
      categoryId: blueprint.categoryId,
      categoryName: categoryName || undefined,
      history: []
    };

    const task = this.taskService.createTask(taskPayload);
    const entry = task.history?.[0];
    if (entry && entry.details) {
      const d = entry.details as Record<string, unknown>;
      d['createdByAutomation'] = true;
      d['automationId'] = auto.id;
      d['automationName'] = auto.name;
    }
    return task;
  }
}
