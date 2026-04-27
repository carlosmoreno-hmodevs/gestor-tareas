import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { DataService } from '../../core/services/data.service';
import { TaskWorkflowService } from '../../core/services/task-workflow.service';
import { CurrentUserService } from '../../core/services/current-user.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { OrgService } from '../../core/services/org.service';
import { ConnectivityService } from '../../core/services/connectivity.service';
import { IA_DEMO_SUGGESTIONS, type IaDemoSuggestion } from './ia-demo-suggestions';
import { IaTaskCardsComponent } from './ia-task-cards/ia-task-cards.component';
import type { Priority, ProjectStatus, Task, TaskStatus } from '../../shared/models';
import { normalizeDateToNoonLocal } from '../../shared/utils/date.utils';

export interface IaActionLink {
  label: string;
  routerLink: string[];
  queryParams?: Record<string, string | null>;
}

export interface IaStatusBarRow {
  label: string;
  value: number;
}

export interface IaWorkloadRow {
  name: string;
  open: number;
  assigneeId: string | null;
}

export interface IaProjectRow {
  id: string;
  name: string;
  status: string;
}

export interface IaRunResult {
  headline: string;
  body?: string;
  links: IaActionLink[];
  /** Vista previa tipo listado /tareas (máx. acotado en servidor de demo). */
  taskPreviews?: Task[];
  /** Barras horizontales para indicadores agregados (p. ej. estados). */
  statusBars?: IaStatusBarRow[];
  /** Tabla de carga por responsable. */
  workloadTable?: IaWorkloadRow[];
  /** Tabla de proyectos (nombre + estado + enlace). */
  projectTable?: IaProjectRow[];
}

function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

function addDaysBase(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return normalizeDateToNoonLocal(x) ?? x;
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    IaTaskCardsComponent
  ],
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.scss'
})
export class IaComponent {
  /** Máximo de cartas de tarea en la respuesta (legibilidad). */
  readonly previewLimit = 8;

