import { Component, inject, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import type { Task, Priority } from '../../../shared/models';
import { DataService } from '../../../core/services/data.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

export interface TaskFormDialogData {
  projectId?: string;
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    AvatarComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss'
})
export class TaskFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  private readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly dataService = inject(DataService);
  private readonly currentUser = inject(CurrentUserService);

  users = this.dataService.getUsers();
  categories = this.dataService.getCategories();
  priorities = this.dataService.getPriorities();
  projects = this.dataService.getProjects();

  teamUsers = computed(() =>
    this.users.filter((u) => u.team === this.currentUser.team || this.currentUser.role === 'Admin')
  );

  minDate = new Date();

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    categoryId: ['', Validators.required],
    priority: ['Media' as Priority, Validators.required],
    assigneeId: ['', Validators.required],
    subAssigneeIds: [[]] as [string[]],
    dueDate: [new Date(), Validators.required],
    projectId: [this.data?.projectId ?? ''],
    tags: [''],
    observations: ['']
  });

  tagInput = '';
  selectedFiles: { name: string; size: number }[] = [];

  addTag(): void {
    const t = this.tagInput.trim();
    if (!t) return;
    const tagsCtrl = this.form.get('tags');
    const current = (tagsCtrl?.value ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
    if (!current.includes(t)) {
      tagsCtrl?.setValue([...current, t].join(', '));
    }
    this.tagInput = '';
  }

  removeTag(tag: string): void {
    const tagsCtrl = this.form.get('tags');
    const current = (tagsCtrl?.value ?? '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s && s !== tag);
    tagsCtrl?.setValue(current.join(', '));
  }

  get tagsList(): string[] {
    const v = this.form.get('tags')?.value ?? '';
    return v.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      this.selectedFiles.push({ name: f.name, size: f.size });
    }
    input.value = '';
  }

  removeFile(idx: number): void {
    this.selectedFiles.splice(idx, 1);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const folio = `TASK-${String(Date.now()).slice(-6)}`;
    const assignee = this.users.find((u) => u.id === v.assigneeId);
    const category = this.categories.find((c) => c.id === v.categoryId);
    const subIds = v.subAssigneeIds ?? [];
    const subNames = subIds.map((id) => this.users.find((u) => u.id === id)?.name ?? '').filter(Boolean);

    this.dialogRef.close({
      folio,
      title: v.title!,
      description: v.description ?? '',
      assignee: assignee?.name ?? 'Sin asignar',
      assigneeId: v.assigneeId ?? '',
      status: 'Pendiente' as const,
      priority: v.priority!,
      dueDate: v.dueDate!,
      riskIndicator: 'ok' as const,
      tags: this.tagsList,
      attachmentsCount: this.selectedFiles.length,
      commentsCount: 0,
      createdAt: new Date(),
      createdBy: this.currentUser.id,
      createdByName: this.currentUser.name,
      projectId: v.projectId || undefined,
      categoryId: v.categoryId || undefined,
      categoryName: category?.name,
      subAssigneeIds: subIds,
      subAssignees: subNames,
      observations: v.observations || undefined,
      attachments: this.selectedFiles.map((f, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        uploadedAt: new Date(),
        uploadedBy: this.currentUser.name
      })),
      history: []
    } as Omit<Task, 'id' | 'history'>);
  }
}
