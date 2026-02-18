import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-tenant-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, AvatarComponent],
  template: `
    <div class="tenant-switcher-wrap">
      <span class="selector-label">Organización</span>
      <button mat-button [matMenuTriggerFor]="tenantMenu" class="tenant-switcher-btn">
        <app-avatar
          [name]="tenantContext.currentTenant()?.name ?? 'Tenant'"
          [size]="28"
          class="tenant-avatar"
        />
        <span class="tenant-name">{{ tenantContext.currentTenant()?.name ?? 'Seleccionar' }}</span>
        <mat-icon class="tenant-chevron">expand_more</mat-icon>
      </button>
    </div>
    <mat-menu #tenantMenu="matMenu" class="tenant-menu">
      @for (t of tenants; track t.id) {
        <button mat-menu-item (click)="selectTenant(t.id)">
          <span>{{ t.name }}</span>
          @if (t.id === tenantContext.currentTenantId()) {
            <mat-icon>check</mat-icon>
          }
        </button>
      }
    </mat-menu>
  `,
  styles: [`
    .tenant-switcher-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .selector-label {
      font-size: 0.7rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-secondary, #757575);
    }
    @media (max-width: 700px) {
      .selector-label { display: none; }
    }
    .tenant-switcher-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 4px 8px;
      min-height: 36px;
      border-radius: 8px;
      background: rgba(25, 118, 210, 0.06);
      color: var(--color-primary, #1976d2);
    }
    .tenant-switcher-btn:hover {
      background: rgba(25, 118, 210, 0.12);
    }
    [data-theme='dark'] .tenant-switcher-btn {
      background: rgba(66, 165, 245, 0.12);
      color: #42a5f5;
    }
    [data-theme='dark'] .tenant-switcher-btn:hover {
      background: rgba(66, 165, 245, 0.2);
    }
    .tenant-avatar { flex-shrink: 0; }
    .tenant-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
    .tenant-chevron { margin-left: 0.25rem; font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class TenantSwitcherComponent {
  readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);
  readonly tenants = this.tenantContext.tenants;

  selectTenant(tenantId: string): void {
    this.tenantContext.setCurrentTenant(tenantId);
    this.router.navigate(['/tablero']);
  }
}
