import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import type { OrgUnitTreeNode } from '../../../shared/models/org.model';

@Component({
  selector: 'app-context-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div class="context-selector-wrap">
      <span class="selector-label">Unidad</span>
      <button mat-button [matMenuTriggerFor]="contextMenu" class="context-selector-btn">
        <mat-icon>account_tree</mat-icon>
        <span class="context-label">{{ label() }}</span>
        <mat-icon class="context-chevron">expand_more</mat-icon>
      </button>
    </div>
    <mat-menu #contextMenu="matMenu" class="context-menu">
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
  `,
  styles: [`
    .context-selector-wrap {
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
    .context-selector-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 4px 8px;
      min-height: 36px;
      border-radius: 8px;
      color: var(--color-text-secondary, #757575);
    }
    .context-selector-btn:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--color-text, #212121);
    }
    [data-theme='dark'] .context-selector-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: var(--color-text, #e0e0e0);
    }
    .context-selector-btn mat-icon:first-of-type { font-size: 20px; width: 20px; height: 20px; }
    .context-label { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .context-chevron { margin-left: 0.25rem; font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ContextSelectorComponent {
  readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);

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

  selectAll(): void {
    this.orgService.setSelectedOrgUnit(null);
  }

  selectOrgUnit(id: string): void {
    this.orgService.setSelectedOrgUnit(id);
  }
}
