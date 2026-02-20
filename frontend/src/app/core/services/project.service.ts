import { Injectable, inject, signal, computed, effect } from '@angular/core';
import type {
  Project,
  ProjectActivityEntry,
  ProjectFileMeta,
  ProjectImageMeta,
  ProjectMilestone
} from '../../shared/models';
import type { Task } from '../../shared/models';
import { getInitialProjects } from '../data/projects-initial';
import { FERRETERO_PROJECT_TEMPLATES } from '../data/ferretero-initial';
import { FERRETERO_TASK_TEMPLATES } from '../data/ferretero-initial';
import { TaskService } from './task.service';
import { TaskWorkflowService } from './task-workflow.service';
import { CurrentUserService } from './current-user.service';
import { ConnectivityService } from './connectivity.service';
import { OfflineSnapshotService } from './offline-snapshot.service';
import { TenantContextService } from './tenant-context.service';
import { TenantSettingsService } from './tenant-settings.service';
import { OrgService } from './org.service';
import { AdminService } from './admin.service';
import type { ProjectKpis } from '../../shared/models';
import type { ProjectTemplateBuilderItem } from '../../shared/models/project-template-builder.model';
import { normalizeDateToNoonLocal } from '../../shared/utils/date.utils';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly snapshot = inject(OfflineSnapshotService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly tenantSettings = inject(TenantSettingsService);
  private readonly orgService = inject(OrgService);
  private readonly adminService = inject(AdminService);

  private readonly _projects = signal<Project[]>([]);

  constructor() {
    effect(() => {
      const tid = this.tenantContext.currentTenantId();
      const mode = this.tenantSettings.systemMode();
      if (!tid) {
        this._projects.set([]);
        return;
      }
      const initial = getInitialProjects(tid, mode);
      const cached = this.snapshot.loadProjects();
      const list = cached?.length ? cached.filter((p: Project) => p.tenantId === tid) : initial;
      const hydrated = list.map((p) => this.hydrateDates(p));
      this._projects.set(hydrated);
    }, { allowSignalWrites: true });

    effect(() => {
      const projects = this._projects();
      if (this.connectivity.isOnline()) {
        this.snapshot.saveProjects(projects);
      }
    });
  }

  private filterByContext(projects: Project[]): Project[] {
    const tid = this.tenantContext.currentTenantId();
    const selectedId = this.orgService.selectedOrgUnitId();
    const scopeIds = tid ? this.orgService.getScopeOrgUnitIds(tid, selectedId) : null;
    if (!scopeIds) return projects;
    return projects.filter((p) => !p.primaryOrgUnitId || scopeIds.includes(p.primaryOrgUnitId));
  }

  private hydrateDates(p: Project): Project {
    const activity = (p.activity ?? []).map((a) => ({
      ...a,
      timestamp: a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp as string)
    }));
    const filesMeta = (p.filesMeta ?? []).map((f) => ({
      ...f,
      uploadedAt: f.uploadedAt instanceof Date ? f.uploadedAt : new Date(f.uploadedAt as string)
    }));
    const milestones = (p.milestones ?? []).map((m) => ({
      ...m,
      dueDate: m.dueDate ? (m.dueDate instanceof Date ? m.dueDate : new Date(m.dueDate as string)) : undefined
    }));
    return {
      ...p,
      createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt as string),
      lastUpdatedAt: p.lastUpdatedAt ? (p.lastUpdatedAt instanceof Date ? p.lastUpdatedAt : new Date(p.lastUpdatedAt as string)) : undefined,
      startDate: p.startDate ? (p.startDate instanceof Date ? p.startDate : new Date(p.startDate as string)) : undefined,
      dueDate: p.dueDate ? (p.dueDate instanceof Date ? p.dueDate : new Date(p.dueDate as string)) : undefined,
      activity,
      filesMeta,
      milestones
    };
  }

  readonly projects = computed(() => this.filterByContext(this._projects()));

  getProjects(): Project[] {
    return this.projects().map((p) => this.hydrateDates(p));
  }

  getProjectById(id: string): Project | undefined {
    const tid = this.tenantContext.currentTenantId();
    const p = this._projects().find((proj) => proj.id === id && proj.tenantId === tid);
    return p ? this.hydrateDates(p) : undefined;
  }

  computeKPIs(projectId: string): ProjectKpis {
    const tasks = this.taskService.getTasksByProjectId(projectId);
    const totalTasks = tasks.length;
    let completedTasks = 0;
    let tasksOverdue = 0;
    let tasksInProgress = 0;

    for (const t of tasks) {
      const effective = this.workflow.getEffectiveStatus(t);
      if (effective === 'Vencida') tasksOverdue++;
      else if (['Completada', 'Liberada'].includes(effective)) completedTasks++;
      else tasksInProgress++;
    }

    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      tasksInProgress,
      tasksOverdue,
      completedTasks,
      totalTasks,
      progressPercent
    };
  }

  createProject(payload: Omit<Project, 'id' | 'activity' | 'createdAt' | 'createdBy' | 'createdByName' | 'tenantId'>): Project {
    const id = `proj-${String(Date.now()).slice(-6)}`;
    const entry: ProjectActivityEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'CREATED',
      timestamp: new Date(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      details: { name: payload.name }
    };

    const tid = this.tenantContext.currentTenantId();
    const project: Project = {
      ...payload,
      id,
      tenantId: tid ?? 'tenant-1',
      activity: [entry],
      createdAt: new Date(),
      createdBy: this.currentUser.id,
      createdByName: this.currentUser.name
    };

    this._projects.update((list) => [...list, project]);
    return this.hydrateDates(project);
  }

  updateProject(updates: Partial<Project> & { id: string }): void {
    const { id, ...rest } = updates;
    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) return list;
      const next = [...list];
      next[idx] = { ...next[idx], ...rest, lastUpdatedAt: new Date() };
      return next;
    });
  }

  setProjectImage(projectId: string, imageMeta: ProjectImageMeta | null): void {
    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === projectId);
      if (idx === -1) return list;
      const next = [...list];
      next[idx] = { ...next[idx], image: imageMeta ?? undefined, lastUpdatedAt: new Date() };
      return next;
    });
  }

  addProjectFileMeta(projectId: string, files: { name: string; size: number; type?: string }[]): void {
    const project = this._projects().find((p) => p.id === projectId);
    if (!project || !files.length) return;
    const newFiles: ProjectFileMeta[] = files.map((f) => ({
      id: `pf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date(),
      uploadedBy: this.currentUser.name,
      uploadedById: this.currentUser.id
    }));
    const filesMeta = [...(project.filesMeta ?? []), ...newFiles];
    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === projectId);
      if (idx === -1) return list;
      const next = [...list];
      next[idx] = { ...next[idx], filesMeta, lastUpdatedAt: new Date() };
      return next;
    });
  }

  addMilestone(projectId: string, milestone: Omit<ProjectMilestone, 'id'>): void {
    const m: ProjectMilestone = {
      ...milestone,
      id: `ms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    };
    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === projectId);
      if (idx === -1) return list;
      const next = [...list];
      const milestones = [...(next[idx].milestones ?? []), m];
      next[idx] = { ...next[idx], milestones, lastUpdatedAt: new Date() };
      return next;
    });
  }

  addActivity(projectId: string, entry: Omit<ProjectActivityEntry, 'id'>): void {
    const e: ProjectActivityEntry = {
      ...entry,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    };
    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === projectId);
      if (idx === -1) return list;
      const next = [...list];
      const activity = [...(next[idx].activity ?? []), e];
      next[idx] = { ...next[idx], activity, lastUpdatedAt: new Date() };
      return next;
    });
  }

  getProjectTasks(projectId: string): Task[] {
    return this.taskService.getTasksByProjectId(projectId);
  }

  /**
   * Añade los responsables de una tarea como miembros del proyecto si aún no lo son.
   * Se llama cuando una tarea se crea o actualiza con projectId.
   */
  /**
   * Genera tareas sugeridas desde una plantilla de proyecto (modo ferretero).
   * Crea tareas asociadas al proyecto con templateId y generatedFromProjectTemplateId.
   */
  generateTasksFromProjectTemplate(projectId: string): number {
    const project = this.getProjectById(projectId);
    if (!project?.templateId) return 0;
    const projTpl = FERRETERO_PROJECT_TEMPLATES.find((t) => t.id === project.templateId);
    if (!projTpl?.taskTemplateIds?.length) return 0;

    const tid = this.tenantContext.currentTenantId();
    const owner = project.ownerId;
    const ownerName = project.owner;
    const dueDate = normalizeDateToNoonLocal(project.dueDate) ?? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 0, 0, 0);
    const orgUnitId = project.primaryOrgUnitId;
    const createdIds: string[] = [];

    for (let i = 0; i < projTpl.taskTemplateIds.length; i++) {
      const tplId = projTpl.taskTemplateIds[i];
      const taskTpl = FERRETERO_TASK_TEMPLATES.find((t) => t.id === tplId);
      if (!taskTpl) continue;

      const overrides = projTpl.taskOverrides?.[tplId];
      const title = overrides?.title ?? taskTpl.titleTemplate;
      const categoryId = overrides?.categoryId ?? taskTpl.categoryId;
      const priority = (overrides?.priority ?? 'Media') as 'Alta' | 'Media' | 'Baja';
      const descParts: string[] = [];
      if (taskTpl.descriptionText?.trim()) descParts.push(taskTpl.descriptionText.trim());
      if (taskTpl.evidenceHint?.trim()) descParts.push('Evidencia: ' + taskTpl.evidenceHint.trim());
      if (taskTpl.controlNotes?.trim()) descParts.push('Nota: ' + taskTpl.controlNotes.trim());
      const desc = descParts.join('\n\n');
      const checklistItems = (taskTpl.checklistItems ?? []).map((text, j) => ({
        id: `chk-${Date.now()}-${i}-${j}`,
        text,
        isDone: false
      }));

      const folio = `TASK-${Date.now()}-${i}`;
      const payload = {
        tenantId: tid ?? 'tenant-1',
        folio,
        title,
        description: desc,
        checklist: checklistItems.length ? checklistItems : undefined,
        assignee: ownerName,
        assigneeId: owner,
        status: 'Pendiente' as const,
        priority,
        dueDate,
        riskIndicator: 'ok' as const,
        tags: [] as string[],
        attachmentsCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
        createdBy: this.currentUser.id,
        createdByName: this.currentUser.name,
        projectId,
        orgUnitId,
        categoryId,
        subAssigneeIds: [] as string[],
        subAssignees: [] as string[],
        history: [] as Task['history'],
        templateId: tplId,
        generatedFromProjectTemplateId: project.templateId
      };

      const task = this.taskService.createTask(payload);
      createdIds.push(task.id);
      this.addActivity(projectId, {
        type: 'TASK_ADDED',
        timestamp: new Date(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        details: { taskTitle: title, fromTemplate: true }
      });
    }

    for (let j = 0; j < createdIds.length - 1; j++) {
      try {
        this.taskService.createTaskLink(createdIds[j], createdIds[j + 1], 'BLOCKS');
      } catch {
        // ignore cycle or duplicate
      }
    }

    this.updateProject({
      id: projectId,
      templateTasksGenerated: true
    });
    return createdIds.length;
  }

  /**
   * Crea tareas desde el Project Template Builder y enlaza con BLOCKS secuencial.
   */
  createTasksFromBuilder(projectId: string, items: ProjectTemplateBuilderItem[]): number {
    const project = this.getProjectById(projectId);
    if (!project?.templateId) return 0;

    const tid = this.tenantContext.currentTenantId();
    const orgUnitId = project.primaryOrgUnitId;
    const defaultDueDate = project.dueDate ? new Date(project.dueDate) : new Date();
    const createdIds: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const assigneeName = this.adminService.getUserById(item.assigneeId)?.name ?? item.assigneeId;
      const folio = `TASK-${Date.now()}-${i}`;
      const checklist = (item.checklistItems ?? [])
        .filter((t) => t?.trim())
        .map((text, j) => ({
          id: `chk-${Date.now()}-${i}-${j}`,
          text: text.trim(),
          isDone: false
        }));

      const payload = {
        tenantId: tid ?? 'tenant-1',
        folio,
        title: item.title || 'Sin título',
        description: item.description ?? '',
        checklist: checklist.length ? checklist : undefined,
        assignee: assigneeName,
        assigneeId: item.assigneeId || project.ownerId,
        status: 'Pendiente' as const,
        priority: (item.priority || 'Media') as 'Alta' | 'Media' | 'Baja',
        dueDate: normalizeDateToNoonLocal(item.dueDate) ?? defaultDueDate,
        riskIndicator: 'ok' as const,
        tags: [] as string[],
        attachmentsCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
        createdBy: this.currentUser.id,
        createdByName: this.currentUser.name,
        projectId,
        orgUnitId,
        categoryId: item.categoryId || undefined,
        subAssigneeIds: [] as string[],
        subAssignees: [] as string[],
        history: [] as Task['history'],
        templateId: item.taskTemplateId,
        generatedFromProjectTemplateId: project.templateId
      };

      const task = this.taskService.createTask(payload);
      createdIds.push(task.id);
      this.addActivity(projectId, {
        type: 'TASK_ADDED',
        timestamp: new Date(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        details: { taskTitle: task.title, fromTemplate: true }
      });
    }

    for (let j = 0; j < createdIds.length - 1; j++) {
      try {
        this.taskService.createTaskLink(createdIds[j], createdIds[j + 1], 'BLOCKS');
      } catch {
        // ignore cycle or duplicate
      }
    }

    this.updateProject({ id: projectId, templateTasksGenerated: true });
    return createdIds.length;
  }

  addTaskAssigneesAsMembers(
    projectId: string,
    assigneeId: string,
    subAssigneeIds: string[],
    getUserName?: (id: string) => string
  ): void {
    const project = this._projects().find((p) => p.id === projectId);
    if (!project) return;

    const existingIds = new Set([
      project.ownerId,
      ...(project.members ?? []).map((m) => m.userId)
    ]);

    const toAdd = [
      ...(assigneeId && !existingIds.has(assigneeId) ? [assigneeId] : []),
      ...(subAssigneeIds ?? []).filter((id) => id && !existingIds.has(id))
    ];

    if (toAdd.length === 0) return;

    const newMembers = toAdd.map((userId) => ({ userId, role: 'Miembro' as const }));
    const members = [...(project.members ?? []), ...newMembers];

    const activityEntries: ProjectActivityEntry[] = toAdd.map((userId) => ({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: 'MEMBER_ADDED',
      timestamp: new Date(),
      userId,
      userName: getUserName?.(userId),
      details: { source: 'task_assignee' }
    }));

    this._projects.update((list) => {
      const idx = list.findIndex((p) => p.id === projectId);
      if (idx === -1) return list;
      const next = [...list];
      const proj = next[idx];
      next[idx] = {
        ...proj,
        members,
        activity: [...(proj.activity ?? []), ...activityEntries],
        lastUpdatedAt: new Date()
      };
      return next;
    });
  }

  /**
   * Vincula tareas existentes al proyecto. Si una tarea ya pertenece a otro proyecto,
   * se desasocia del anterior (move). Registra actividad TASK_ADDED por cada una.
   */
  linkTasksToProject(projectId: string, taskIds: string[], allowMoveFromOther = true): { linked: number; errors: string[] } {
    const project = this.getProjectById(projectId);
    if (!project) return { linked: 0, errors: ['Proyecto no encontrado'] };
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return { linked: 0, errors: ['Sin tenant'] };
    const alreadyInProject = new Set(this.getProjectTasks(projectId).map((t) => t.id));
    const errors: string[] = [];
    let linked = 0;
    for (const taskId of taskIds) {
      if (alreadyInProject.has(taskId)) continue;
      const task = this.taskService.getById(taskId) ?? this.taskService.getAllTasksForTenant().find((t) => t.id === taskId);
      if (!task || task.tenantId !== tid) {
        errors.push(`Tarea ${taskId} no encontrada o de otro tenant`);
        continue;
      }
      if (task.projectId && task.projectId !== projectId && !allowMoveFromOther) {
        errors.push(`La tarea "${task.title}" ya pertenece a otro proyecto`);
        continue;
      }
      try {
        this.taskService.setTaskProject(taskId, projectId);
        this.addActivity(projectId, {
          type: 'TASK_ADDED',
          timestamp: new Date(),
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          details: { taskId, taskTitle: task.title, existingTask: true }
        });
        alreadyInProject.add(taskId);
        linked++;
      } catch (e) {
        errors.push((e as Error).message ?? String(e));
      }
    }
    return { linked, errors };
  }

  /**
   * Desvincula una tarea del proyecto (sin borrar la tarea). Registra actividad TASK_REMOVED.
   */
  unlinkTaskFromProject(projectId: string, taskId: string): void {
    const task = this.taskService.getById(taskId);
    if (!task || task.projectId !== projectId) return;
    const taskTitle = task.title;
    this.taskService.setTaskProject(taskId, null);
    this.addActivity(projectId, {
      type: 'TASK_REMOVED',
      timestamp: new Date(),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      details: { taskId, taskTitle }
    });
  }
}
