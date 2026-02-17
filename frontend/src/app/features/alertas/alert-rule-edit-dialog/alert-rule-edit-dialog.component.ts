import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { AlertRule } from '../../../shared/models';

@Component({
  selector: 'app-alert-rule-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Editar regla de alerta</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="half-width">
        <mat-label>Umbral (horas)</mat-label>
        <input matInput type="number" [(ngModel)]="data.thresholdHours" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="half-width">
        <mat-label>Frecuencia</mat-label>
        <mat-select [(ngModel)]="data.frequency">
          <mat-option value="inmediato">Inmediato</mat-option>
          <mat-option value="cada6h">Cada 6h</mat-option>
          <mat-option value="cada12h">Cada 12h</mat-option>
          <mat-option value="diaria">Diaria</mat-option>
        </mat-select>
      </mat-form-field>
      <p class="preview-text">Preview: Tareas que entrarían en alerta según umbral configurado (mock).</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cerrar</button>
      <button mat-flat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
      }
      .half-width {
        width: 48%;
        margin-right: 4%;
      }
      .preview-text {
        font-size: 0.875rem;
        color: #757575;
        margin-top: 1rem;
      }
    `
  ]
})
export class AlertRuleEditDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AlertRuleEditDialogComponent>);
  readonly data = inject<AlertRule>(MAT_DIALOG_DATA);

  save(): void {
    this.dialogRef.close(this.data);
  }
}
