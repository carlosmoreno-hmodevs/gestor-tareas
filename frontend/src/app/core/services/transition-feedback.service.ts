import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { TaskStatus } from '../../shared/models';
import {
  TransitionFeedbackComponent,
  type TransitionFeedbackKind
} from '../../shared/components/transition-feedback/transition-feedback.component';

const DURATION_MS = 2400;

/**
 * Micro-animaciones al completar, liberar o rechazar tareas (detalle y tablero).
 */
@Injectable({ providedIn: 'root' })
export class TransitionFeedbackService {
  private readonly dialog = inject(MatDialog);

  /** Dispara feedback según el estado destino (solo Completada, Liberada, Rechazada). */
  playForStatus(toStatus: TaskStatus): void {
    if (toStatus === 'Completada') this.play('complete');
    else if (toStatus === 'Liberada') this.play('release');
    else if (toStatus === 'Rechazada') this.play('reject');
  }

  play(kind: TransitionFeedbackKind): void {
    const ref = this.dialog.open(TransitionFeedbackComponent, {
      data: { kind },
      panelClass: 'transition-feedback-panel',
      backdropClass: 'transition-feedback-backdrop',
      disableClose: true,
      autoFocus: false,
      width: 'min(380px, 92vw)',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });
    window.setTimeout(() => ref.close(), DURATION_MS);
  }

  /**
   * Útil tras cerrar otro diálogo (motivo) para no solaparlos.
   */
  playAfterDelay(kind: TransitionFeedbackKind, delayMs = 280): void {
    window.setTimeout(() => this.play(kind), delayMs);
  }
}
