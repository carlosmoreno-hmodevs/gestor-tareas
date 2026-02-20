import { Injectable, inject, Injector, signal, computed, effect } from '@angular/core';
import type { Task, TaskStatus, TaskLink, TaskLinkType, TaskLinksForTask, TaskTreeNode } from '../../shared/models';
import { getInitialTasks } from '../data/dummy-data';
import { ConnectivityService } from './connectivity.service';
import { OfflineSnapshotService } from './offline-snapshot.service';
import { TaskWorkflowService } from './task-workflow.service';
import { CurrentUserService } from './current-user.service';
import { TenantContextService } from './tenant-context.service';
import { TenantSettingsService } from './tenant-settings.service';
import { OrgService } from './org.service';
import { ProjectService } from './project.service';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly snapshot = inject(OfflineSnapshotService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly tenantSettings = inject(TenantSettingsService);
  private readonly orgService = inject(OrgService);
  private readonly adminService = inject(AdminService);
  private readonly injector = inject(Injector);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _taskLinks = signal<TaskLink[]>([]);

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      const mode = this.tenantSettings.systemMode();
      if (!tid) {
        this._tasks.set([]);
        this._taskLinks.set([]);
        return;
      }
      const initialTasks = getInitialTasks(tid, mode);
      const cachedTasks = this.snapshot.loadTasks();
      const tasks = cachedTasks?.length ? cachedTasks.filter((t: Task) => t.tenantId === tid) : initialTasks;
      this._tasks.set(tasks);

      const cachedLinks = this.snapshot.loadTaskLinks();
      const links = cachedLinks?.filter((l) => l.tenantId === tid) ?? [];
      this._taskLinks.set(links);
    }, { allowSignalWrites: true });

    effect(() => {
      const tasks = this._tasks();
      if (this.connectivity.isOnline()) {
        this.snapshot.saveTasks(tasks);
        this.connectivity.markSync();
      }
    });
    effect(() => {
      const links = this._taskLinks();
      if (this.connectivity.isOnline()) {
        this.snapshot.saveTaskLinks(links);
      }
    });
  }

  private getProjectService(): ProjectService {
    return this.injector.get(ProjectService);
  }

  /** Primary org unit for a task: task.orgUnitId or project.primaryOrgUnitId */
  private getPrimaryOrgUnitId(task: Task): string | undefined {
    if (task.orgUnitId) return task.orgUnitId;
    if (task.projectId) {
      const proj = this.getProjectService().getProjectById(task.projectId);
      return proj?.primaryOrgUnitId;
    }
    return undefined;
  }

  /** Check if child org is compatible with parent's org scope */
  private isOrgCompatible(parentTask: Task, childOrgUnitId: string | undefined): boolean {
    const parentOrg = this.getPrimaryOrgUnitId(parentTask);
    if (!parentOrg) return true;
    if (!childOrgUnitId) return true;
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return false;
    const scopeIds = this.orgService.getScopeOrgUnitIds(tid, parentOrg);
    return scopeIds !== null && scopeIds.includes(childOrgUnitId);
  }

  /** Get all ancestor task IDs (for cycle detection) */
  private getAncestorIds(taskId: string): Set<string> {
    const visited = new Set<string>();
    let current: Task | undefined = this._tasks().find((t) => t.id === taskId);
    while (current?.parentTaskId) {
      if (visited.has(current.parentTaskId)) break;
      visited.add(current.parentTaskId);
      current = this._tasks().find((t) => t.id === current!.parentTaskId);
    }
    return visited;
  }

  /** Check if adding fromId BLOCKS toId would create a cycle in BLOCKS graph */
  private wouldCreateBlocksCycle(fromTaskId: string, toTaskId: string): boolean {
    const links = this._taskLinks().filter((l) => l.type === 'BLOCKS' && l.tenantId === this.tenantContext.currentTenantId());
    const blocks = new Map<string, string[]>();
    for (const l of links) {
      if (!blocks.has(l.fromTaskId)) blocks.set(l.fromTaskId, []);
      blocks.get(l.fromTaskId)!.push(l.toTaskId);
    }
    const wouldAdd = (a: string, b: string) => {
      const next = new Map(blocks);
      const arr = next.get(a) ?? [];
      if (!arr.includes(b)) next.set(a, [...arr, b]);
      return next;
    };
    const withNew = wouldAdd(fromTaskId, toTaskId);
    const reachable = (start: string): Set<string> => {
      const seen = new Set<string>();
      const stack = [start];
      while (stack.length) {
        const id = stack.pop()!;
        if (seen.has(id)) continue;
        seen.add(id);
        for (const t of withNew.get(id) ?? []) stack.push(t);
      }
      return seen;
    };
    return reachable(toTaskId).has(fromTaskId);
  }

  private appendHistoryEntry(task: Task, type: Task['history'][0]['type'], details: Task['history'][0]['details']): Task {
    const entry = this.workflow.createHistoryEntry(type, this.currentUser.id, this.currentUser.name, details);
    return { ...task, history: [...(task.history ?? []), entry] };
  }

  private persistTask(updated: Task): void {
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === updated.id);
      if (idx === -1) return list;
      const next = [...list];
      next[idx] = updated;
      return next;
    });
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

  /** Solo tareas con estado efectivo Vencida (pendientes y pasadas de fecha). */
  readonly overdueCount = computed(() =>
    this.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length
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

  /**
   * Vincula o desvincula una tarea de un proyecto (solo mismo tenant).
   * Al vincular, opcionalmente asigna orgUnitId desde el proyecto.
   */
  setTaskProject(taskId: string, projectId: string | null): void {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) throw new Error('No tenant context');
    const task = this._tasks().find((t) => t.id === taskId && t.tenantId === tid);
    if (!task) throw new Error('Task not found');
    const projectService = this.injector.get(ProjectService);
    const proj = projectId ? projectService.getProjectById(projectId) : undefined;
    const prevProjectId = task.projectId ?? '';
    const newOrgUnitId = proj?.primaryOrgUnitId ?? task.orgUnitId;
    const updated: Task = {
      ...task,
      projectId: projectId ?? undefined,
      orgUnitId: projectId ? (task.orgUnitId ?? newOrgUnitId) : task.orgUnitId
    };
    updated.riskIndicator = this.workflow.computeRiskIndicator(updated);
    const withHistory = this.appendHistoryEntry(updated, 'EDITED', {
      field: 'projectId',
      oldValue: prevProjectId,
      newValue: projectId ?? ''
    });
    this.persistTask(withHistory);
    if (projectId && (updated.assigneeId || (updated.subAssigneeIds?.length ?? 0) > 0)) {
      const getUserName = (userId: string) => this.adminService.getUserById(userId)?.name ?? userId;
      projectService.addTaskAssigneesAsMembers(
        projectId,
        updated.assigneeId ?? '',
        updated.subAssigneeIds ?? [],
        getUserName
      );
    }
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
    let updatedTask: Task | null = null;
    this._tasks.update((list) => {
      const idx = list.findIndex((t) => t.id === id);
      if (idx === -1) return list;
      const task = list[idx];
      const updated = { ...task, ...updates };
      updated.riskIndicator = this.workflow.computeRiskIndicator(updated);
      updatedTask = updated;
      const next = [...list];
      next[idx] = updated;
      return next;
    });

    if (!updatedTask) return;
    const task: Task = updatedTask;
    if (task.projectId && (task.assigneeId || (task.subAssigneeIds?.length ?? 0) > 0)) {
      const projectService = this.injector.get(ProjectService);
      const getUserName = (userId: string) => this.adminService.getUserById(userId)?.name ?? userId;
      projectService.addTaskAssigneesAsMembers(
        task.projectId,
        task.assigneeId ?? '',
        task.subAssigneeIds ?? [],
        getUserName
      );
    }
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

    if (newTask.projectId && (newTask.assigneeId || (newTask.subAssigneeIds?.length ?? 0) > 0)) {
      const projectService = this.injector.get(ProjectService);
      const getUserName = (id: string) => this.adminService.getUserById(id)?.name ?? id;
      projectService.addTaskAssigneesAsMembers(
        newTask.projectId,
        newTask.assigneeId ?? '',
        newTask.subAssigneeIds ?? [],
        getUserName
      );
    }

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
    payload: import('./task-workflow.service').TransitionPayload
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

  // ─── Relations: Hierarchy & Links ─────────────────────────────────────────

  setParentTask(taskId: string, parentTaskId: string | null): void {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) throw new Error('No tenant context');
    const task = this._tasks().find((t) => t.id === taskId && t.tenantId === tid);
    if (!task) throw new Error('Task not found');
    if (parentTaskId === taskId) throw new Error('A task cannot be its own parent');
    if (parentTaskId) {
      const parent = this._tasks().find((t) => t.id === parentTaskId && t.tenantId === tid);
      if (!parent) throw new Error('Parent task not found');
      if (parent.tenantId !== task.tenantId) throw new Error('Cannot relate tasks from different tenants');
      const ancestors = this.getAncestorIds(parentTaskId);
      if (ancestors.has(taskId)) throw new Error('Cannot create cycle: task would be ancestor of its parent');
      if (!this.isOrgCompatible(parent, task.orgUnitId)) {
        throw new Error('Child task org unit is not compatible with parent scope');
      }
    }
    const prevParent = task.parentTaskId ?? null;
    const updated = {
      ...task,
      parentTaskId: parentTaskId ?? undefined,
      orgUnitId: parentTaskId && !task.orgUnitId
        ? this.getPrimaryOrgUnitId(this._tasks().find((t) => t.id === parentTaskId)!) ?? task.orgUnitId
        : task.orgUnitId
    };
    const withHistory = this.appendHistoryEntry(updated, 'PARENT_CHANGED', {
      oldValue: prevParent ?? '',
      newValue: parentTaskId ?? ''
    });
    this.persistTask(withHistory);
  }

  addSubtask(
    parentTaskId: string,
    payload: { title: string; dueDate?: Date; priority?: Task['priority']; assigneeId?: string; assignee?: string; orgUnitId?: string }
  ): Task {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) throw new Error('No tenant context');
    const parent = this._tasks().find((t) => t.id === parentTaskId && t.tenantId === tid);
    if (!parent) throw new Error('Parent task not found');
    const orgUnitId = payload.orgUnitId ?? parent.orgUnitId ?? this.getPrimaryOrgUnitId(parent);
    if (orgUnitId && !this.isOrgCompatible(parent, orgUnitId)) {
      throw new Error('Subtask org unit is not compatible with parent scope');
    }
    const folio = `TASK-SUB-${String(Date.now()).slice(-6)}`;
    const dueDate = payload.dueDate ?? parent.dueDate;
    const newTask = this.createTask({
      ...payload,
      tenantId: tid,
      folio,
      title: payload.title,
      dueDate,
      priority: payload.priority ?? parent.priority,
      assignee: payload.assignee ?? 'Sin asignar',
      assigneeId: payload.assigneeId ?? '',
      status: 'Pendiente',
      description: '',
      tags: [],
      attachmentsCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      createdBy: this.currentUser.id,
      createdByName: this.currentUser.name,
      projectId: parent.projectId,
      orgUnitId,
      parentTaskId,
      riskIndicator: this.workflow.computeRiskIndicator({
        ...parent,
        dueDate,
        status: 'Pendiente',
        priority: payload.priority ?? parent.priority
      } as Task)
    });
    return newTask;
  }

  getSubtasks(taskId: string): Task[] {
    const tid = this.tenantContext.currentTenantId();
    return this._tasks().filter(
      (t) => t.tenantId === tid && t.parentTaskId === taskId
    ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  getParentTask(taskId: string): Task | undefined {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task?.parentTaskId) return undefined;
    return this._tasks().find((t) => t.id === task.parentTaskId);
  }

  getTaskTree(taskId: string, depth = 0): TaskTreeNode | undefined {
    const task = this._tasks().find((t) => t.id === taskId);
    if (!task) return undefined;
    const children = this.getSubtasks(taskId)
      .map((c) => this.getTaskTree(c.id, depth + 1))
      .filter((n): n is TaskTreeNode => !!n);
    return { task, children, depth };
  }

  createTaskLink(fromTaskId: string, toTaskId: string, type: TaskLinkType): TaskLink {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) throw new Error('No tenant context');
    if (fromTaskId === toTaskId) throw new Error('Cannot link a task to itself');
    const fromTask = this._tasks().find((t) => t.id === fromTaskId && t.tenantId === tid);
    const toTask = this._tasks().find((t) => t.id === toTaskId && t.tenantId === tid);
    if (!fromTask || !toTask) throw new Error('Task not found');
    if (fromTask.tenantId !== toTask.tenantId) throw new Error('Cannot relate tasks from different tenants');
    if (!this.isOrgCompatible(fromTask, toTask.orgUnitId)) {
      throw new Error('Target task org unit is not compatible with source scope');
    }
    const links = this._taskLinks();
    if (links.some((l) => l.fromTaskId === fromTaskId && l.toTaskId === toTaskId && l.type === type)) {
      throw new Error('Link already exists');
    }
    if (type === 'BLOCKS' && this.wouldCreateBlocksCycle(fromTaskId, toTaskId)) {
      throw new Error('Would create a cycle in BLOCKS dependencies');
    }
    const link: TaskLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      tenantId: tid,
      fromTaskId,
      toTaskId,
      type,
      createdAt: new Date().toISOString(),
      createdByUserId: this.currentUser.id
    };
    this._taskLinks.update((list) => [...list, link]);
    const taskToUpdate = type === 'BLOCKS' ? toTask : fromTask;
    const withHistory = this.appendHistoryEntry(taskToUpdate, 'LINK_ADDED', {
      newValue: JSON.stringify({ linkId: link.id, type, fromTaskId, toTaskId })
    });
    this.persistTask(withHistory);
    return link;
  }

  removeTaskLink(linkId: string): void {
    const link = this._taskLinks().find((l) => l.id === linkId);
    if (!link) throw new Error('Link not found');
    const task = this._tasks().find((t) => t.id === (link.type === 'BLOCKS' ? link.toTaskId : link.fromTaskId));
    this._taskLinks.update((list) => list.filter((l) => l.id !== linkId));
    if (task) {
      const withHistory = this.appendHistoryEntry(task, 'LINK_REMOVED', {
        oldValue: JSON.stringify({ linkId, type: link.type })
      });
      this.persistTask(withHistory);
    }
  }

  getLinksForTask(taskId: string): TaskLinksForTask {
    const tid = this.tenantContext.currentTenantId();
    const links = this._taskLinks().filter((l) => l.tenantId === tid);
    const blockedBy = links.filter((l) => l.type === 'BLOCKS' && l.toTaskId === taskId);
    const blocking = links.filter((l) => l.type === 'BLOCKS' && l.fromTaskId === taskId);
    const related = links.filter((l) => l.type === 'RELATES' && (l.fromTaskId === taskId || l.toTaskId === taskId));
    const duplicates = links.filter((l) => l.type === 'DUPLICATES' && (l.fromTaskId === taskId || l.toTaskId === taskId));
    return { blockedBy, blocking, related, duplicates };
  }

  /** Tasks that can be linked (same tenant, compatible org, exclude self and descendants) */
  getLinkableTasks(currentTaskId: string): Task[] {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    const current = this._tasks().find((t) => t.id === currentTaskId && t.tenantId === tid);
    if (!current) return [];
    const ancestorIds = this.getAncestorIds(currentTaskId);
    ancestorIds.add(currentTaskId);
    const descendants = new Set<string>();
    const collect = (id: string) => {
      for (const t of this._tasks().filter((x) => x.parentTaskId === id)) {
        descendants.add(t.id);
        collect(t.id);
      }
    };
    collect(currentTaskId);
    return this._tasks().filter((t) => {
      if (t.tenantId !== tid) return false;
      if (ancestorIds.has(t.id) || descendants.has(t.id)) return false;
      return this.isOrgCompatible(current, t.orgUnitId);
    });
  }

  /** Whether task has open (non-finished) blockers */
  isBlocked(taskId: string): boolean {
    const { blockedBy } = this.getLinksForTask(taskId);
    const FINAL = ['Completada', 'Liberada', 'Cancelada'];
    return blockedBy.some((l) => {
      const t = this._tasks().find((x) => x.id === l.fromTaskId);
      return t && !FINAL.includes(this.workflow.getEffectiveStatus(t));
    });
  }
}
