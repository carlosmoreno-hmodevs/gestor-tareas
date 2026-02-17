import { Injectable, inject, signal, computed, effect } from '@angular/core';
import type { Task, TaskStatus, Priority } from '../../shared/models';
import { TASKS } from '../data/dummy-data';
import { ConnectivityService } from './connectivity.service';
import { OfflineSnapshotService } from './offline-snapshot.service';
import { TaskWorkflowService } from './task-workflow.service';
import { CurrentUserService } from './current-user.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly connectivity = inject(ConnectivityService);
  private readonly snapshot = inject(OfflineSnapshotService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);

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
    if (this.connectivity.isOnline()) return [...TASKS];
    const cached = this.snapshot.loadTasks();
    if (cached?.length) return cached;
    return [...TASKS];
  }

  readonly tasks = this._tasks.asReadonly();

  readonly activeCount = computed(() =>
    this._tasks().filter(
      (t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );

  readonly overdueCount = computed(() =>
    this._tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida' || t.riskIndicator === 'vencida').length
  );

  readonly dueSoonCount = computed(() =>
    this._tasks().filter(
      (t) =>
        t.riskIndicator === 'por-vencer' &&
        !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );

  readonly completedCount = computed(() =>
    this._tasks().filter((t) => ['Completada', 'Liberada'].includes(t.status)).length
  );

  getById(id: string): Task | undefined {
    const t = this._tasks().find((task) => task.id === id);
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
    const id = `task-${task.folio}`;
    const baseTask: Task = { ...task, id, history: [] };
    const entry = this.workflow.createHistoryEntry('CREATED', this.currentUser.id, this.currentUser.name, {
      newValue: JSON.stringify({ title: task.title, assignee: task.assignee, dueDate: task.dueDate, priority: task.priority })
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
