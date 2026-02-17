import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RejectDialogData {
  taskTitle: string;
  dialogTitle?: string;
  label?: string;
  confirmLabel?: string;
  /** If true, comment is optional and confirm is always enabled */
  optionalComment?: boolean;
}

export interface RejectDialogResult {
  comment: string;
}

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.dialogTitle ?? 'Rechazar tarea' }}</h2>
    <mat-dialog-content>
      <p class="task-ref">{{ data.taskTitle }}</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ data.label ?? 'Motivo / Comentario (requerido)' }}</mat-label>
        <textarea matInput [(ngModel)]="comment" rows="4" required placeholder="Indica el motivo del rechazo"></textarea>
        @if (!comment.trim()) {
          <mat-hint>Este comentario quedará registrado en la bitácora</mat-hint>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button [color]="data.confirmLabel === 'Reabrir' ? 'primary' : 'warn'" (click)="confirm()" [disabled]="!data.optionalComment && !comment.trim()">{{ data.confirmLabel ?? 'Rechazar' }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width { width: 100%; min-width: 300px; }
      .task-ref { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
    `
  ]
})
export class RejectDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RejectDialogComponent>);
  readonly data = inject<RejectDialogData>(MAT_DIALOG_DATA);

  comment = '';

  confirm(): void {
    if (!this.data.optionalComment && !this.comment.trim()) return;
    this.dialogRef.close({ comment: this.comment.trim() } as RejectDialogResult);
  }
}
