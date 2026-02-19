import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import type { Task, Priority } from '../../../shared/models';
import { DataService } from '../../../core/services/data.service';
import { minDueDateValidator } from '../../../shared/utils/date.utils';

export interface AddSubtaskDialogData {
  parentTask: Task;
}

export interface AddSubtaskResult {
  title: string;
  dueDate: Date;
  priority: Priority;
  assigneeId: string;
  assignee: string;
}

@Component({
  selector: 'app-add-subtask-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-subtask-dialog.component.html',
  styleUrl: './add-subtask-dialog.component.scss'
})
export class AddSubtaskDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddSubtaskDialogComponent>);
  private readonly data = inject<AddSubtaskDialogData>(MAT_DIALOG_DATA);
  private readonly dataService = inject(DataService);

  users = this.dataService.usersForCurrentOrg;
  priorities = this.dataService.getPriorities();
  parentTask = this.data.parentTask;
  private readonly todayForMin = new Date();
  minDate = new Date(this.todayForMin.getFullYear(), this.todayForMin.getMonth(), this.todayForMin.getDate());

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    dueDate: [this.parentTask.dueDate ?? new Date(), [Validators.required, minDueDateValidator()]],
    priority: [this.parentTask.priority ?? 'Media' as Priority, Validators.required],
    assigneeId: [''],
    assignee: ['']
  });

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const assignee = this.users().find((u) => u.id === v.assigneeId);
    this.dialogRef.close({
      title: v.title!,
      dueDate: v.dueDate!,
      priority: v.priority!,
      assigneeId: v.assigneeId ?? '',
      assignee: assignee?.name ?? 'Sin asignar'
    } as AddSubtaskResult);
  }
}
