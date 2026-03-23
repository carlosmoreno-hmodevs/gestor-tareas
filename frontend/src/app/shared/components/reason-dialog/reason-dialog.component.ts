import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import type { Task } from '../../models';
import type { ReasonCatalogItem, TaskBlockedReason, TaskRejectedReason } from '../../models/reason-catalog.model';
import { AdminService } from '../../../core/services/admin.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';

export interface ReasonDialogData {
  kind: 'blocked' | 'rejected' | 'released';
  task: Task;
  dialogTitle: string;
  confirmLabel: string;
  /** Rechazo / liberación: motivo opcional (opción «Sin motivo» + catálogo). */
  optionalReason?: boolean;
}

export interface ReasonDialogResult {
  blockedReason?: TaskBlockedReason;
  rejectedReason?: TaskRejectedReason;
  releaseReason?: TaskRejectedReason;
}

const RELEASE_NONE_ID = 'release-none';

/** Si el catálogo admin queda vacío (filtros), se ofrecen motivos por defecto. */
const DEFAULT_REJECTED_CATALOG: ReasonCatalogItem[] = [
  {
    id: 'rej-def-1',
    code: 'EVIDENCE',
    label: 'Falta evidencia o documentación',
    kind: 'rejected',
    systemMode: 'all',
    order: 1
  },
  {
    id: 'rej-def-2',
    code: 'QUALITY',
    label: 'No cumple criterios de calidad',
    kind: 'rejected',
    systemMode: 'all',
    order: 2
  },
  {
    id: 'rej-def-3',
    code: 'SCOPE',
    label: 'Fuera de alcance o cambio de requisitos',
    kind: 'rejected',
    systemMode: 'all',
    order: 3
  },
  {
    id: 'other-rejected',
    code: 'OTHER_REJECTED',
    label: 'Otro (personalizado)',
    kind: 'rejected',
    systemMode: 'all',
    isOther: true,
    order: 99
  }
];

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
    if (a.id === RELEASE_NONE_ID) return -1;
    if (b.id === RELEASE_NONE_ID) return 1;
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
      @if (isOptionalMotivo()) {
        <p class="hint">El motivo es opcional. Puedes confirmar sin indicar motivo o elegir uno del catálogo.</p>
      }
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Motivo</mat-label>
        <mat-select
          [(ngModel)]="selectedId"
          (selectionChange)="onReasonChange()"
          [required]="!isOptionalMotivo()"
        >
          @for (item of options(); track item.id) {
            <mat-option [value]="item.id">{{ item.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (selectedIsOther()) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Motivo personalizado</mat-label>
          <input
            matInput
            [(ngModel)]="customText"
            placeholder="Describe el motivo"
            [required]="selectedIsOther() && !isOptionalMotivo()"
          />
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
      .hint { font-size: 0.85rem; color: #666; margin: 0 0 0.75rem; line-height: 1.4; }
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
    const catalogKind = this.data.kind === 'released' ? 'rejected' : this.data.kind;
    let items = this.adminService.getReasonCatalog(tid).filter((i) => i.kind === catalogKind);
    items = filterByContext(items, mode, {
      categoryId: this.data.task.categoryId,
      taskTemplateId: this.data.task.templateId,
      projectId: this.data.task.projectId,
      generatedFromProjectTemplateId: this.data.task.generatedFromProjectTemplateId
    });
    if (items.length === 0 && this.data.kind === 'blocked') {
      items = [{ id: 'other-blocked', code: 'OTHER_BLOCKED', label: 'Otro (personalizado)', kind: 'blocked', systemMode: 'all', isOther: true, order: 99 }];
    }
    if (items.length === 0 && (this.data.kind === 'rejected' || this.data.kind === 'released')) {
      items = DEFAULT_REJECTED_CATALOG.map((x) => ({ ...x }));
    }
    if (this.data.optionalReason && (this.data.kind === 'released' || this.data.kind === 'rejected')) {
      const none: ReasonCatalogItem = {
        id: RELEASE_NONE_ID,
        code: 'NONE',
        label: 'Sin motivo (opcional)',
        kind: 'rejected',
        systemMode: 'all',
        isOther: false,
        order: -100
      };
      items = [none, ...items.filter((i) => i.id !== RELEASE_NONE_ID)];
    }
    this.catalog.set(sortCatalogForSelect(items));
    const list = this.catalog();
    if (list.length) this.selectedId = list[0].id;
  }

  onReasonChange(): void {
    this.customText = '';
  }

  /** Motivo opcional: rechazo o liberación con optionalReason. */
  isOptionalMotivo(): boolean {
    return !!this.data.optionalReason && (this.data.kind === 'released' || this.data.kind === 'rejected');
  }

  canConfirm(): boolean {
    if (this.isOptionalMotivo()) {
      if (!this.selectedId || this.selectedId === RELEASE_NONE_ID) return true;
      const item = this.catalog().find((i) => i.id === this.selectedId);
      if (item?.isOther && !this.customText.trim()) return true;
      return true;
    }
    if (!this.selectedId) return false;
    const item = this.catalog().find((i) => i.id === this.selectedId);
    if (item?.isOther && !this.customText.trim()) return false;
    return true;
  }

  private closeWithReason(reason: TaskRejectedReason | undefined): void {
    if (this.data.kind === 'released') {
      this.dialogRef.close({ releaseReason: reason } as ReasonDialogResult);
    } else {
      this.dialogRef.close({ rejectedReason: reason } as ReasonDialogResult);
    }
  }

  private buildReasonFromItem(item: ReasonCatalogItem): TaskRejectedReason {
    const source = item.isOther && this.customText.trim() ? 'custom' : 'catalog';
    return {
      code: item.isOther ? undefined : item.code,
      label: item.isOther ? undefined : item.label,
      customText: item.isOther ? this.customText.trim() : undefined,
      detail: this.detail.trim() || undefined,
      source
    };
  }

  confirm(): void {
    if (!this.canConfirm()) return;

    if (this.isOptionalMotivo()) {
      if (!this.selectedId || this.selectedId === RELEASE_NONE_ID) {
        this.closeWithReason(undefined);
        return;
      }
      const item = this.catalog().find((i) => i.id === this.selectedId);
      if (!item) return;
      if (item.isOther && !this.customText.trim()) {
        this.closeWithReason(undefined);
        return;
      }
      this.closeWithReason(this.buildReasonFromItem(item));
      return;
    }

    const item = this.catalog().find((i) => i.id === this.selectedId);
    if (!item) return;
    const source = item.isOther && this.customText.trim() ? 'custom' : 'catalog';
    if (this.data.kind === 'blocked') {
      this.dialogRef.close({
        blockedReason: {
          code: item.isOther ? undefined : item.code,
          label: item.isOther ? undefined : item.label,
          customText: item.isOther ? this.customText.trim() : undefined,
          detail: this.detail.trim() || undefined,
          source
        }
      } as ReasonDialogResult);
    } else {
      this.dialogRef.close({
        rejectedReason: {
          code: item.isOther ? undefined : item.code,
          label: item.isOther ? undefined : item.label,
          customText: item.isOther ? this.customText.trim() : undefined,
          detail: this.detail.trim() || undefined,
          source
        }
      } as ReasonDialogResult);
    }
  }
}
