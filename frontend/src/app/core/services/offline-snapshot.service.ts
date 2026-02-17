import { Injectable, inject } from '@angular/core';
import type { Task } from '../../shared/models';
import type { Project } from '../../shared/models';

const STORAGE_KEY_TASKS = 'gestor-tareas:snapshot:tasks';
const STORAGE_KEY_META = 'gestor-tareas:snapshot:meta';
const STORAGE_KEY_PROJECTS = 'gestor-tareas:snapshot:projects';
const STORAGE_KEY_PROJECTS_META = 'gestor-tareas:snapshot:projects-meta';

export interface SnapshotMeta {
  savedAt: string;
  tasksCount: number;
}

export interface ProjectsSnapshotMeta {
  savedAt: string;
  projectsCount: number;
}

@Injectable({ providedIn: 'root' })
export class OfflineSnapshotService {
  saveTasks(tasks: Task[]): void {
    try {
      const serializable = tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate,
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : t.createdAt,
        history: (t.history ?? []).map((h) => ({
          ...h,
          timestamp: h.timestamp instanceof Date ? h.timestamp.toISOString() : h.timestamp
        })),
        attachments: (t.attachments ?? []).map((a) => ({
          ...a,
          uploadedAt: a.uploadedAt instanceof Date ? a.uploadedAt.toISOString() : a.uploadedAt
        }))
      }));
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(serializable));
      localStorage.setItem(
        STORAGE_KEY_META,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          tasksCount: tasks.length
        } as SnapshotMeta)
      );
    } catch (e) {
      console.warn('OfflineSnapshot: could not save', e);
    }
  }

  loadTasks(): Task[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
      return parsed.map((t) => {
        const task = {
          ...t,
          dueDate: new Date(t['dueDate'] as string),
          createdAt: new Date(t['createdAt'] as string)
        } as Task;
        const hist = (task.history ?? []) as unknown as Array<Record<string, unknown>>;
        task.history = hist.map((h) => ({
          ...h,
          timestamp: new Date((h['timestamp'] as string) || Date.now())
        })) as Task['history'];
        const att = (task.attachments ?? []) as unknown as Array<Record<string, unknown>>;
        task.attachments = att.map((a) => ({
          ...a,
          uploadedAt: new Date((a['uploadedAt'] as string) || Date.now())
        })) as Task['attachments'];
        return task;
      }) as Task[];
    } catch {
      return null;
    }
  }

  getMeta(): SnapshotMeta | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_META);
      return raw ? (JSON.parse(raw) as SnapshotMeta) : null;
    } catch {
      return null;
    }
  }

  hasSnapshot(): boolean {
    return localStorage.getItem(STORAGE_KEY_TASKS) !== null;
  }

  saveProjects(projects: Project[]): void {
    try {
      const serializable = projects.map((p) => ({
        ...p,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
        lastUpdatedAt: p.lastUpdatedAt instanceof Date ? p.lastUpdatedAt.toISOString() : p.lastUpdatedAt,
        startDate: p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
        dueDate: p.dueDate instanceof Date ? p.dueDate.toISOString() : p.dueDate,
        activity: (p.activity ?? []).map((a) => ({
          ...a,
          timestamp: a.timestamp instanceof Date ? a.timestamp.toISOString() : a.timestamp
        })),
        filesMeta: (p.filesMeta ?? []).map((f) => ({
          ...f,
          uploadedAt: f.uploadedAt instanceof Date ? f.uploadedAt.toISOString() : f.uploadedAt
        })),
        milestones: (p.milestones ?? []).map((m) => ({
          ...m,
          dueDate: m.dueDate instanceof Date ? m.dueDate.toISOString() : m.dueDate
        }))
      }));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(serializable));
      localStorage.setItem(
        STORAGE_KEY_PROJECTS_META,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          projectsCount: projects.length
        } as ProjectsSnapshotMeta)
      );
    } catch (e) {
      console.warn('OfflineSnapshot: could not save projects', e);
    }
  }

  loadProjects(): Project[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
      return parsed.map((p) => {
        const proj = { ...p } as unknown as Project;
        proj.createdAt = new Date(p['createdAt'] as string);
        proj.lastUpdatedAt = p['lastUpdatedAt'] ? new Date(p['lastUpdatedAt'] as string) : undefined;
        proj.startDate = p['startDate'] ? new Date(p['startDate'] as string) : undefined;
        proj.dueDate = p['dueDate'] ? new Date(p['dueDate'] as string) : undefined;
        const activity = (proj.activity ?? []) as unknown as Array<Record<string, unknown>>;
        proj.activity = activity.map((a) => ({
          ...a,
          timestamp: new Date((a['timestamp'] as string) || Date.now())
        })) as Project['activity'];
        const filesMeta = (proj.filesMeta ?? []) as unknown as Array<Record<string, unknown>>;
        proj.filesMeta = filesMeta.map((f) => ({
          ...f,
          uploadedAt: new Date((f['uploadedAt'] as string) || Date.now())
        })) as Project['filesMeta'];
        const milestones = (proj.milestones ?? []) as unknown as Array<Record<string, unknown>>;
        proj.milestones = milestones.map((m) => ({
          ...m,
          dueDate: m['dueDate'] ? new Date(m['dueDate'] as string) : undefined
        })) as Project['milestones'];
        return proj;
      }) as Project[];
    } catch {
      return null;
    }
  }

  hasProjectsSnapshot(): boolean {
    return localStorage.getItem(STORAGE_KEY_PROJECTS) !== null;
  }
}
