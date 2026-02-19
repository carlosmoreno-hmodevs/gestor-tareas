import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface RescheduleDialogData {
  taskTitle: string;
  currentDueDate: Date;
}

export interface RescheduleDialogResult {
  newDueDate: Date;
  comment: string;
}

@Component({
  selector: 'app-reschedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title>Reagendar tarea</h2>
    <mat-dialog-content>
      <p class="task-ref">{{ data.taskTitle }}</p>
      <p class="hint">La tarea está vencida. Indica una nueva fecha límite y justificación.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nueva fecha límite</mat-label>
        <input matInput [matDatepicker]="picker" [(ngModel)]="newDueDate" [min]="minDate" required />
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker [startAt]="minDate"></mat-datepicker>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Justificación (requerido)</mat-label>
        <textarea matInput [(ngModel)]="comment" rows="3" required placeholder="Motivo del reagendamiento"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="confirm()" [disabled]="!isValid()">Reagendar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width { width: 100%; min-width: 300px; }
      .task-ref { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }
      .hint { font-size: 0.85rem; color: #757575; margin-bottom: 1rem; }
    `
  ]
})
export class RescheduleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RescheduleDialogComponent>);
  readonly data = inject<RescheduleDialogData>(MAT_DIALOG_DATA);

  newDueDate: Date = this.getMinDate();
  comment = '';
  minDate = this.getMinDate();

  private getMinDate(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  isValid(): boolean {
    if (!this.comment?.trim()) return false;
    if (!this.newDueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(this.newDueDate);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  }

  confirm(): void {
    if (!this.isValid()) return;
    this.dialogRef.close({
      newDueDate: new Date(this.newDueDate),
      comment: this.comment.trim()
    } as RescheduleDialogResult);
  }
}
