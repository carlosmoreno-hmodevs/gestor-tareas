import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { OrgService } from '../../../core/services/org.service';
import { AvatarComponent } from '../avatar/avatar.component';
import type { OrgUnitTreeNode } from '../../../shared/models/org.model';

@Component({
  selector: 'app-org-context-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, AvatarComponent],
  template: `
    <div class="org-context-bar">
      <button mat-button [matMenuTriggerFor]="tenantMenu" class="org-btn" matTooltip="Organización">
        <span class="org-btn-inner">
          <span class="org-avatar-wrap">
            <app-avatar
              [name]="tenantContext.currentTenant()?.name ?? ''"
              [size]="24"
              class="org-avatar"
            />
          </span>
          <span class="org-name">{{ tenantContext.currentTenant()?.name ?? 'Seleccionar' }}</span>
        </span>
        <mat-icon class="chevron">expand_more</mat-icon>
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

      @if (tenantContext.currentTenantId()) {
        <span class="connector">›</span>
        <button mat-button [matMenuTriggerFor]="contextMenu" class="unit-btn" [matTooltip]="'Unidad en ' + (tenantContext.currentTenant()?.name ?? '')">
          <span class="unit-btn-inner">
            <mat-icon class="unit-icon">account_tree</mat-icon>
            <span class="unit-name">{{ label() }}</span>
          </span>
          <mat-icon class="chevron">expand_more</mat-icon>
        </button>
        <mat-menu #contextMenu="matMenu" class="context-menu">
            <div class="menu-header">
              Unidades de {{ tenantContext.currentTenant()?.name }}
            </div>
            <button mat-menu-item (click)="selectAll()">
              <span>Todos</span>
              @if (!orgService.selectedOrgUnitId()) {
                <mat-icon>check</mat-icon>
              }
            </button>
            @for (node of orgTree(); track node.id) {
              @for (item of flattenTree([node], 0); track item.id) {
                <button
                  mat-menu-item
                  [style.padding-left.rem]="1 + item.depth * 1.5"
                  (click)="selectOrgUnit(item.id)"
                >
                  <span>{{ item.name }}</span>
                  @if (orgService.selectedOrgUnitId() === item.id) {
                    <mat-icon>check</mat-icon>
                  }
                </button>
              }
            }
        </mat-menu>
      }
    </div>
  `,
  styles: [`
    .org-context-bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      height: 36px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    [data-theme='dark'] .org-context-bar {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .org-btn,
    .unit-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 8px;
      min-height: 32px;
      height: 32px;
      border-radius: 6px;
      color: inherit;
      line-height: 1;
    }
    .org-btn .mat-mdc-button-touch-target,
    .unit-btn .mat-mdc-button-touch-target {
      min-height: 32px;
    }
    .org-btn:hover,
    .unit-btn:hover {
      background: rgba(25, 118, 210, 0.08);
    }

    .org-btn-inner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 0;
    }

    .org-avatar-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 0;
    }

    .org-avatar-wrap app-avatar,
    .org-avatar-wrap .org-avatar {
      display: block;
      line-height: 0;
      flex-shrink: 0;
    }

    .org-name,
    .unit-name {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--color-text, #1a1a1a);
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .connector {
      font-size: 0.875rem;
      font-weight: 300;
      color: var(--color-text-secondary, #9e9e9e);
      margin: 0 2px;
      user-select: none;
    }

    .unit-btn {
      padding-left: 8px;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
    }

    [data-theme='dark'] .unit-btn {
      border-left-color: rgba(255, 255, 255, 0.15);
    }
    [data-theme='dark'] .unit-btn:hover {
      background: rgba(66, 165, 245, 0.1);
    }

    .unit-btn-inner {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .unit-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-primary, #1976d2);
      flex-shrink: 0;
    }

    .chevron {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-text-secondary, #9e9e9e);
      flex-shrink: 0;
    }

    .menu-header {
      padding: 10px 16px 6px;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-secondary, #757575);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      margin-bottom: 4px;
    }

    [data-theme='dark'] .menu-header {
      border-bottom-color: rgba(255, 255, 255, 0.08);
    }

    /* Cuando está debajo del header (org-selectors-mobile): selectores alineados e igual tamaño */
    :host-context(.org-selectors-mobile) .org-context-bar {
      width: 100%;
      padding: 8px 12px;
      gap: 8px;
      height: auto;
      min-height: 40px;
    }
    :host-context(.org-selectors-mobile) .org-btn,
    :host-context(.org-selectors-mobile) .unit-btn {
      flex: 1;
      min-width: 0;
      min-height: 36px;
      height: 36px;
      padding: 0 12px;
      justify-content: center;
    }
    :host-context(.org-selectors-mobile) .org-btn-inner,
    :host-context(.org-selectors-mobile) .unit-btn-inner {
      flex: 1;
      min-width: 0;
      justify-content: center;
    }
    :host-context(.org-selectors-mobile) .org-name,
    :host-context(.org-selectors-mobile) .unit-name {
      max-width: none;
      flex: 1;
      min-width: 0;
    }
    :host-context(.org-selectors-mobile) .unit-btn {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
    }
    [data-theme='dark'] :host-context(.org-selectors-mobile) .unit-btn {
      border-left-color: rgba(255, 255, 255, 0.15);
    }

    /* Mobile-first: bar más ancho y espacioso en pantallas pequeñas */
    @media (max-width: 767px) {
      .org-context-bar {
        width: 100%;
        padding: 8px 12px;
        gap: 8px;
        height: auto;
        min-height: 40px;
      }
      .org-btn, .unit-btn {
        min-height: 36px;
        height: 36px;
        padding: 0 10px;
      }
      .org-name, .unit-name {
        max-width: none;
      }
      .unit-btn {
        flex: 1;
        min-width: 0;
      }
      .connector { margin: 0 4px; }
    }

    @media (min-width: 768px) and (max-width: 900px) {
      .org-name, .unit-name { max-width: 80px; }
    }
  `]
})
export class OrgContextBarComponent {
  readonly tenantContext = inject(TenantContextService);
  readonly orgService = inject(OrgService);
  private readonly router = inject(Router);

  readonly tenants = this.tenantContext.tenants;

  readonly orgTree = computed(() =>
    this.orgService.getOrgTree(this.tenantContext.currentTenantId() ?? '')
  );

  label = () => {
    const selected = this.orgService.selectedOrgUnit();
    return selected ? selected.name : 'Todos';
  };

  flattenTree(nodes: OrgUnitTreeNode[], depth: number): { id: string; name: string; depth: number }[] {
    const result: { id: string; name: string; depth: number }[] = [];
    for (const n of nodes) {
      result.push({ id: n.id, name: n.name, depth });
      if (n.children?.length) {
        result.push(...this.flattenTree(n.children, depth + 1));
      }
    }
    return result;
  }

  selectTenant(tenantId: string): void {
    this.tenantContext.setCurrentTenant(tenantId);
    this.router.navigate(['/tablero']);
  }

  selectAll(): void {
    this.orgService.setSelectedOrgUnit(null);
  }

  selectOrgUnit(id: string): void {
    this.orgService.setSelectedOrgUnit(id);
  }
}
