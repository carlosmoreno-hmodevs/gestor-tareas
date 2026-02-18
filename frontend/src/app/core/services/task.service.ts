import { Injectable, inject, Injector, signal, computed, effect } from '@angular/core';
import type { Task, TaskStatus } from '../../shared/models';
import { getInitialTasks } from '../data/dummy-data';
import { ConnectivityService } from './connectivity.service';
import { OfflineSnapshotService } from './offline-snapshot.service';
import { TaskWorkflowService } from './task-workflow.service';
import { CurrentUserService } from './current-user.service';
import { TenantContextService } from './tenant-context.service';
import { OrgService } from './org.service';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly snapshot = inject(OfflineSnapshotService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly orgService = inject(OrgService);
  private readonly injector = inject(Injector);

  private readonly _tasks = signal<Task[]>(this.initialTasks());

  constructor() {
    effect(() => {
      const tasks = this._tasks();
      if (this.connectivity.isOnline()) {
        this.snapshot.saveTasks(tasks);
        this.connectivity.markSync();
      }
    });
  }

  private initialTasks(): Task[] {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    const initial = getInitialTasks(tid);
    if (this.connectivity.isOnline()) {
      return initial;
    }
    const cached = this.snapshot.loadTasks();
    const list = cached?.length ? cached : initial;
    return list.filter((t) => t.tenantId === tid);
  }

  private filterByContext(tasks: Task[]): Task[] {
    const tid = this.tenantContext.currentTenantId();
    const selectedId = this.orgService.selectedOrgUnitId();
    const scopeIds = tid ? this.orgService.getScopeOrgUnitIds(tid, selectedId) : null;
    if (!scopeIds) return tasks;
    const projectService = this.injector.get(ProjectService);
    return tasks.filter((t) => {
      const taskOrgId = t.orgUnitId;
      if (taskOrgId) return scopeIds.includes(taskOrgId);
      if (t.projectId) {
        const proj = projectService.getProjectById(t.projectId);
        return proj?.primaryOrgUnitId ? scopeIds.includes(proj.primaryOrgUnitId) : true;
      }
      return true;
    });
  }

  readonly tasks = computed(() => this.filterByContext(this._tasks()));

  readonly activeCount = computed(() =>
    this.tasks().filter(
      (t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );

  readonly overdueCount = computed(() =>
    this.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida' || t.riskIndicator === 'vencida').length
  );

  readonly dueSoonCount = computed(() =>
    this.tasks().filter(
      (t) =>
        t.riskIndicator === 'por-vencer' &&
        !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );

  readonly completedCount = computed(() =>
    this.tasks().filter((t) => ['Completada', 'Liberada'].includes(t.status)).length
  );

  /** Todas las tareas del tenant (sin filtrar por contexto org) - para checks de admin */
  getAllTasksForTenant(): Task[] {
    const tid = this.tenantContext.currentTenantId();
    return tid ? this._tasks().filter((t) => t.tenantId === tid) : [];
  }

  getTasksByProjectId(projectId: string): Task[] {
    const tid = this.tenantContext.currentTenantId();
    return this._tasks().filter((t) => t.projectId === projectId && t.tenantId === tid);
  }

  getById(id: string): Task | undefined {
    const tid = this.tenantContext.currentTenantId();
    const t = this._tasks().find((task) => task.id === id && task.tenantId === tid);
    if (!t) return undefined;
    const effective = this.workflow.getEffectiveStatus(t);
    if (effective !== t.status) return { ...t, status: effective };
    return t;
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === id);
      if (idx === -1) return list;
      const task = list[idx];
      const updated = { ...task, ...updates };
      updated.riskIndicator = this.workflow.computeRiskIndicator(updated);
      const next = [...list];
      next[idx] = updated;
      return next;
    });
  }

  createTask(task: Omit<Task, 'id' | 'history'> & { history?: Task['history'] }): Task {
    const tid = this.tenantContext.currentTenantId();
    const projectService = this.injector.get(ProjectService);
    const proj = task.projectId ? projectService.getProjectById(task.projectId) : undefined;
    const orgUnitId = task.orgUnitId ?? proj?.primaryOrgUnitId;
    const baseTask: Task = {
      ...task,
      id: `task-${task.folio}`,
      tenantId: task.tenantId ?? tid ?? 'tenant-1',
      orgUnitId: orgUnitId ?? task.orgUnitId,
      history: []
    };
    const entry = this.workflow.createHistoryEntry('CREATED', this.currentUser.id, this.currentUser.name, {
      newValue: JSON.stringify({ title: baseTask.title, assignee: baseTask.assignee, dueDate: baseTask.dueDate, priority: baseTask.priority })
    });
    const newTask: Task = {
      ...baseTask,
      riskIndicator: this.workflow.computeRiskIndicator(baseTask),
      history: [entry]
    };
    this._tasks.update((list) => [...list, newTask]);
    return newTask;
  }

  addComment(taskId: string, comment: string): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task || !comment.trim()) return;
    const entry = this.workflow.createHistoryEntry(
      'COMMENT_ADDED',
      this.currentUser.id,
      this.currentUser.name,
      { comment: comment.trim() }
    );
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx === -1) return list;
      const t = list[idx];
      const updated = {
        ...t,
        commentsCount: (t.commentsCount ?? 0) + 1,
        history: [...(t.history ?? []), entry]
      };
      const next = [...list];
      next[idx] = updated;
      return next;
    });
  }

  addAttachmentMetadata(
    taskId: string,
    files: { name: string; size: number; type?: string }[]
  ): void {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task || !files.length) return;
    const attachments: Task['attachments'] = (task.attachments ?? []).slice();
    for (const f of files) {
      attachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date(),
        uploadedBy: this.currentUser.name,
        uploadedById: this.currentUser.id
      });
    }
    const fileNames = files.map((f) => f.name);
    const entry = this.workflow.createHistoryEntry(
      'ATTACHMENT_ADDED',
      this.currentUser.id,
      this.currentUser.name,
      { fileNames }
    );
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx === -1) return list;
      const t = list[idx];
      const updated = {
        ...t,
        attachmentsCount: (t.attachmentsCount ?? 0) + files.length,
        attachments,
        history: [...(t.history ?? []), entry]
      };
      const next = [...list];
      next[idx] = updated;
      return next;
    });
  }

  removeAttachment(taskId: string, attachmentId: string): void {
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx === -1) return list;
      const t = list[idx];
      const attachments = (t.attachments ?? []).filter((a) => a.id !== attachmentId);
      const updated = {
        ...t,
        attachmentsCount: attachments.length,
        attachments
      };
      const next = [...list];
      next[idx] = updated;
      return next;
    });
  }

  applyTransition(
    taskId: string,
    toStatus: TaskStatus,
    payload: { comment?: string; newDueDate?: Date }
  ): Task {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const updated = this.workflow.applyTransition(
      task,
      toStatus,
      payload,
      this.currentUser.id,
      this.currentUser.name
    );

    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx === -1) return list;
      const next = [...list];
      next[idx] = updated;
      return next;
    });

    return updated;
  }
}
