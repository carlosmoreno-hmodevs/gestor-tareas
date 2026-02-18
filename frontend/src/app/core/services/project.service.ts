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
import { TaskService } from './task.service';
import { TaskWorkflowService } from './task-workflow.service';
import { CurrentUserService } from './current-user.service';
import { ConnectivityService } from './connectivity.service';
import { OfflineSnapshotService } from './offline-snapshot.service';
import { TenantContextService } from './tenant-context.service';
import { OrgService } from './org.service';
import type { ProjectKpis } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly snapshot = inject(OfflineSnapshotService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly orgService = inject(OrgService);

  private readonly _projects = signal<Project[]>(this.initialProjects());

  constructor() {
    effect(() => {
      const projects = this._projects();
      if (this.connectivity.isOnline()) {
        this.snapshot.saveProjects(projects);
      }
    });
  }

  private initialProjects(): Project[] {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    const initial = getInitialProjects(tid);
    if (this.connectivity.isOnline()) {
      return initial.map((p) => this.hydrateDates(p));
    }
    const cached = this.snapshot.loadProjects();
    const list = cached?.length ? cached : initial;
    return list.filter((p) => p.tenantId === tid).map((p) => this.hydrateDates(p));
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
}
