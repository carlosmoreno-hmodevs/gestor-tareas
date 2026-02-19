import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { Task } from '../../../shared/models';
import type { ReasonCatalogItem, TaskBlockedReason, TaskRejectedReason } from '../../../shared/models/reason-catalog.model';
import { AdminService } from '../../../core/services/admin.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';

export interface ReasonDialogData {
  kind: 'blocked' | 'rejected';
  task: Task;
  dialogTitle: string;
  confirmLabel: string;
}

export interface ReasonDialogResult {
  blockedReason?: TaskBlockedReason;
  rejectedReason?: TaskRejectedReason;
}

function filterByContext(
  items: ReasonCatalogItem[],
  mode: 'normal' | 'ferretero',
  context: { categoryId?: string; taskTemplateId?: string; projectId?: string; generatedFromProjectTemplateId?: string }
): ReasonCatalogItem[] {
  return items.filter((item) => {
    if (item.systemMode !== 'all' && item.systemMode !== mode) return false;
    const applies = item.appliesTo;
    if (!applies) return true;
    if (applies.categoryIds?.length && context.categoryId && !applies.categoryIds.includes(context.categoryId)) return false;
    if (applies.taskTemplateIds?.length && context.taskTemplateId && !applies.taskTemplateIds.includes(context.taskTemplateId)) return false;
    if (applies.projectTemplateIds?.length && context.generatedFromProjectTemplateId && !applies.projectTemplateIds.includes(context.generatedFromProjectTemplateId)) return false;
    if (applies.projectIds?.length && context.projectId && !applies.projectIds.includes(context.projectId)) return false;
    return true;
  });
}

function sortCatalogForSelect(items: ReasonCatalogItem[]): ReasonCatalogItem[] {
  return [...items].sort((a, b) => {
    if (a.isOther && !b.isOther) return 1;
    if (!a.isOther && b.isOther) return -1;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

@Component({
  selector: 'app-reason-dialog',
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
    <h2 mat-dialog-title>{{ data.dialogTitle }}</h2>
    <mat-dialog-content>
      <p class="task-ref">{{ data.task.title }}</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Motivo</mat-label>
        <mat-select [(ngModel)]="selectedId" (selectionChange)="onReasonChange()" required>
          @for (item of options(); track item.id) {
            <mat-option [value]="item.id">{{ item.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (selectedIsOther()) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Motivo personalizado</mat-label>
          <input matInput [(ngModel)]="customText" placeholder="Describe el motivo" required />
        </mat-form-field>
      }
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Detalle (opcional)</mat-label>
        <input matInput [(ngModel)]="detail" placeholder="Ej: SKU 123 / proveedor X" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button [color]="data.kind === 'rejected' ? 'warn' : 'primary'" (click)="confirm()" [disabled]="!canConfirm()">
        {{ data.confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width { width: 100%; min-width: 280px; }
      .task-ref { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
    `
  ]
})
export class ReasonDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ReasonDialogComponent>);
  readonly data = inject<ReasonDialogData>(MAT_DIALOG_DATA);
  private readonly adminService = inject(AdminService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly tenantSettings = inject(TenantSettingsService);

  selectedId = '';
  customText = '';
  detail = '';

  private catalog = signal<ReasonCatalogItem[]>([]);

  options = computed(() => sortCatalogForSelect(this.catalog()));

  selectedIsOther = computed(() => {
    const id = this.selectedId;
    return this.catalog().some((i) => i.id === id && i.isOther);
  });

  constructor() {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    const mode = this.tenantSettings.isFerretero() ? 'ferretero' : 'normal';
    let items = this.adminService.getReasonCatalog(tid).filter((i) => i.kind === this.data.kind);
    items = filterByContext(items, mode, {
      categoryId: this.data.task.categoryId,
      taskTemplateId: this.data.task.templateId,
      projectId: this.data.task.projectId,
      generatedFromProjectTemplateId: this.data.task.generatedFromProjectTemplateId
    });
    if (items.length === 0 && this.data.kind === 'blocked') {
      items = [{ id: 'other-blocked', code: 'OTHER_BLOCKED', label: 'Otro (personalizado)', kind: 'blocked', systemMode: 'all', isOther: true, order: 99 }];
    }
    if (items.length === 0 && this.data.kind === 'rejected') {
      items = [{ id: 'other-rejected', code: 'OTHER_REJECTED', label: 'Otro (personalizado)', kind: 'rejected', systemMode: 'all', isOther: true, order: 99 }];
    }
    this.catalog.set(items);
    if (items.length) this.selectedId = items[0].id;
  }

  onReasonChange(): void {
    this.customText = '';
  }

  canConfirm(): boolean {
    if (!this.selectedId) return false;
    const item = this.catalog().find((i) => i.id === this.selectedId);
    if (item?.isOther && !this.customText.trim()) return false;
    return true;
  }

  confirm(): void {
    if (!this.canConfirm()) return;
    const item = this.catalog().find((i) => i.id === this.selectedId);
    if (!item) return;
    const source = item.isOther && this.customText.trim() ? 'custom' : 'catalog';
    const label = item.isOther ? this.customText.trim() : item.label;
    const code = item.isOther ? undefined : item.code;
    if (this.data.kind === 'blocked') {
      this.dialogRef.close({
        blockedReason: {
          code,
          label: item.isOther ? undefined : item.label,
          customText: item.isOther ? this.customText.trim() : undefined,
          detail: this.detail.trim() || undefined,
          source
        }
      } as ReasonDialogResult);
    } else {
      this.dialogRef.close({
        rejectedReason: {
          code,
          label: item.isOther ? undefined : item.label,
          customText: item.isOther ? this.customText.trim() : undefined,
          detail: this.detail.trim() || undefined,
          source
        }
      } as ReasonDialogResult);
    }
  }
}
