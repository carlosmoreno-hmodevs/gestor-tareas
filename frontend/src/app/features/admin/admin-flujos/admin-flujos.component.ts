import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-flujos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, PageHeaderComponent],
  template: `
    <app-page-header title="Flujos" subtitle="Task Workflow - transiciones permitidas" icon="account_tree" />
    <mat-card>
      <mat-card-content>
        <p>Vista de solo lectura de las transiciones del flujo de tareas.</p>
        <table mat-table [dataSource]="transitions" class="full-width">
          <ng-container matColumnDef="from">
            <th mat-header-cell *matHeaderCellDef>Desde</th>
            <td mat-cell *matCellDef="let t">{{ t.from }}</td>
          </ng-container>
          <ng-container matColumnDef="to">
            <th mat-header-cell *matHeaderCellDef>Hacia</th>
            <td mat-cell *matCellDef="let t">{{ t.to }}</td>
          </ng-container>
          <ng-container matColumnDef="label">
            <th mat-header-cell *matHeaderCellDef>Acción</th>
            <td mat-cell *matCellDef="let t">{{ t.label }}</td>
          </ng-container>
          <ng-container matColumnDef="requires">
            <th mat-header-cell *matHeaderCellDef>Requiere</th>
            <td mat-cell *matCellDef="let t">
              {{ t.requiresComment ? 'Comentario' : '' }}
              {{ t.requiresNewDueDate ? 'Nueva fecha' : '' }}
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['from','to','label','requires']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['from','to','label','requires']"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AdminFlujosComponent {
  private readonly workflow = inject(TaskWorkflowService);

  transitions = this.workflow.getAllTransitions();
}
