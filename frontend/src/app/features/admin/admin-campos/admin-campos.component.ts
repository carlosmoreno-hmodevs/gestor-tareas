import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-campos',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, PageHeaderComponent],
  template: `
    <app-page-header title="Campos personalizados" subtitle="Placeholder - Coming soon" icon="tune" />
    <mat-card>
      <mat-card-content>
        <p>Estructura lista para definir campos personalizados (nombre, tipo, aplica a: tarea/proyecto).</p>
        <button mat-stroked-button disabled>
          <mat-icon>add</mat-icon>
          Agregar campo (mock)
        </button>
      </mat-card-content>
    </mat-card>
  `
})
export class AdminCamposComponent {}
