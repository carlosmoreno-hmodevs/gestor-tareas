import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import type { Task, TaskLinkType } from '../../../shared/models';

export interface AddLinkDialogData {
  currentTask: Task;
  linkableTasks: Task[];
}

export interface AddLinkResult {
  targetTaskId: string;
  type: TaskLinkType;
  /** For BLOCKS: true = target blocks current (blockedBy), false = current blocks target (blocking) */
  blockedBy?: boolean;
}

@Component({
  selector: 'app-add-link-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-link-dialog.component.html',
  styleUrl: './add-link-dialog.component.scss'
})
export class AddLinkDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddLinkDialogComponent>);
  private readonly data = inject<AddLinkDialogData>(MAT_DIALOG_DATA);

  linkableTasks = this.data.linkableTasks;
  currentTask = this.data.currentTask;
  searchTerm = signal('');

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.linkableTasks;
    return this.linkableTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.folio.toLowerCase().includes(term) ||
        (t.assignee || '').toLowerCase().includes(term)
    );
  });

  form = this.fb.group({
    type: ['BLOCKS' as TaskLinkType, Validators.required],
    blockedBy: [true],
    targetTaskId: ['', Validators.required]
  });

  linkTypes: { value: TaskLinkType; label: string }[] = [
    { value: 'BLOCKS', label: 'Bloquea / Bloqueado por' },
    { value: 'RELATES', label: 'Relacionada (Related)' },
    { value: 'DUPLICATES', label: 'Duplica (Duplicates)' }
  ];

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.dialogRef.close({
      targetTaskId: v.targetTaskId!,
      type: v.type!,
      blockedBy: v.type === 'BLOCKS' ? !!v.blockedBy : undefined
    } as AddLinkResult);
  }

  getTypeLabel(type: TaskLinkType): string {
    return this.linkTypes.find((t) => t.value === type)?.label ?? type;
  }
}
