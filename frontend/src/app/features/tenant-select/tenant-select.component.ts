import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-tenant-select',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, AvatarComponent],
  template: `
    <div class="tenant-select-page">
      <div class="tenant-select-container">
        <header class="tenant-select-header">
          <div class="header-icon">
            <mat-icon>business</mat-icon>
          </div>
          <h1 class="title">Seleccionar organización</h1>
          <p class="subtitle">Elige la empresa con la que deseas trabajar</p>
        </header>

        <div class="tenant-list">
          @for (t of tenants; track t.id) {
            <button type="button" class="tenant-option" (click)="selectTenant(t.id)">
              <div class="tenant-avatar">
                <app-avatar [name]="t.name" [size]="48" />
              </div>
              <div class="tenant-info">
                <span class="tenant-name">{{ t.name }}</span>
                @if (t.slug) {
                  <span class="tenant-code">{{ t.slug }}</span>
                }
              </div>
              <mat-icon class="tenant-arrow">arrow_forward</mat-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tenant-select-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
    }

    .tenant-select-container {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }

    .tenant-select-header {
      padding: 2rem 2rem 1.5rem;
      text-align: center;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(25, 118, 210, 0.1);
      border-radius: 14px;
    }
    .header-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .title {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .subtitle {
      margin: 0;
      font-size: 0.9375rem;
      color: #6b7280;
      line-height: 1.5;
    }

    .tenant-list {
      padding: 0 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .tenant-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
      text-align: left;
      font: inherit;
    }

    .tenant-option:hover {
      background: #eff6ff;
      border-color: #93c5fd;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.12);
    }

    .tenant-option:focus-visible {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    .tenant-avatar {
      flex-shrink: 0;
    }

    .tenant-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .tenant-name {
      font-size: 1rem;
      font-weight: 500;
      color: #1e293b;
    }

    .tenant-code {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .tenant-arrow {
      flex-shrink: 0;
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #94a3b8;
      transition: transform 0.2s;
    }

    .tenant-option:hover .tenant-arrow {
      color: #1976d2;
      transform: translateX(4px);
    }
  `]
})
export class TenantSelectComponent {
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);

  readonly tenants = this.tenantContext.tenants;

  selectTenant(tenantId: string): void {
    this.tenantContext.setCurrentTenant(tenantId);
    this.router.navigate(['/tablero']);
  }
}
