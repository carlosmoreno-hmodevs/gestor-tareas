import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import type { Task } from '../../../shared/models';

export interface LinkSubtaskDialogData {
  parentTask: Task;
  linkableTasks: Task[];
}

@Component({
  selector: 'app-link-subtask-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Vincular tarea existente como subtarea</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tarea a vincular</mat-label>
          <mat-select formControlName="targetTaskId">
            @for (t of linkableTasks; track t.id) {
              <mat-option [value]="t.id">
                {{ t.folio }} — {{ t.title }} ({{ t.assignee || 'Sin asignar' }})
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Vincular</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class LinkSubtaskDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<LinkSubtaskDialogComponent>);
  private readonly data = inject<LinkSubtaskDialogData>(MAT_DIALOG_DATA);

  linkableTasks = this.data.linkableTasks;

  form = this.fb.group({
    targetTaskId: ['', Validators.required]
  });

  save(): void {
    const v = this.form.getRawValue();
    if (v.targetTaskId) this.dialogRef.close(v.targetTaskId);
  }
}
