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
    <button mat-button [matMenuTriggerFor]="tenantMenu" class="tenant-switcher-btn">
      <app-avatar
        [name]="tenantContext.currentTenant()?.name ?? 'Tenant'"
        [size]="28"
        class="tenant-avatar"
      />
      <span class="tenant-name">{{ tenantContext.currentTenant()?.name ?? 'Seleccionar' }}</span>
      <mat-icon class="tenant-chevron">expand_more</mat-icon>
    </button>
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
    .tenant-switcher-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 0.5rem;
    }
    .tenant-avatar { flex-shrink: 0; }
    .tenant-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tenant-chevron { margin-left: 0.25rem; }
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
