import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export type TransitionFeedbackKind = 'complete' | 'release' | 'reject';

export interface TransitionFeedbackData {
  kind: TransitionFeedbackKind;
}

@Component({
  selector: 'app-transition-feedback',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="tf" [attr.data-kind]="data.kind" role="status" aria-live="polite">
      @if (data.kind === 'complete') {
        <div class="tf-burst" aria-hidden="true">
          @for (i of burstDots; track i) {
            <span class="tf-dot" [style.animation-delay.ms]="i * 40" [style.left.%]="12 + i * 10"></span>
          }
        </div>
        <div class="tf-icon tf-icon--complete">
          <mat-icon>task_alt</mat-icon>
        </div>
        <h2 class="tf-title">¡Completada!</h2>
        <p class="tf-sub">Buen trabajo — la tarea quedó como completada.</p>
      }
      @if (data.kind === 'release') {
        <div class="tf-rings" aria-hidden="true">
          <span class="tf-ring"></span>
          <span class="tf-ring tf-ring--2"></span>
        </div>
        <div class="tf-icon tf-icon--release">
          <mat-icon>verified</mat-icon>
        </div>
        <h2 class="tf-title">¡Liberada!</h2>
        <p class="tf-sub">Validación registrada. Todo en orden.</p>
      }
      @if (data.kind === 'reject') {
        <div class="tf-icon tf-icon--reject">
          <mat-icon>thumb_down_alt</mat-icon>
        </div>
        <h2 class="tf-title">Tarea rechazada</h2>
        <p class="tf-sub">El estado se actualizó. Revisa el motivo si aplica.</p>
      }
    </div>
  `,
  styles: [
    `
      .tf {
        position: relative;
        text-align: center;
        padding: 2rem 1.25rem 1.75rem;
        overflow: hidden;
        border-radius: 16px;
      }

      .tf[data-kind='complete'] {
        background: linear-gradient(165deg, rgba(46, 125, 50, 0.12) 0%, rgba(255, 255, 255, 0.98) 45%);
      }
      .tf[data-kind='release'] {
        background: linear-gradient(165deg, rgba(0, 137, 123, 0.14) 0%, rgba(255, 255, 255, 0.98) 48%);
      }
      .tf[data-kind='reject'] {
        background: linear-gradient(165deg, rgba(198, 40, 40, 0.1) 0%, rgba(255, 255, 255, 0.98) 50%);
      }

      .tf-icon {
        display: flex;
        justify-content: center;
        margin-bottom: 0.75rem;
      }

      .tf-icon mat-icon {
        width: 1em;
        height: 1em;
        font-size: 4rem;
      }

      .tf-icon--complete mat-icon {
        color: #2e7d32;
        animation: tf-pop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        filter: drop-shadow(0 4px 12px rgba(46, 125, 50, 0.35));
      }

      .tf-icon--release mat-icon {
        color: #00897b;
        animation: tf-pop 0.7s cubic-bezier(0.34, 1.45, 0.64, 1) both;
        filter: drop-shadow(0 4px 14px rgba(0, 137, 123, 0.4));
      }

      .tf-icon--reject mat-icon {
        color: #c62828;
        animation: tf-shake 0.55s ease-in-out both;
        filter: drop-shadow(0 2px 8px rgba(198, 40, 40, 0.3));
      }

      .tf-title {
        margin: 0 0 0.35rem;
        font-size: 1.35rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: rgba(0, 0, 0, 0.87);
      }

      .tf-sub {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.45;
        color: rgba(0, 0, 0, 0.58);
      }

      .tf-burst {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .tf-dot {
        position: absolute;
        top: 40%;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        opacity: 0;
        transform: translateX(-50%);
        animation: tf-confetti 0.95s ease-out forwards;
      }

      .tf[data-kind='complete'] .tf-dot:nth-child(odd) {
        background: #66bb6a;
      }
      .tf[data-kind='complete'] .tf-dot:nth-child(even) {
        background: #43a047;
      }

      .tf-rings {
        position: absolute;
        left: 50%;
        top: 42%;
        transform: translate(-50%, -50%);
        width: 120px;
        height: 120px;
        pointer-events: none;
      }

      .tf-ring {
        position: absolute;
        inset: 0;
        border: 2px solid rgba(0, 137, 123, 0.35);
        border-radius: 50%;
        animation: tf-ring 1.4s ease-out forwards;
      }

      .tf-ring--2 {
        animation-delay: 0.2s;
        border-color: rgba(0, 137, 123, 0.2);
      }

      @keyframes tf-pop {
        0% {
          transform: scale(0.2) rotate(-12deg);
          opacity: 0;
        }
        70% {
          transform: scale(1.08) rotate(4deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(0);
          opacity: 1;
        }
      }

      @keyframes tf-shake {
        0%,
        100% {
          transform: translateX(0);
        }
        20%,
        60% {
          transform: translateX(-6px);
        }
        40%,
        80% {
          transform: translateX(6px);
        }
      }

      @keyframes tf-confetti {
        0% {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-52px) scale(0.25);
        }
      }

      @keyframes tf-ring {
        0% {
          transform: scale(0.5);
          opacity: 0.8;
        }
        100% {
          transform: scale(1.6);
          opacity: 0;
        }
      }
    `
  ]
})
export class TransitionFeedbackComponent {
  readonly dialogRef = inject(MatDialogRef<TransitionFeedbackComponent>);
  readonly data = inject<TransitionFeedbackData>(MAT_DIALOG_DATA);

  /** Índices para puntos de confeti */
  readonly burstDots = [0, 1, 2, 3, 4, 5, 6, 7];
}
