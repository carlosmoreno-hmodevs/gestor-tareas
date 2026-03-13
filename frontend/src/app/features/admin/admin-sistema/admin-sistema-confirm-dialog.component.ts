import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import type { SystemMode } from '../../../shared/models/tenant-settings.model';

export interface AdminSistemaConfirmDialogData {
  mode: SystemMode;
}

@Component({
  selector: 'app-admin-sistema-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Aplicar modo del sistema</h2>
    <mat-dialog-content>
      <p>
        Se aplicará el modo <strong>Normal</strong>.
      </p>
      <p>
        Esto ajusta la UI para operación estándar del tenant. No se alteran los datos históricos.
      </p>
      <p>¿Deseas continuar?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="dialogRef.close(true)">Aplicar</button>
    </mat-dialog-actions>
  `
})
export class AdminSistemaConfirmDialogComponent {
  readonly data = inject<AdminSistemaConfirmDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AdminSistemaConfirmDialogComponent, boolean>);
}
