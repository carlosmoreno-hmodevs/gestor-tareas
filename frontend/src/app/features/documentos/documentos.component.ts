import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { BreakpointObserver } from '@angular/cdk/layout';
import type { Document, Task } from '../../shared/models';
import { DataService } from '../../core/services/data.service';
import { TaskService } from '../../core/services/task.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

const ORPHAN_PROJECT_ID = '__sin_proyecto__';
const ORPHAN_TASK_KEY = '__sin_tarea__';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    PageHeaderComponent,
    DateFormatPipe
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {
  private readonly dataService = inject(DataService);
  private readonly taskService = inject(TaskService);
  private readonly breakpoint = inject(BreakpointObserver);

  readonly orphanProjectId = ORPHAN_PROJECT_ID;
  readonly orphanTaskKey = ORPHAN_TASK_KEY;

  isMobile = signal(false);
  menuDoc = signal<Document | null>(null);

  /** Carpeta proyecto actual, o null = raíz */
  folderProjectId = signal<string | null>(null);
  /** Carpeta tarea (`task-…` o ORPHAN_TASK_KEY); null = aún no entraste a tarea */
  folderTaskKey = signal<string | null>(null);

  searchText = signal('');

  constructor() {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    this.breakpoint.observe('(max-width: 767px)').subscribe((r) => this.isMobile.set(r.matches));
  }

  documents = this.dataService.getDocuments();

  taskById = computed(() => {
    const m = new Map<string, Task>();
    for (const t of this.taskService.tasks()) {
      m.set(t.id, t);
    }
    return m;
  });

  projectById = computed(() => {
    const m = new Map<string, { id: string; name: string }>();
    for (const p of this.dataService.getProjects()) {
      m.set(p.id, { id: p.id, name: p.name });
    }
    return m;
  });

  filteredDocuments = computed(() => {
    const q = this.searchText().toLowerCase().trim();
    if (!q) return this.documents;
    return this.documents.filter(
      (d) =>
        d.taskId?.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q) ||
        d.projectId?.toLowerCase().includes(q)
    );
  });

  /** Documentos con proyecto/tarea resueltos (tarea hereda proyecto si el doc no trae projectId) */
  enrichedDocs = computed(() => {
    const tb = this.taskById();
    return this.filteredDocuments().map((doc) => {
      const task = doc.taskId ? tb.get(doc.taskId) : undefined;
      const projectId = doc.projectId ?? task?.projectId ?? ORPHAN_PROJECT_ID;
      const taskKey = doc.taskId ?? ORPHAN_TASK_KEY;
      return { doc, task, projectId, taskKey };
    });
  });

  /** Raíz: proyectos (o “Sin proyecto”) con conteo de archivos */
  projectFolders = computed(() => {
    const counts = new Map<string, number>();
    for (const e of this.enrichedDocs()) {
      counts.set(e.projectId, (counts.get(e.projectId) ?? 0) + 1);
    }
    const rows = [...counts.entries()].map(([projectId, docCount]) => ({
      projectId,
      docCount,
      project: projectId === ORPHAN_PROJECT_ID ? null : this.projectById().get(projectId)
    }));
    return rows.sort((a, b) => {
      if (a.projectId === ORPHAN_PROJECT_ID) return 1;
      if (b.projectId === ORPHAN_PROJECT_ID) return -1;
      const na = a.project?.name ?? a.projectId;
      const nb = b.project?.name ?? b.projectId;
      return na.localeCompare(nb, 'es');
    });
  });

  /** Dentro de un proyecto: carpetas por tarea */
  taskFolders = computed(() => {
    const pid = this.folderProjectId();
    if (!pid) return [];
    const m = new Map<string, { docCount: number; task?: Task }>();
    for (const e of this.enrichedDocs()) {
      if (e.projectId !== pid) continue;
      const prev = m.get(e.taskKey);
      const task = e.taskKey === ORPHAN_TASK_KEY ? undefined : this.taskById().get(e.taskKey);
      if (prev) {
        prev.docCount++;
      } else {
        m.set(e.taskKey, { docCount: 1, task });
      }
    }
    return [...m.entries()]
      .map(([taskKey, v]) => ({ taskKey, ...v }))
      .sort((a, b) => {
        if (a.taskKey === ORPHAN_TASK_KEY) return 1;
        if (b.taskKey === ORPHAN_TASK_KEY) return -1;
        const fa = a.task?.folio ?? '';
        const fb = b.task?.folio ?? '';
        return fa.localeCompare(fb, 'es', { numeric: true });
      });
  });

  /** Archivos en la carpeta tarea actual */
  filesInFolder = computed(() => {
    const pid = this.folderProjectId();
    const tid = this.folderTaskKey();
    if (!pid || !tid) return [];
    return this.enrichedDocs()
      .filter((e) => e.projectId === pid && e.taskKey === tid)
      .map((e) => e.doc);
  });

  currentProjectLabel = computed(() => {
    const id = this.folderProjectId();
    if (!id) return '';
    if (id === ORPHAN_PROJECT_ID) return 'Sin proyecto';
    return this.projectById().get(id)?.name ?? id;
  });

  currentTaskLabel = computed(() => {
    const key = this.folderTaskKey();
    if (!key) return '';
    if (key === ORPHAN_TASK_KEY) return 'Sin tarea vinculada';
    const t = this.taskById().get(key);
    return t ? `${t.folio} · ${t.title}` : this.formatTaskId(key);
  });

  atRoot = computed(() => !this.folderProjectId());
  atProject = computed(() => !!this.folderProjectId() && !this.folderTaskKey());
  atTaskFolder = computed(() => !!this.folderProjectId() && !!this.folderTaskKey());

  openProject(projectId: string): void {
    this.folderProjectId.set(projectId);
    this.folderTaskKey.set(null);
  }

  openTaskFolder(taskKey: string): void {
    this.folderTaskKey.set(taskKey);
  }

  goUp(): void {
    if (this.folderTaskKey()) {
      this.folderTaskKey.set(null);
      return;
    }
    if (this.folderProjectId()) {
      this.folderProjectId.set(null);
    }
  }

  goToRoot(): void {
    this.folderProjectId.set(null);
    this.folderTaskKey.set(null);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatTaskId(taskId?: string): string {
    if (!taskId) return '—';
    return taskId.replace(/^task-/i, '');
  }

  getFileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }

  getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext ?? 'file';
  }

  taskDetailLink(taskKey: string): string[] | null {
    if (taskKey === ORPHAN_TASK_KEY) return null;
    return ['/tareas', taskKey];
  }

  projectDetailLink(projectId: string): string[] | null {
    if (projectId === ORPHAN_PROJECT_ID) return null;
    return ['/proyectos', projectId];
  }
}
