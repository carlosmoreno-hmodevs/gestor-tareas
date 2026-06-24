import { Component, inject, computed, signal, OnInit, OnDestroy, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { CommitmentApiService } from '../../../core/api/commitment-api.service';
import { ContactsApiService } from '../../../core/api/contacts-api.service';
import { PermissionService } from '../../../core/auth/permission.service';
import { DataService } from '../../../core/services/data.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { AutomationService } from '../../../core/services/automation.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { mapGamoraApiError } from '../../../core/api/gamora-api-error.mapper';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ProjectService } from '../../../core/services/project.service';
import { TaskPageLayoutService } from '../../../core/services/task-page-layout.service';
import { KanbanBoardComponent } from '../../../shared/components/kanban-board/kanban-board.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TaskCardComponent } from '../../../shared/components/task-card/task-card.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { PriorityPillComponent } from '../../../shared/components/priority-pill/priority-pill.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { GamoraKanbanBoardComponent } from '../../../shared/components/gamora-kanban-board/gamora-kanban-board.component';
import { NotificationsRefreshService } from '../../../core/services/notifications-refresh.service';
import type { CommitmentListParams } from '../../../shared/models/commitment.model';
import { gamoraStatusesForUiFilter, gamoraStatusLabel } from '../../../core/api/gamora-status-filters';
import type { TaskStatus, Priority, Task } from '../../../shared/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatCardModule,
    KanbanBoardComponent,
    GamoraKanbanBoardComponent,
    EmptyStateComponent,
    AvatarComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  readonly taskService = inject(TaskService);
  private readonly commitmentApi = inject(CommitmentApiService);
  private readonly contactsApi = inject(ContactsApiService);
  readonly permissions = inject(PermissionService);
  private readonly dataService = inject(DataService);
  private readonly projectService = inject(ProjectService);
  private readonly taskPageLayout = inject(TaskPageLayoutService);
  readonly connectivity = inject(ConnectivityService);
  readonly workflow = inject(TaskWorkflowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly automationService = inject(AutomationService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly notificationsRefresh = inject(NotificationsRefreshService);
  readonly currentUser = this.currentUserService.currentUser;

  readonly gamoraSimulatorOpen = signal(false);

  searchText = signal('');
  selectedProjectId = signal('all');
  operationalFilterHint = signal('');
  /** Filtro por responsable (enlaces desde Asistente IA u otros deep links). */
  assigneeFilterId = signal<string | null>(null);

  /** Simulador Gamora (Fase 1+) — solo tenant conectado a API */
  readonly gamoraSimulatorMode = signal<'text' | 'audio'>('text');
  readonly gamoraSimulatorText = signal(
    'Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.'
  );
  readonly gamoraSimulatorTranscript = signal(
    'Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.'
  );
  readonly gamoraSimulateTranscriptionFailure = signal(false);
  readonly gamoraSimulatorBusy = signal(false);
  readonly gamoraSimulatorError = signal<string | null>(null);
  readonly gamoraAwaitingConfirmation = signal(false);
  readonly gamoraChatMessages = signal<
    Array<{
      role: 'user' | 'gamora';
      text: string;
      kind?: 'text' | 'audio';
      transcript?: string;
    }>
  >([]);
  readonly gamoraSimulatorChannelId = signal<string | null>(null);
  readonly gamoraManualTitle = signal('');
  readonly gamoraManualAssigneeId = signal('');
  readonly gamoraAssigneeOptions = signal<Array<{ id: string; displayName: string }>>([]);
  readonly gamoraManualBusy = signal(false);
  readonly gamoraPage = signal(1);
  readonly gamoraPageSize = 20;

  constructor() {
    const destroyRef = inject(DestroyRef);
    effect(
      () => {
        this.taskPageLayout.setTasksFullBleed(this.viewMode() === 'board');
      },
      { allowSignalWrites: true }
    );
    this.route.queryParamMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((params) => {
      const search = params.get('search');
      if (search) this.searchText.set(search);
      const from = params.get('from');
      if (from === 'operativo' || from === 'ia') {
        this.applyOperationalFiltersFromQuery(params);
        if (this.taskService.gamoraApiActive()) {
          void this.reloadGamoraList();
        }
      } else {
        this.operationalFilterHint.set('');
        this.assigneeFilterId.set(null);
      }
      const v = params.get('vista');
      if (v === 'tablero' || v === 'board') {
        this.viewMode.set('board');
      } else if (this.viewMode() === 'board') {
        this.viewMode.set('list');
      }
    });

    effect(() => {
      if (!this.taskService.gamoraApiActive()) return;
      this.searchText();
      this.quickFilter();
      this.statusFilter();
      this.priorityFilter();
      this.assigneeFilterId();
      this.selectedProjectId();
      this.gamoraPage();
      this.viewMode();
      void this.reloadGamoraList();
    });
  }

  ngOnInit(): void {
    const tid = this.tenantContext.currentTenantId();
    if (tid) this.automationService.runEngine(tid);
    if (this.taskService.gamoraApiActive()) {
      void this.loadGamoraSimulatorContext();
    }
  }

  private async loadGamoraSimulatorContext(): Promise<void> {
    try {
      const me = await this.contactsApi.getMe();
      if (me.simulatorExternalId) {
        this.gamoraSimulatorChannelId.set(me.simulatorExternalId);
      }
    } catch {
      this.gamoraSimulatorChannelId.set('luisito-sim');
    }
    if (this.permissions.canCreateCommitment()) {
      try {
        const contacts = await this.contactsApi.list({ activeOnly: true });
        this.gamoraAssigneeOptions.set(
          contacts.map((c) => ({ id: c.id, displayName: c.displayName }))
        );
      } catch {
        this.gamoraAssigneeOptions.set([]);
      }
    }
  }

  ngOnDestroy(): void {
    this.taskPageLayout.setTasksFullBleed(false);
  }

  async refreshGamoraBoard(): Promise<void> {
    this.gamoraSimulatorError.set(null);
    await this.reloadGamoraList();
    await this.taskService.loadGamoraSummary(this.tenantContext.currentTenantId()!);
  }

  private buildGamoraListParams(): CommitmentListParams {
    const params: CommitmentListParams = {};
    const search = this.searchText().trim();
    const qf = this.quickFilter();
    const sfList = this.statusFilter();
    const assigneeOnly = this.assigneeFilterId();

    if (search) params.search = search;
    if (assigneeOnly) params.assigneeContactId = assigneeOnly;

    if (qf === 'vencidas') params.overdue = true;
    else if (qf === 'por-vencer') params.dueWithin48h = true;
    else if (qf === 'sin-asignar') params.unassigned = true;

    if (sfList.length) {
      const statuses: string[] = [];
      for (const sf of sfList) {
        const mapped = gamoraStatusesForUiFilter(sf);
        if (mapped === 'overdue') params.overdue = true;
        else if (mapped?.length) statuses.push(...mapped);
      }
      if (statuses.length) params.status = [...new Set(statuses)].join(',');
    }

    if (this.viewMode() === 'list') {
      params.page = this.gamoraPage();
      params.pageSize = this.gamoraPageSize;
    }

    return params;
  }

  async reloadGamoraList(): Promise<void> {
    const tid = this.tenantContext.currentTenantId();
    if (!tid || !this.taskService.gamoraApiActive()) return;
    const params = this.buildGamoraListParams();
    const hasFilters = Object.keys(params).length > 0;
    await this.taskService.loadGamoraCommitments(tid, hasFilters ? params : undefined);
  }

  gamoraListPageCount = computed(() => {
    const meta = this.taskService.gamoraListMeta();
    if (!meta.pageSize) return 1;
    return Math.max(1, Math.ceil(meta.total / meta.pageSize));
  });

  goGamoraPrevPage(): void {
    if (this.gamoraPage() > 1) this.gamoraPage.update((p) => p - 1);
  }

  goGamoraNextPage(): void {
    if (this.gamoraPage() < this.gamoraListPageCount()) this.gamoraPage.update((p) => p + 1);
  }

  async sendGamoraSimulatorMessage(textOverride?: string): Promise<void> {
    const tid = this.tenantContext.currentTenantId();
    const isConfirmReply = textOverride !== undefined;
    const mode = isConfirmReply ? 'text' : this.gamoraSimulatorMode();
    const text = (textOverride ?? this.gamoraSimulatorText()).trim();
    const transcript = this.gamoraSimulatorTranscript().trim();
    const simulateFailure = this.gamoraSimulateTranscriptionFailure();

    if (!tid) return;
    if (mode === 'text' && !text) return;
    if (mode === 'audio' && !simulateFailure && !transcript) return;

    this.gamoraSimulatorBusy.set(true);
    this.gamoraSimulatorError.set(null);

    if (mode === 'audio' && !isConfirmReply) {
      this.gamoraChatMessages.update((msgs) => [
        ...msgs,
        {
          role: 'user',
          kind: 'audio',
          transcript: simulateFailure ? undefined : transcript,
          text: '🎤 Audio simulado',
        },
      ]);
    } else {
      this.gamoraChatMessages.update((msgs) => [...msgs, { role: 'user', kind: 'text', text }]);
    }

    try {
      const externalId = `ui-${crypto.randomUUID()}`;
      const channelId = this.gamoraSimulatorChannelId() ?? 'luisito-sim';
      const res =
        mode === 'audio' && !isConfirmReply
          ? await this.commitmentApi.sendSimulatorInbound(tid, {
              channel_contact_external_id: channelId,
              external_message_id: externalId,
              message_type: 'audio',
              simulated_transcript: transcript || undefined,
              simulate_transcription_failure: simulateFailure,
            })
          : await this.commitmentApi.sendSimulatorInbound(tid, {
              channel_contact_external_id: channelId,
              text_body: text,
              external_message_id: externalId,
              message_type: 'text',
            });

      this.gamoraChatMessages.update((msgs) => [...msgs, { role: 'gamora', text: res.reply }]);
      this.gamoraAwaitingConfirmation.set(res.awaiting_confirmation);
      if (!isConfirmReply) {
        if (mode === 'text') {
          this.gamoraSimulatorText.set('');
        } else {
          this.gamoraSimulatorTranscript.set('');
          this.gamoraSimulateTranscriptionFailure.set(false);
        }
      }
      if (res.commitment) {
        await this.taskService.refreshFromGamoraApi();
        this.notificationsRefresh.bump();
        this.gamoraAwaitingConfirmation.set(false);
      }
    } catch (err) {
      console.error(err);
      this.gamoraSimulatorError.set(
        'No se pudo enviar al simulador. Verifica que MySQL y el backend estén en ejecución.'
      );
    } finally {
      this.gamoraSimulatorBusy.set(false);
    }
  }

  canSendGamoraSimulator(): boolean {
    if (this.gamoraSimulatorBusy()) return false;
    if (!this.gamoraSimulatorChannelId() && !this.taskService.gamoraApiActive()) return false;
    if (this.gamoraSimulatorMode() === 'audio') {
      return this.gamoraSimulateTranscriptionFailure() || !!this.gamoraSimulatorTranscript().trim();
    }
    return !!this.gamoraSimulatorText().trim();
  }

  async createGamoraManualCommitment(): Promise<void> {
    const tid = this.tenantContext.currentTenantId();
    const title = this.gamoraManualTitle().trim();
    const assigneeId = this.gamoraManualAssigneeId();
    if (!tid || !title || !assigneeId) return;

    this.gamoraManualBusy.set(true);
    this.gamoraSimulatorError.set(null);
    try {
      await this.commitmentApi.createCommitment({
        title,
        assignee_contact_id: assigneeId,
      });
      this.gamoraManualTitle.set('');
      this.gamoraManualAssigneeId.set('');
      await this.taskService.refreshFromGamoraApi();
      this.notificationsRefresh.bump();
      this.gamoraSimulatorError.set(null);
    } catch (err) {
      this.gamoraSimulatorError.set(mapGamoraApiError(err));
    } finally {
      this.gamoraManualBusy.set(false);
    }
  }

  sendGamoraQuickConfirm(answer: 'sí' | 'no'): void {
    void this.sendGamoraSimulatorMessage(answer);
  }

  /** Cambia vista y sincroniza query (?vista=tablero) para enlaces del menú. */
  setViewMode(mode: 'list' | 'calendar' | 'board'): void {
    this.viewMode.set(mode);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: mode === 'board' ? { vista: 'tablero' } : { vista: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private applyOperationalFiltersFromQuery(params: { get(key: string): string | null }): void {
    // Base limpia antes de aplicar el filtro venido de /tablero-operativo o Asistente IA.
    this.quickFilter.set('all');
    this.statusFilter.set([]);
    this.priorityFilter.set([]);
    this.searchText.set('');
    this.selectedProjectId.set('all');
    this.personalTaskScope.set('all');
    this.assigneeFilterId.set(null);

    const quick = params.get('quick');
    const status = params.get('status');
    const priority = params.get('priority');
    const search = params.get('search');
    const project = params.get('project');
    const scope = params.get('scope');
    const label = params.get('opLabel');
    const assigneeId = params.get('assigneeId');
    const from = params.get('from');

    const validQuick: Array<'all' | 'hoy' | 'vencidas' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar'> = [
      'all',
      'hoy',
      'vencidas',
      'por-vencer',
      'esta-semana',
      'alta',
      'sin-asignar'
    ];
    const validStatuses: Array<TaskStatus | 'completadas'> = [
      'Pendiente',
      'En Progreso',
      'En Espera',
      'Vencida',
      'Completada',
      'Liberada',
      'Rechazada',
      'Cancelada',
      'completadas'
    ];
    const validPriorities: Priority[] = ['Alta', 'Media', 'Baja'];

    if (quick && validQuick.includes(quick as (typeof validQuick)[number])) {
      this.quickFilter.set(quick as 'all' | 'hoy' | 'vencidas' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar');
    }
    if (status && validStatuses.includes(status as TaskStatus | 'completadas')) {
      this.statusFilter.set([status as TaskStatus | 'completadas']);
    }
    if (priority && validPriorities.includes(priority as Priority)) {
      this.priorityFilter.set([priority as Priority]);
    }
    if (search?.trim()) {
      this.searchText.set(search.trim());
    }
    if (project?.trim()) {
      this.selectedProjectId.set(project.trim());
    }
    if (scope === 'assigned' || scope === 'created' || scope === 'all') {
      this.personalTaskScope.set(scope);
    }
    if (assigneeId?.trim()) {
      this.assigneeFilterId.set(assigneeId.trim());
    }

    this.operationalFilterHint.set(
      label?.trim()
        ? from === 'ia'
          ? `Desde Asistente IA: ${label}`
          : `Filtro aplicado desde Tablero operativo: ${label}`
        : from === 'ia'
          ? 'Filtro aplicado desde Asistente IA'
          : 'Filtro aplicado desde Tablero operativo'
    );
  }

  clearOperationalFilterContext(): void {
    this.operationalFilterHint.set('');
    this.quickFilter.set('all');
    this.statusFilter.set([]);
    this.priorityFilter.set([]);
    this.searchText.set('');
    this.selectedProjectId.set('all');
    this.personalTaskScope.set('all');
    this.assigneeFilterId.set(null);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        from: null,
        opLabel: null,
        quick: null,
        status: null,
        priority: null,
        search: null,
        project: null,
        scope: null,
        assigneeId: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  quickFilter = signal<'all' | 'hoy' | 'vencidas' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar'>('all');
  /** Estados seleccionados (varios se combinan con OR). Vacío = sin filtro por estado. */
  statusFilter = signal<(TaskStatus | 'completadas')[]>([]);
  /** Prioridades seleccionadas (varias se combinan con OR). Vacío = sin filtro por prioridad. */
  priorityFilter = signal<Priority[]>([]);
  viewMode = signal<'list' | 'calendar' | 'board'>('list');

  /** Filtro de proyecto solo para la vista Tablero (mis tareas). */
  boardProjectId = signal('all');
  personalTaskScope = signal<'all' | 'assigned' | 'created'>('all');

  /** Tablero Kanban: mismas reglas que en Mi tablero. */
  myTasks = computed(() => {
    const uid = this.currentUser().id;
    const scope = this.personalTaskScope();
    if (scope === 'assigned') {
      return this.taskService.tasks().filter((t) => t.assigneeId === uid);
    }
    if (scope === 'created') {
      return this.taskService.tasks().filter((t) => t.createdBy === uid);
    }
    return this.taskService.tasks().filter((t) => t.assigneeId === uid || t.createdBy === uid);
  });

  myProjectOptions = computed(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const t of this.myTasks()) {
      const pid = t.projectId;
      if (!pid) continue;
      const project = this.projectService.getProjectById(pid);
      const current = map.get(pid);
      if (current) {
        current.count += 1;
      } else {
        map.set(pid, { id: pid, name: project?.name ?? pid, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  myTasksByProject = computed(() => {
    const pid = this.boardProjectId();
    if (pid === 'all') return this.myTasks();
    return this.myTasks().filter((t) => t.projectId === pid);
  });

  /** Kanban personal: ámbito/proyecto + mismos criterios que la lista (filtro rápido, estado KPI/sidebar). */
  myTasksFiltered = computed(() => {
    let list = this.myTasksByProject();
    const search = this.searchText().toLowerCase();
    const qf = this.quickFilter();
    const sfList = this.statusFilter();
    const pfList = this.priorityFilter();
    const w = this.workflow;

    if (search) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.folio.toLowerCase().includes(search) ||
          t.assignee.toLowerCase().includes(search)
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (qf === 'hoy') {
      list = list.filter((t) => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    } else if (qf === 'vencidas') {
      list = list.filter((t) => w.getEffectiveStatus(t) === 'Vencida');
    } else if (qf === 'por-vencer') {
      list = list.filter(
        (t) =>
          t.riskIndicator === 'por-vencer' &&
          !['Completada', 'Liberada', 'Cancelada'].includes(w.getEffectiveStatus(t))
      );
    } else if (qf === 'esta-semana') {
      const weekStart = new Date(today);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const startT = weekStart.getTime();
      const endT = weekEnd.getTime();
      list = list.filter((t) => {
        const d = new Date(t.dueDate).getTime();
        return d >= startT && d <= endT;
      });
    } else if (qf === 'alta') {
      list = list.filter((t) => t.priority === 'Alta');
    } else if (qf === 'sin-asignar') {
      list = list.filter((t) => !t.assignee || t.assignee === 'Sin asignar');
    }

    if (sfList.length > 0) {
      list = list.filter((t) => {
        const eff = w.getEffectiveStatus(t);
        return sfList.some((sf) =>
          sf === 'completadas' ? ['Completada', 'Liberada'].includes(eff) : eff === sf
        );
      });
    }
    if (pfList.length > 0) {
      list = list.filter((t) => pfList.includes(t.priority));
    }
    return list;
  });

  personalTaskScopeLabel = computed(() => {
    const scope = this.personalTaskScope();
    if (scope === 'assigned') return 'Solo asignadas a mí';
    if (scope === 'created') return 'Solo creadas por mí';
    return 'Asignadas a mí + creadas por mí';
  });

  boardTitle = computed(() => {
    const pid = this.boardProjectId();
    if (pid === 'all') return 'Todas mis tareas';
    const option = this.myProjectOptions().find((p) => p.id === pid);
    return option ? option.name : 'Todas mis tareas';
  });

  boardSubtitle = computed(() => {
    const scopeInfo = this.personalTaskScopeLabel();
    return this.boardProjectId() === 'all'
      ? `Vista tipo tablero por estado · ${scopeInfo}`
      : `Vista tipo tablero del proyecto seleccionado · ${scopeInfo}`;
  });

  calendarGranularity = signal<'month' | 'week' | 'day'>('month');
  calendarCursor = signal(new Date());
  /** Mismo criterio que en Mi tablero: Todas = asignadas o creadas por mí. */
  calendarTaskScope = signal<'all' | 'assigned' | 'created'>('all');
  /** Orden de la lista (como en detalle de proyecto). */
  sortOrder = signal<'default' | 'vencidas-primero' | 'fecha' | 'estado' | 'prioridad' | 'recientes'>('default');

  kanbanColumns: { status: TaskStatus; label: string }[] = [
    { status: 'Pendiente', label: 'Pendiente' },
    { status: 'En Progreso', label: 'En Progreso' },
    { status: 'En Espera', label: 'En Espera' },
    { status: 'Vencida', label: 'Vencida' },
    { status: 'Completada', label: 'Completada' },
    { status: 'Liberada', label: 'Liberada' },
    { status: 'Rechazada', label: 'Rechazada' },
    { status: 'Cancelada', label: 'Cancelada' }
  ];

  statuses = this.dataService.getStatuses();
  priorities = this.dataService.getPriorities();
  users = this.dataService.usersForCurrentOrg;
  projects = this.dataService.projectsForCurrentOrg;
  projectFilterOptions = computed(() => {
    const counts = new Map<string, number>();
    for (const t of this.taskService.tasks()) {
      if (!t.projectId) continue;
      counts.set(t.projectId, (counts.get(t.projectId) ?? 0) + 1);
    }
    return this.projects()
      .filter((p) => counts.has(p.id))
      .map((p) => ({ id: p.id, name: p.name, count: counts.get(p.id) ?? 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
  displayedColumns = ['folio', 'title', 'assignee', 'status', 'priority', 'dueDate', 'risk', 'counts'];

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  getEffectiveStatus(task: import('../../../shared/models').Task) {
    return this.workflow.getEffectiveStatus(task);
  }

  getDisplayStatus(task: import('../../../shared/models').Task): string {
    if (this.taskService.gamoraApiActive()) {
      return gamoraStatusLabel(task.gamoraStatus ?? task.observations ?? '');
    }
    return String(this.getEffectiveStatus(task));
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    if (this.taskService.gamoraApiActive()) {
      this.gamoraPage.set(1);
    }
  }

  activeCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.active ?? 0;
    }
    return this.taskService.tasks().filter((t) => !['Completada', 'Liberada', 'Cancelada'].includes(t.status)).length;
  });
  dueSoonCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.dueWithin48h ?? 0;
    }
    return this.taskService.tasks().filter(
      (t) =>
        t.riskIndicator === 'por-vencer' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length;
  });
  overdueCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.overdue ?? 0;
    }
    return this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida').length;
  });

  pendingCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.byStatus.assigned ?? 0;
    }
    return this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Pendiente').length;
  });
  inProgressCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      const s = this.taskService.gamoraSummary()?.byStatus;
      if (!s) return 0;
      return s.accepted + s.evidence_submitted + s.in_review + s.corrected;
    }
    return this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'En Progreso').length;
  });
  enEsperaCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.byStatus.correction_requested ?? 0;
    }
    return this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'En Espera').length;
  });
  completedCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.byStatus.closed ?? 0;
    }
    return this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Completada').length;
  });
  liberadasCount = computed(() =>
    this.taskService.tasks().filter((t) => this.workflow.getEffectiveStatus(t) === 'Liberada').length
  );

  hoyCount = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskService.tasks().filter((t) => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime() && !['Completada', 'Liberada', 'Cancelada'].includes(t.status);
      }).length;
  });

  /** Tareas con vencimiento esta semana (para filtro rápido, distinto de las tarjetas KPI). */
  estaSemanaCount = computed(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(start);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return this.taskService.tasks().filter((t) => {
      const d = new Date(t.dueDate).getTime();
      return d >= weekStart.getTime() && d <= weekEnd.getTime();
    }).length;
  });

  vencidasCount = computed(() => this.overdueCount());
  altaCount = computed(() =>
    this.taskService.tasks().filter(
      (t) => t.priority === 'Alta' && !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length
  );
  sinAsignarCount = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.gamoraSummary()?.unassigned ?? 0;
    }
    return this.taskService.tasks().filter(
      (t) =>
        (!t.assignee || t.assignee === 'Sin asignar') &&
        !['Completada', 'Liberada', 'Cancelada'].includes(t.status)
    ).length;
  });

  allFilter = (): void => {
    this.quickFilter.set('all');
    this.statusFilter.set([]);
    this.priorityFilter.set([]);
    this.selectedProjectId.set('all');
    this.gamoraPage.set(1);
  };

  tasksByStatus = computed(() => {
    const tasks = this.filteredTasks();
    const map = new Map<TaskStatus, import('../../../shared/models').Task[]>();
    for (const col of this.kanbanColumns) {
      map.set(col.status, []);
    }
    for (const task of tasks) {
      const status = this.workflow.getEffectiveStatus(task);
      const list = map.get(status) ?? [];
      list.push(task);
      map.set(status, list);
    }
    return map;
  });

  filteredTasks = computed(() => {
    if (this.taskService.gamoraApiActive()) {
      return this.taskService.tasks();
    }
    let list = this.taskService.tasks();
    const search = this.searchText().toLowerCase();
    const qf = this.quickFilter();
    const sfList = this.statusFilter();
    const pfList = this.priorityFilter();
    const projectId = this.selectedProjectId();
    const assigneeOnly = this.assigneeFilterId();

    if (projectId !== 'all') {
      list = list.filter((t) => t.projectId === projectId);
    }

    if (assigneeOnly) {
      list = list.filter((t) => t.assigneeId === assigneeOnly);
    }

    if (search) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.folio.toLowerCase().includes(search) ||
          t.assignee.toLowerCase().includes(search)
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (qf === 'hoy') {
      list = list.filter((t) => {
        const d = new Date(t.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    } else if (qf === 'vencidas') {
      list = list.filter((t) => this.workflow.getEffectiveStatus(t) === 'Vencida');
    } else if (qf === 'por-vencer') {
      list = list.filter(
        (t) =>
          t.riskIndicator === 'por-vencer' && !['Completada', 'Liberada', 'Cancelada'].includes(this.workflow.getEffectiveStatus(t))
      );
    } else if (qf === 'esta-semana') {
      const weekStart = new Date(today);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const startT = weekStart.getTime();
      const endT = weekEnd.getTime();
      list = list.filter((t) => {
        const d = new Date(t.dueDate).getTime();
        return d >= startT && d <= endT;
      });
    } else if (qf === 'alta') {
      list = list.filter((t) => t.priority === 'Alta');
    } else if (qf === 'sin-asignar') {
      list = list.filter((t) => !t.assignee || t.assignee === 'Sin asignar');
    }
    if (sfList.length > 0) {
      list = list.filter((t) => {
        const eff = this.workflow.getEffectiveStatus(t);
        return sfList.some((sf) =>
          sf === 'completadas' ? ['Completada', 'Liberada'].includes(eff) : eff === sf
        );
      });
    }
    if (pfList.length > 0) {
      list = list.filter((t) => pfList.includes(t.priority));
    }
    return list;
  });

  /** Tareas filtradas con el orden aplicado (como en proyecto). */
  displayedTasks = computed(() => {
    const list = this.filteredTasks();
    const order = this.sortOrder();
    if (order === 'default') return list;
    const w = this.workflow;
    return [...list].sort((a, b) => {
      if (order === 'vencidas-primero') {
        const aV = w.getEffectiveStatus(a) === 'Vencida' ? 1 : 0;
        const bV = w.getEffectiveStatus(b) === 'Vencida' ? 1 : 0;
        return bV - aV;
      }
      if (order === 'fecha') {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return da - db;
      }
      if (order === 'estado') {
        const sa = w.getEffectiveStatus(a);
        const sb = w.getEffectiveStatus(b);
        return String(sa).localeCompare(String(sb));
      }
      if (order === 'prioridad') {
        const pa = a.priority === 'Alta' ? 3 : a.priority === 'Media' ? 2 : 1;
        const pb = b.priority === 'Alta' ? 3 : b.priority === 'Media' ? 2 : 1;
        return pb - pa;
      }
      if (order === 'recientes') {
        const ca = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const cb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return cb - ca;
      }
      return 0;
    });
  });

  calendarTitle = computed(() => {
    const d = this.calendarCursor();
    const g = this.calendarGranularity();
    const monthFmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
    if (g === 'month') return monthFmt.format(d);
    if (g === 'week') {
      const start = this.startOfWeek(d);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const dayFmt = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' });
      const year = end.getFullYear();
      return `${dayFmt.format(start)} - ${dayFmt.format(end)} ${year}`;
    }
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(d);
  });

  calendarWeekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  maxCalendarTasksPerDay = computed(() => {
    const g = this.calendarGranularity();
    if (g === 'month') return 3;
    if (g === 'week') return 6;
    return 999;
  });

  /** Tareas que ve el calendario (lista ya filtrada + ámbito personal como en /tablero). */
  tasksForCalendar = computed(() => {
    const list = this.displayedTasks();
    if (this.taskService.gamoraApiActive()) {
      return list.filter((t) => t.hasDueDate);
    }
    const uid = this.currentUser().id;
    const scope = this.calendarTaskScope();
    if (scope === 'assigned') {
      return list.filter((t) => t.assigneeId === uid);
    }
    if (scope === 'created') {
      return list.filter((t) => t.createdBy === uid);
    }
    return list.filter((t) => t.assigneeId === uid || t.createdBy === uid);
  });

  calendarTaskScopeLabel = computed(() => {
    const scope = this.calendarTaskScope();
    if (scope === 'assigned') return 'Solo asignadas a ti';
    if (scope === 'created') return 'Solo creadas por ti';
    return 'Asignadas a ti y creadas por ti';
  });

  calendarDays = computed(() => {
    const source = this.tasksForCalendar();
    const cursor = this.calendarCursor();
    const granularity = this.calendarGranularity();
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    let gridStart = new Date(monthStart);
    let gridEnd = new Date(monthEnd);

    if (granularity === 'month') {
      const startOffset = (monthStart.getDay() + 6) % 7;
      gridStart = new Date(monthStart);
      gridStart.setDate(monthStart.getDate() - startOffset);

      const endOffset = 6 - ((monthEnd.getDay() + 6) % 7);
      gridEnd = new Date(monthEnd);
      gridEnd.setDate(monthEnd.getDate() + endOffset);
    } else if (granularity === 'week') {
      gridStart = this.startOfWeek(cursor);
      gridEnd = new Date(gridStart);
      gridEnd.setDate(gridStart.getDate() + 6);
    } else {
      gridStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      gridEnd = new Date(gridStart);
    }

    const taskMap = new Map<string, Task[]>();
    for (const task of source) {
      const key = this.toDateKey(task.dueDate);
      const list = taskMap.get(key) ?? [];
      list.push(task);
      taskMap.set(key, list);
    }
    for (const [, list] of taskMap) {
      list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }

    const days: Array<{
      key: string;
      date: Date;
      dayNumber: number;
      inCurrentMonth: boolean;
      isToday: boolean;
      tasks: Task[];
    }> = [];

    const todayKey = this.toDateKey(new Date());
    const currentMonth = cursor.getMonth();
    const currentYear = cursor.getFullYear();
    const iter = new Date(gridStart);

    while (iter <= gridEnd) {
      const d = new Date(iter);
      const key = this.toDateKey(d);
      days.push({
        key,
        date: d,
        dayNumber: d.getDate(),
        inCurrentMonth: d.getMonth() === currentMonth && d.getFullYear() === currentYear,
        isToday: key === todayKey,
        tasks: taskMap.get(key) ?? []
      });
      iter.setDate(iter.getDate() + 1);
    }

    return days;
  });

  focusedDayTasks = computed(() => {
    const key = this.toDateKey(this.calendarCursor());
    return this.tasksForCalendar()
      .filter((t) => this.toDateKey(t.dueDate) === key)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  openNewTask(): void {
    this.router.navigate(['/tareas', 'nueva']);
  }

  previousCalendarPeriod(): void {
    const d = this.calendarCursor();
    const g = this.calendarGranularity();
    if (g === 'month') {
      this.calendarCursor.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
      return;
    }
    if (g === 'week') {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      this.calendarCursor.set(next);
      return;
    }
    const next = new Date(d);
    next.setDate(next.getDate() - 1);
    this.calendarCursor.set(next);
  }

  nextCalendarPeriod(): void {
    const d = this.calendarCursor();
    const g = this.calendarGranularity();
    if (g === 'month') {
      this.calendarCursor.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
      return;
    }
    if (g === 'week') {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      this.calendarCursor.set(next);
      return;
    }
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    this.calendarCursor.set(next);
  }

  goToCurrentDate(): void {
    const now = new Date();
    const current = this.calendarCursor();
    const granularity = this.calendarGranularity();
    const alreadyInCurrentPeriod =
      granularity === 'month'
        ? this.isSameMonth(current, now)
        : granularity === 'week'
          ? this.isSameWeek(current, now)
          : this.isSameDay(current, now);

    this.calendarCursor.set(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

    // Si ya estaba en el período actual, forzamos una acción visible.
    if (alreadyInCurrentPeriod) {
      this.calendarGranularity.set('day');
    }
  }

  /** Aplicar filtro rápido simplificado. */
  setQuickFilter(filter: 'all' | 'hoy' | 'vencidas' | 'por-vencer' | 'esta-semana' | 'alta' | 'sin-asignar'): void {
    this.quickFilter.set(filter);
  }

  /** Aplicar filtro por estado al hacer clic en las tarjetas KPI (En progreso, En espera, etc.). */
  applyStatusFilter(value: 'Pendiente' | 'En Progreso' | 'En Espera' | 'Vencida' | 'Completada' | 'Liberada'): void {
    if (value === 'Vencida') {
      this.quickFilter.set('vencidas');
      this.statusFilter.set([]);
    } else {
      this.quickFilter.set('all');
      this.statusFilter.set([value]);
    }
  }

  /** Indica si el filtro activo es el de la tarjeta de estado (para resaltar la tarjeta). */
  isStatusFilterActive(value: 'Pendiente' | 'En Progreso' | 'En Espera' | 'Vencida' | 'Completada' | 'Liberada'): boolean {
    if (value === 'Vencida') return this.quickFilter() === 'vencidas';
    const list = this.statusFilter();
    return list.length === 1 && list[0] === value;
  }

  /** Opciones de estado para checkboxes (incluye Completadas). */
  statusFilterOptions: { value: TaskStatus | 'completadas'; label: string }[] = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En Progreso', label: 'En progreso' },
    { value: 'En Espera', label: 'En espera' },
    { value: 'Vencida', label: 'Vencida' },
    { value: 'completadas', label: 'Completadas' },
    { value: 'Completada', label: 'Completada' },
    { value: 'Liberada', label: 'Liberada' },
    { value: 'Rechazada', label: 'Rechazada' },
    { value: 'Cancelada', label: 'Cancelada' }
  ];

  toggleStatus(value: TaskStatus | 'completadas'): void {
    const list = [...this.statusFilter()];
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1);
    else list.push(value);
    this.statusFilter.set(list);
  }

  isStatusChecked(value: TaskStatus | 'completadas'): boolean {
    return this.statusFilter().includes(value);
  }

  clearStatusFilter(): void {
    this.statusFilter.set([]);
  }

  togglePriority(value: Priority): void {
    const list = [...this.priorityFilter()];
    const i = list.indexOf(value);
    if (i >= 0) list.splice(i, 1);
    else list.push(value);
    this.priorityFilter.set(list);
  }

  isPriorityChecked(value: Priority): boolean {
    return this.priorityFilter().includes(value);
  }

  clearPriorityFilter(): void {
    this.priorityFilter.set([]);
  }

  setCalendarGranularity(mode: 'month' | 'week' | 'day'): void {
    this.calendarGranularity.set(mode);
  }

  openCalendarDay(date: Date): void {
    this.calendarCursor.set(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    this.calendarGranularity.set('day');
  }

  private startOfWeek(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const weekday = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - weekday);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  private isSameWeek(a: Date, b: Date): boolean {
    return this.startOfWeek(a).getTime() === this.startOfWeek(b).getTime();
  }

  private toDateKey(value: Date | string): string {
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
