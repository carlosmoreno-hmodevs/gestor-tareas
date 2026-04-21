import { Component, input, computed, inject, signal, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { DataService } from '../../../core/services/data.service';
import { TransitionFeedbackService } from '../../../core/services/transition-feedback.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Task, TaskStatus } from '../../../shared/models';
import { ReasonDialogComponent, type ReasonDialogResult } from '../reason-dialog/reason-dialog.component';

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'Pendiente', label: 'Pendiente' },
  { status: 'En Progreso', label: 'En Progreso' },
  { status: 'En Espera', label: 'En Espera' },
  { status: 'Vencida', label: 'Vencida' },
  { status: 'Completada', label: 'Completada' },
  { status: 'Liberada', label: 'Liberada' },
  { status: 'Rechazada', label: 'Rechazada' },
  { status: 'Cancelada', label: 'Cancelada' }
];

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DragDropModule,
    MatDialogModule,
    MatIconModule,
    AvatarComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements AfterViewInit, OnDestroy {
  readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly dataService = inject(DataService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly transitionFeedback = inject(TransitionFeedbackService);

  tasks = input.required<Task[]>();
  draggable = input(true);
  layoutMode = input<'default' | 'trello'>('default');
  currentUserId = input<string | null>(null);
  highlightOwnership = input(false);

  @ViewChild('boardScroller') private boardScroller?: ElementRef<HTMLDivElement>;
  @ViewChild('externalScroller') private externalScroller?: ElementRef<HTMLDivElement>;
  @ViewChild('externalTrack') private externalTrack?: ElementRef<HTMLDivElement>;

  private syncing = false;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    // Espera un tick para asegurar que inputs/template condicional estén montados.
    setTimeout(() => this.setupExternalScroll());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private setupExternalScroll(): void {
    const board = this.boardScroller?.nativeElement;
    const external = this.externalScroller?.nativeElement;
    const track = this.externalTrack?.nativeElement;
    if (!board || !external || !track) return;

    const syncFromBoard = () => {
      if (this.syncing) return;
      this.syncing = true;
      external.scrollLeft = board.scrollLeft;
      this.syncing = false;
    };
    const syncFromExternal = () => {
      if (this.syncing) return;
      this.syncing = true;
      board.scrollLeft = external.scrollLeft;
      this.syncing = false;
    };
    const updateTrackWidth = () => {
      track.style.width = `${board.scrollWidth}px`;
      const shouldShow = this.layoutMode() === 'trello' && board.scrollWidth > board.clientWidth;
      external.style.display = shouldShow ? 'block' : 'none';
      syncFromBoard();
    };

    board.addEventListener('scroll', syncFromBoard, { passive: true });
    external.addEventListener('scroll', syncFromExternal, { passive: true });

    this.resizeObserver = new ResizeObserver(() => updateTrackWidth());
    this.resizeObserver.observe(board);
    updateTrackWidth();
  }

  columns = KANBAN_COLUMNS;
  columnIds = KANBAN_COLUMNS.map((c) => 'drop-' + c.status.replace(/\s+/g, '-'));
  users = this.dataService.usersForCurrentOrg;

  private sortColumnTasks(status: TaskStatus, list: Task[]): Task[] {
    const base = new Map(list.map((t, idx) => [t.id, idx]));
    return [...list].sort((a, b) => {
      const ra = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const rb = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;
      return (base.get(a.id) ?? 0) - (base.get(b.id) ?? 0);
    });
  }

  private persistColumnOrder(list: Task[]): void {
    list.forEach((task, index) => {
      const nextSortOrder = index + 1;
      if (task.sortOrder === nextSortOrder) return;
      this.taskService.updateTask(task.id, { sortOrder: nextSortOrder });
    });
  }

  tasksByStatus = computed(() => {
    const tasks = this.tasks();
    const map = new Map<TaskStatus, Task[]>();
    for (const col of this.columns) {
      map.set(col.status, []);
    }
    for (const task of tasks) {
      const status = this.workflow.getEffectiveStatus(task);
      const list = map.get(status) ?? [];
      list.push(task);
      map.set(status, list);
    }
    for (const col of this.columns) {
      map.set(col.status, this.sortColumnTasks(col.status, map.get(col.status) ?? []));
    }
    return map;
  });

  getStatusFromContainerId(id: string): TaskStatus | null {
    const slug = id?.replace(/^drop-/, '');
    return this.columns.find((c) => c.status.replace(/\s+/g, '-') === slug)?.status ?? null;
  }

  canDrop = (): boolean => this.draggable() && this.connectivity.isOnline();

  /** Tarea cuyo arrastre está activo; sirve para resaltar columnas válidas / bloqueadas. */
  readonly draggedTask = signal<Task | null>(null);

  /**
   * Coincide con la lógica de `onDrop`: misma columna (reordenar) o transición sin comentario/fecha obligatorios.
   */
  isDropTargetAllowedForStatus(toStatus: TaskStatus): boolean {
    const task = this.draggedTask();
    if (!task) return false;
    const fromStatus = this.workflow.getEffectiveStatus(task);
    if (fromStatus === toStatus) return true;
    const transition = this.workflow.getTransition(task, toStatus);
    if (!transition) return false;
    if (transition.requiresComment || transition.requiresNewDueDate) return false;
    return true;
  }

  onDragStarted(event: { source: { data: unknown } }): void {
    if (!this.canDrop()) return;
    this.draggedTask.set(event.source.data as Task);
  }

  onDragEnded(): void {
    this.draggedTask.set(null);
  }

  getEffectiveStatus(task: Task): TaskStatus {
    return this.workflow.getEffectiveStatus(task);
  }

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  getOwnershipType(task: Task): 'assigned' | 'created' | 'both' | 'none' {
    if (!this.highlightOwnership()) return 'none';
    const uid = this.currentUserId();
    if (!uid) return 'none';
    const assigned = task.assigneeId === uid;
    const created = task.createdBy === uid;
    if (assigned && created) return 'both';
    if (assigned) return 'assigned';
    if (created) return 'created';
    return 'none';
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task = event.item.data as Task;
    const toStatus = this.getStatusFromContainerId(event.container.id);
    if (!toStatus || !this.columns.some((c) => c.status === toStatus)) return;
    const fromStatus = this.getStatusFromContainerId(event.previousContainer.id) ?? this.workflow.getEffectiveStatus(task);
    const sameContainer = event.previousContainer === event.container;

    if (!this.canDrop()) return;

    const fromList = event.previousContainer.data;
    const toList = event.container.data;

    if (sameContainer || fromStatus === toStatus) {
      moveItemInArray(fromList, event.previousIndex, event.currentIndex);
      this.persistColumnOrder(fromList);
      return;
    }

    const transition = this.workflow.getTransition(task, toStatus);
    if (!transition) {
      this.snackBar.open(
        `No se puede cambiar de "${fromStatus}" a "${toStatus}". Usa el detalle de la tarea.`,
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }
    if (transition.requiresComment || transition.requiresNewDueDate) {
      this.snackBar.open(
        `Esta transición requiere comentario. Abre la tarea para completarla.`,
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const needsReasonFromCompletada =
      fromStatus === 'Completada' && (toStatus === 'Liberada' || toStatus === 'Rechazada');

    if (needsReasonFromCompletada) {
      const isLiberar = toStatus === 'Liberada';
      try {
        transferArrayItem(fromList, toList, event.previousIndex, event.currentIndex);
        this.taskService.applyTransition(task.id, toStatus, {});
        this.persistColumnOrder(fromList);
        this.persistColumnOrder(toList);
      } catch (e) {
        transferArrayItem(toList, fromList, event.currentIndex, event.previousIndex);
        this.snackBar.open((e as Error).message || 'Error al cambiar estado', 'Cerrar', {
          duration: 3000
        });
        return;
      }

      const taskAfter = this.taskService.getById(task.id) ?? task;
      const ref = this.dialog.open(ReasonDialogComponent, {
        data: {
          kind: isLiberar ? 'released' : 'rejected',
          task: taskAfter,
          dialogTitle: isLiberar ? 'Liberar tarea' : 'Rechazar tarea',
          confirmLabel: isLiberar ? 'Liberar' : 'Rechazar',
          optionalReason: true
        },
        width: '90vw',
        maxWidth: '440px'
      });
      ref.afterClosed().subscribe((result: ReasonDialogResult | null | undefined) => {
        const reasonPatch = isLiberar ? result?.releaseReason : result?.rejectedReason;
        if (reasonPatch) {
          if (isLiberar) {
            this.taskService.updateTask(task.id, { releaseReason: reasonPatch });
          } else {
            this.taskService.updateTask(task.id, {
              rejectedReason: reasonPatch,
              correctedReason: reasonPatch.label || reasonPatch.customText || undefined
            });
          }
        }
        this.transitionFeedback.playAfterDelay(isLiberar ? 'release' : 'reject');
        this.snackBar.open(`Estado: ${transition.label}`, 'Cerrar', { duration: 2000 });
      });
      return;
    }

    try {
      // Mantiene el arreglo visual del CDK en sync en el mismo frame del drop.
      transferArrayItem(fromList, toList, event.previousIndex, event.currentIndex);
      this.taskService.applyTransition(task.id, toStatus, {});
      this.persistColumnOrder(fromList);
      this.persistColumnOrder(toList);
      this.transitionFeedback.playForStatus(toStatus);
      this.snackBar.open(`Estado: ${transition.label}`, 'Cerrar', { duration: 2000 });
    } catch (e) {
      // Revierte movimiento visual si la transición falla.
      transferArrayItem(toList, fromList, event.currentIndex, event.previousIndex);
      this.snackBar.open((e as Error).message || 'Error al cambiar estado', 'Cerrar', {
        duration: 3000
      });
    }
  }
}