  private readonly destroyRef = inject(DestroyRef);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly orgService = inject(OrgService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  private blurTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.blurTimer) clearTimeout(this.blurTimer);
    });
  }

  readonly allSuggestions = IA_DEMO_SUGGESTIONS;

  draftText = signal('');
  picked = signal<IaDemoSuggestion | null>(null);
  suggestFocus = signal(false);
  /** Última respuesta estructurada (sustituye la lista antigua). */
  lastResult = signal<IaRunResult | null>(null);
  aiPhase = signal<string | null>(null);

  readonly filteredSuggestions = computed(() => {
    const raw = this.draftText().trim();
    if (!raw.length) return this.allSuggestions;
    const q = normalizeSearch(raw);
    const words = q.split(/\s+/).filter((w) => w.length >= 2);
    return this.allSuggestions.filter((s) => {
      const hay = normalizeSearch(`${s.preview} ${s.matchHints}`);
      if (hay.includes(q)) return true;
      if (!words.length) return false;
      return words.every((w) => hay.includes(w));
    });
  });

  readonly showSuggestPanel = computed(() => {
    if (!this.suggestFocus() || this.picked() || this.aiPhase()) return false;
    return this.filteredSuggestions().length > 0;
  });

  readonly canRunIa = computed(() => this.picked() !== null && !this.aiPhase());

  onCaptureFocusIn(): void {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = undefined;
    }
    this.suggestFocus.set(true);
  }

  scheduleCaptureBlur(): void {
    if (this.blurTimer) clearTimeout(this.blurTimer);
    this.blurTimer = setTimeout(() => {
      this.suggestFocus.set(false);
      this.blurTimer = undefined;
    }, 200);
  }

  onDraftChange(value: string): void {
    this.draftText.set(value);
    const p = this.picked();
    if (p && normalizeSearch(value) !== normalizeSearch(p.preview)) {
      this.picked.set(null);
    }
  }

  private blurActiveElement(): void {
    if (typeof document === 'undefined') return;
    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
  }

  /** Ancho relativo de barra (0–100) respecto al máximo del conjunto. */
  barPercent(row: IaStatusBarRow, rows: IaStatusBarRow[]): number {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return Math.round((row.value / max) * 100);
  }

  private porVencerSoonTasks(tasks: Task[]): Task[] {
    return tasks.filter((t) => {
      const st = this.workflow.getEffectiveStatus(t);
      if (['Completada', 'Liberada', 'Cancelada', 'Vencida'].includes(st)) return false;
      const due = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
      const diff = due.getTime() - Date.now();
      return diff >= 0 && diff <= 72 * 3600 * 1000;
    });
  }

  pickSuggestion(s: IaDemoSuggestion): void {
    if (this.aiPhase()) return;
    this.blurActiveElement();
    this.picked.set(s);
    this.draftText.set(s.preview);
    this.suggestFocus.set(false);
    void this.runIaDemo();
  }

  private motionFactor(): number {
    if (typeof window === 'undefined') return 1;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  private async runAiPhases(): Promise<void> {
    const f = this.motionFactor();
    this.aiPhase.set('Leyendo contexto del espacio de trabajo…');
    await this.sleep(Math.round(420 * f));
    this.aiPhase.set('Analizando tareas y proyectos visibles…');
    await this.sleep(Math.round(880 * f));
    this.aiPhase.set('Preparando resultado y acciones sugeridas…');
    await this.sleep(Math.round(520 * f));
  }

  async runIaDemo(): Promise<void> {
    const slot = this.picked();
    if (!slot || this.aiPhase()) return;

    if (slot.kind === 'accion' && !this.connectivity.isOnline()) {
      this.snackBar.open('Sin conexión: no se pueden crear tareas o proyectos.', 'Cerrar', { duration: 3500 });
      this.picked.set(null);
      this.draftText.set('');
      return;
    }

    await this.runAiPhases();

    try {
      const result = this.finalizeResult(this.executeSuggestion(slot));
      this.lastResult.set(result);
      if (slot.kind === 'accion') {
        this.snackBar.open('Cambio aplicado correctamente.', 'Cerrar', { duration: 3200 });
      }
    } catch (e) {
      this.snackBar.open((e as Error).message || 'No se pudo completar la acción.', 'Cerrar', { duration: 4000 });
    } finally {
      this.aiPhase.set(null);
      this.draftText.set('');
      this.picked.set(null);
    }
  }

  /** Enlace a Tareas con filtro IA; `label` es el texto del botón, `opLabel` el hint en la URL. */
  private tasksLink(
    label: string,
    opLabel: string,
    extra: Record<string, string | null> = {}
  ): IaActionLink {
    return {
      label,
      routerLink: ['/tareas'],
      queryParams: {
        from: 'ia',
        opLabel,
        quick: null,
        status: null,
        assigneeId: null,
        search: null,
        ...extra
      }
    };
  }

  /** Evita dos botones idénticos si la misma ruta y query se repiten. */
  private dedupeLinks(links: IaActionLink[]): IaActionLink[] {
    const seen = new Set<string>();
    const out: IaActionLink[] = [];
    for (const l of links) {
      const key = `${l.routerLink.join('/')}|${JSON.stringify(l.queryParams ?? {})}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(l);
    }
    return out;
  }

  private finalizeResult(r: IaRunResult): IaRunResult {
    return { ...r, links: this.dedupeLinks(r.links) };
  }

  private tasksScoped(): Task[] {
    return this.taskService.tasks();
  }

  private executeSuggestion(slot: IaDemoSuggestion): IaRunResult {
    switch (slot.id) {
      case 'tasks-assignee-maria':
        return this.queryTasksForAssignee('user-1', 'Maria');
      case 'tasks-assignee-carlos':
        return this.queryCarlosLoad();
      case 'overdue-list':
        return this.queryOverdueTitles();
      case 'projects-active':
        return this.queryActiveProjects();
      case 'board-snapshot':
        return this.queryBoardSnapshot();
      case 'workload-top':
        return this.queryWorkloadTop();
      case 'create-task-urgent-inventory':
        return this.mutateCreateInventoryTask();
      case 'create-task-acme':
        return this.mutateCreateAcmeTask();
      case 'create-project-pilot':
        return this.mutateCreatePilotProject();
      case 'create-task-alignment':
        return this.mutateCreateAlignmentTask();
      default:
        return { headline: 'No se reconoció la instrucción.', links: [] };
    }
  }

  private queryTasksForAssignee(userId: string, label: string): IaRunResult {
    const list = this.tasksScoped().filter((t) => t.assigneeId === userId);
    if (!list.length) {
      return {
        headline: `No hay tareas visibles para ${label} en el alcance actual.`,
        body: 'Prueba cambiar la unidad organizativa en la barra superior o revisa el tenant activo.',
        links: [this.tasksLink('Ver todas las tareas', 'Sin filtro', {})]
      };
    }
    const previews = list.slice(0, this.previewLimit);
    return {
      headline: `${list.length} tarea(s) asignadas a ${label} en el alcance actual.`,
      body:
        list.length > this.previewLimit
          ? `Vista previa: ${this.previewLimit} de ${list.length}. Abre el listado para ver todas.`
          : undefined,
      taskPreviews: previews,
      links: [
        this.tasksLink(`Solo tareas de ${label}`, `${label}: responsable`, {
          assigneeId: userId,
          quick: null
        })
      ]
    };
  }

  private queryCarlosLoad(): IaRunResult {
    const uid = 'user-2';
    const list = this.tasksScoped().filter((t) => t.assigneeId === uid);
    const open = (s: TaskStatus) => !['Completada', 'Liberada', 'Cancelada'].includes(s);
    let pend = 0;
    let prog = 0;
    for (const t of list) {
      const st = this.workflow.getEffectiveStatus(t);
      if (!open(st)) continue;
      if (st === 'Pendiente') pend++;
      else if (st === 'En Progreso') prog++;
    }
    const openTotal = pend + prog;
    const openList = list
      .filter((t) => {
        const st = this.workflow.getEffectiveStatus(t);
        return st === 'Pendiente' || st === 'En Progreso';
      })
      .slice(0, this.previewLimit);
    return {
      headline: `Carlos tiene ${openTotal} tarea(s) abiertas (Pendiente: ${pend}, En progreso: ${prog}).`,
      body: `En total aparecen ${list.length} tareas con Carlos como responsable (incluye cerradas).`,
      statusBars: [
        { label: 'Pendiente', value: pend },
        { label: 'En progreso', value: prog }
      ],
      taskPreviews: openList.length ? openList : list.slice(0, this.previewLimit),
      links: [
        this.tasksLink('Todas las tareas de Carlos', 'Carlos: todas', { assigneeId: uid, quick: null }),
        this.tasksLink('Pendientes de Carlos', 'Carlos: pendientes', {
          assigneeId: uid,
          quick: null,
          status: 'Pendiente'
        }),
        this.tasksLink('En progreso · Carlos', 'Carlos: en progreso', {
          assigneeId: uid,
          quick: null,
          status: 'En Progreso'
        })
      ]
    };
  }

  private queryOverdueTitles(): IaRunResult {
    const list = this.tasksScoped().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida');
    if (!list.length) {
      return {
        headline: 'No hay tareas vencidas en el conjunto actual.',
        links: [this.tasksLink('Ver lista de tareas', 'Sin filtro', {})]
      };
    }
    const previews = list.slice(0, this.previewLimit);
    return {
      headline: `Hay ${list.length} tarea(s) con estado efectivo Vencida.`,
      body:
        list.length > this.previewLimit
          ? `Vista previa: ${this.previewLimit} de ${list.length}. Usa el acceso para revisar el resto.`
          : undefined,
      taskPreviews: previews,
      statusBars: [{ label: 'Vencidas', value: list.length }],
      links: [
        this.tasksLink('Solo tareas vencidas', 'Filtro vencidas', {
          quick: 'vencidas',
          assigneeId: null
        })
      ]
    };
  }

  private queryActiveProjects(): IaRunResult {
    const projects = this.projectService.getProjects();
    const active = projects.filter((p) => p.status === 'Activo' || p.status === 'En curso');
    const table: IaProjectRow[] = active.slice(0, this.previewLimit).map((p) => ({
      id: p.id,
      name: p.name,
      status: String(p.status ?? '—')
    }));
    return {
      headline: `Proyectos en alcance: ${projects.length}. Activos o en curso: ${active.length}.`,
      body:
        active.length === 0
          ? 'No hay proyectos activos o en curso en el alcance seleccionado.'
          : active.length > this.previewLimit
            ? `Tabla: ${this.previewLimit} de ${active.length} proyectos activos o en curso.`
            : undefined,
      projectTable: table.length ? table : undefined,
      statusBars: active.length ? [{ label: 'Activos + en curso', value: active.length }] : undefined,
      links: [
        {
          label: 'Ir a Proyectos',
          routerLink: ['/proyectos'],
          queryParams: {}
        }
      ]
    };
  }

  private queryBoardSnapshot(): IaRunResult {
    const counts = new Map<string, number>();
    for (const t of this.tasksScoped()) {
      const st = this.workflow.getEffectiveStatus(t);
      counts.set(st, (counts.get(st) ?? 0) + 1);
    }
    const pick = (s: TaskStatus) => counts.get(s) ?? 0;
    const ordered: TaskStatus[] = [
      'Pendiente',
      'En Progreso',
      'En Espera',
      'Vencida',
      'Completada',
      'Liberada',
      'Cancelada',
      'Rechazada'
    ];
    const statusBars: IaStatusBarRow[] = ordered
      .map((s) => ({ label: s, value: pick(s) }))
      .filter((r) => r.value > 0);
    return {
      headline: 'Resumen de estados (efectivos) en tus tareas visibles.',
      body: 'Distribución por estado (solo barras con conteo > 0).',
      statusBars: statusBars.length ? statusBars : [{ label: 'Sin tareas en alcance', value: 0 }],
      links: [
        {
          label: 'Ver tablero operativo',
          routerLink: ['/tablero'],
          queryParams: {}
        },
        this.tasksLink('Lista completa de tareas', 'Desde snapshot', {})
      ]
    };
  }

  private queryWorkloadTop(): IaRunResult {
    const map = new Map<string, { name: string; n: number }>();
    for (const t of this.tasksScoped()) {
      const st = this.workflow.getEffectiveStatus(t);
      if (['Completada', 'Liberada', 'Cancelada'].includes(st)) continue;
      const id = t.assigneeId || '—';
      const cur = map.get(id) ?? { name: t.assignee || 'Sin asignar', n: 0 };
      cur.n++;
      map.set(id, cur);
    }
    const sorted = [...map.entries()].sort((a, b) => b[1].n - a[1].n);
    if (!sorted.length) {
      return {
        headline: 'No hay tareas abiertas para calcular carga por responsable.',
        links: [this.tasksLink('Ver todas las tareas', 'Sin filtro', {})]
      };
    }
    const workloadTable: IaWorkloadRow[] = sorted.slice(0, this.previewLimit).map(([id, v]) => ({
      name: v.name,
      open: v.n,
      assigneeId: id === '—' ? null : id
    }));
    const topId = sorted[0][0];
    const links: IaActionLink[] = [
      {
        label: `Ver tareas de ${sorted[0][1].name}`,
        routerLink: ['/tareas'],
        queryParams:
          topId && topId !== '—'
            ? { from: 'ia', opLabel: `Carga: ${sorted[0][1].name}`, assigneeId: topId, quick: null }
            : { from: 'ia', opLabel: 'Tareas abiertas', quick: null, assigneeId: null }
      },
      this.tasksLink('Ver todas las tareas', 'Sin filtro', {})
    ];
    return {
      headline: 'Ranking aproximado de carga (tareas no cerradas).',
      body: 'Ordenado por cantidad de tareas abiertas en el alcance actual.',
      workloadTable,
      links
    };
  }

  private mutateCreateInventoryTask(): IaRunResult {
    const assigneeId = 'user-4';
    const u = this.dataService.getUsers().find((x) => x.id === assigneeId);
    const t = this.buildAndCreateTask({
      title: 'Revisión urgente de inventario',
      description: 'Generada por el Asistente de IA (demo). Checklist de conteos y discrepancias.',
      assigneeId,
      assignee: u?.name ?? 'Felipe',
      priority: 'Alta',
      days: 4,
      tags: ['IA', 'Inventario', 'Urgente']
    });
    return {
      headline: `Listo: «${t.title}» quedó registrada con prioridad ${t.priority}.`,
      body: `Folio ${t.folio} · Responsable: ${t.assignee}.`,
      taskPreviews: [t],
      links: [
        {
          label: 'Abrir esta tarea',
          routerLink: ['/tareas', t.id],
          queryParams: {}
        },
        this.tasksLink(`Más tareas de ${t.assignee}`, `Responsable: ${t.assignee}`, {
          assigneeId: t.assigneeId,
          quick: null
        })
      ]
    };
  }

  private mutateCreateAcmeTask(): IaRunResult {
    const assigneeId = 'user-1';
    const u = this.dataService.getUsers().find((x) => x.id === assigneeId);
    const t = this.buildAndCreateTask({
      title: 'Seguimiento comercial — cliente ACME',
      description: 'Demo IA: próximos pasos, cotización y cierre de brechas con ACME.',
      assigneeId,
      assignee: u?.name ?? 'Maria',
      priority: 'Media',
      days: 7,
      tags: ['IA', 'ACME', 'Comercial']
    });
    return {
      headline: `Tarea comercial creada para ${t.assignee}.`,
      body: `«${t.title}» · ${t.folio}.`,
      taskPreviews: [t],
      links: [
        { label: 'Abrir esta tarea', routerLink: ['/tareas', t.id], queryParams: {} },
        this.tasksLink('Tareas de Maria', 'Maria: responsable', { assigneeId: 'user-1', quick: null })
      ]
    };
  }

  private mutateCreatePilotProject(): IaRunResult {
    const ownerId = 'user-3';
    const owner = this.dataService.getUsers().find((x) => x.id === ownerId);
    const orgId = this.orgService.selectedOrgUnitId() || undefined;
    const project = this.projectService.createProject({
      name: 'Proyecto piloto · Optimización de surtido',
      description:
        'Iniciativa demo creada desde el Asistente de IA. Objetivos: surtido, rotación y acuerdos con proveedores.',
      owner: owner?.name ?? 'Karen',
      ownerId,
      status: 'En curso' as ProjectStatus,
      members: [{ userId: ownerId, role: 'Líder' }],
      tags: ['IA', 'piloto', 'surtido'],
      filesMeta: [],
      milestones: [],
      primaryOrgUnitId: orgId
    });
    return {
      headline: `Proyecto «${project.name}» creado.`,
      body: `Líder: ${project.owner}. Identificador ${project.id}.`,
      projectTable: [{ id: project.id, name: project.name, status: String(project.status ?? '—') }],
      links: [
        {
          label: 'Abrir este proyecto',
          routerLink: ['/proyectos', project.id],
          queryParams: {}
        },
        { label: 'Lista de proyectos', routerLink: ['/proyectos'], queryParams: {} }
      ]
    };
  }

  private mutateCreateAlignmentTask(): IaRunResult {
    const assigneeId = 'user-7';
    const u = this.dataService.getUsers().find((x) => x.id === assigneeId);
    const t = this.buildAndCreateTask({
      title: 'Bloque: reunión de alineación — operaciones',
      description: 'Demo IA: coordinar hitos, riesgos y capacidad con el equipo de operaciones.',
      assigneeId,
      assignee: u?.name ?? 'Diego',
      priority: 'Alta',
      days: 2,
      tags: ['IA', 'Operaciones', 'Reunión']
    });
    return {
      headline: `Quedó agendada la tarea de alineación para ${t.assignee}.`,
      body: `«${t.title}» · ${t.folio}.`,
      taskPreviews: [t],
      links: [
        { label: 'Abrir esta tarea', routerLink: ['/tareas', t.id], queryParams: {} },
        this.tasksLink('Tareas de Diego', 'Diego: responsable', { assigneeId: 'user-7', quick: null })
      ]
    };
  }

  private buildAndCreateTask(opts: {
    title: string;
    description: string;
    assigneeId: string;
    assignee: string;
    priority: Priority;
    days: number;
    tags: string[];
  }): Task {
    const folio = `IA-${String(Date.now()).slice(-8)}`;
    const dueDate = addDaysBase(new Date(), opts.days);
    const tid = this.tenantContext.currentTenantId() ?? 'tenant-1';
    const orgId = this.orgService.selectedOrgUnitId() || undefined;
    return this.taskService.createTask({
      tenantId: tid,
      folio,
      title: opts.title,
      description: opts.description,
      assignee: opts.assignee,
      assigneeId: opts.assigneeId,
      status: 'Pendiente',
      priority: opts.priority,
      dueDate,
      riskIndicator: 'ok',
      tags: opts.tags,
      attachmentsCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      createdBy: this.currentUser.id,
      createdByName: this.currentUser.name,
      orgUnitId: orgId,
      history: []
    });
  }

  async quickQuery(type: string): Promise<void> {
    if (this.aiPhase()) return;
    this.blurActiveElement();
    this.suggestFocus.set(false);

    const tasks = this.tasksScoped();
    const vencidas = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length;
    const porVencerSoon = tasks.filter((t) => {
      const st = this.workflow.getEffectiveStatus(t);
      if (['Completada', 'Liberada', 'Cancelada', 'Vencida'].includes(st)) return false;
      const due = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate);
      const diff = due.getTime() - Date.now();
      return diff >= 0 && diff <= 72 * 3600 * 1000;
    }).length;

    const map = new Map<string, number>();
    for (const t of tasks) {
      const st = this.workflow.getEffectiveStatus(t);
      if (['Completada', 'Liberada', 'Cancelada'].includes(st)) continue;
      const id = t.assigneeId || '—';
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    const topLine = sorted
      .slice(0, 3)
      .map(([id, n]) => {
        const name = tasks.find((x) => x.assigneeId === id)?.assignee ?? id;
        return `${name} (${n})`;
      })
      .join(' · ');

    await this.runAiPhases();

    try {
      if (type === 'vencidas') {
        const overdueList = tasks.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida');
        const previews = overdueList.slice(0, this.previewLimit);
        this.lastResult.set(
          this.finalizeResult({
            headline: `Hay ${vencidas} tarea(s) vencidas en el alcance actual.`,
            body:
              overdueList.length > this.previewLimit
                ? `Vista previa: ${this.previewLimit} de ${overdueList.length}. Revisa el detalle para reagendar.`
                : 'Puedes revisarlas y reagendar desde el detalle de cada una.',
            taskPreviews: previews.length ? previews : undefined,
            statusBars: vencidas ? [{ label: 'Vencidas', value: vencidas }] : undefined,
            links: [
              this.tasksLink('Solo vencidas', 'Filtro vencidas', { quick: 'vencidas', assigneeId: null }),
              this.tasksLink('Ver todas las tareas', 'Sin filtro', {})
            ]
          })
        );
        return;
      }
      if (type === 'por-vencer') {
        const soonList = this.porVencerSoonTasks(tasks);
        const previews = soonList.slice(0, this.previewLimit);
        this.lastResult.set(
          this.finalizeResult({
            headline: `Hay ${porVencerSoon} tarea(s) con vencimiento en las próximas 72 horas (no cerradas).`,
            body:
              soonList.length > this.previewLimit
                ? `Vista previa: ${this.previewLimit} de ${soonList.length}.`
                : 'Incluye riesgo “por vencer” según la lógica del tablero.',
            taskPreviews: previews.length ? previews : undefined,
            statusBars: porVencerSoon ? [{ label: 'Vencen en 72h', value: porVencerSoon }] : undefined,
            links: [
              this.tasksLink('Por vencer (72h)', 'Filtro por vencer', { quick: 'por-vencer', assigneeId: null }),
              this.tasksLink('Ver todas las tareas', 'Sin filtro', {})
            ]
          })
        );
        return;
      }
      if (type === 'carga') {
        const workloadTable: IaWorkloadRow[] = sorted.slice(0, this.previewLimit).map(([id, n]) => ({
          name: tasks.find((x) => x.assigneeId === id)?.assignee ?? (id === '—' ? 'Sin asignar' : id),
          open: n,
          assigneeId: id === '—' ? null : id
        }));
        this.lastResult.set(
          this.finalizeResult({
            headline: topLine ? `Carga abierta aproximada: ${topLine}.` : 'No hay tareas abiertas para agrupar.',
            body: topLine ? 'Ranking por tareas abiertas (no cerradas) en el alcance actual.' : undefined,
            workloadTable: workloadTable.length ? workloadTable : undefined,
            links: topLine
              ? [
                  {
                    label: 'Ver top responsable',
                    routerLink: ['/tareas'],
                    queryParams: {
                      from: 'ia',
                      opLabel: 'Carga: top',
                      assigneeId: sorted[0][0] !== '—' ? sorted[0][0] : null,
                      quick: null
                    }
                  },
                  { label: 'Tablero operativo', routerLink: ['/tablero'], queryParams: {} }
                ]
              : [this.tasksLink('Ver todas las tareas', 'Sin filtro', {})]
          })
        );
        return;
      }
      if (type === 'snapshot') {
        this.lastResult.set(this.finalizeResult(this.queryBoardSnapshot()));
        return;
      }
      if (type === 'proyectos') {
        this.lastResult.set(this.finalizeResult(this.queryActiveProjects()));
      }
    } finally {
      this.aiPhase.set(null);
      this.picked.set(null);
      this.draftText.set('');
    }
  }
}
