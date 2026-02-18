import {
  Component,
  input,
  output,
  inject,
  effect,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DataService } from '../../../core/services/data.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import type { Task, Priority } from '../../../shared/models';

@Component({
  selector: 'app-task-detail-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateFormatPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-detail-form.component.html',
  styleUrl: './task-detail-form.component.scss'
})
export class TaskDetailFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(DataService);

  task = input.required<Task | null>();
  isOnline = input(true);

  saveChanges = output<Partial<Task>>();
  cancelEdit = output<void>();

  isEditing = signal(false);

  users = this.dataService.usersForCurrentOrg;
  priorities = this.dataService.getPriorities();
  categories = this.dataService.getCategories();
  projects = this.dataService.projectsForCurrentOrg;

  get usersForSubAssignees() {
    const assigneeId = this.form.get('assigneeId')?.value;
    return this.users().filter((u) => u.id !== assigneeId);
  }

  form = this.fb.group({
    description: [''],
    assigneeId: [''],
    priority: ['Media' as Priority, Validators.required],
    categoryId: [''],
    dueDate: [new Date(), Validators.required],
    projectId: [''],
    subAssigneeIds: [[] as string[]],
    tags: [[] as string[]]
  });

  private today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  hasChanges = computed(() => {
    const t = this.task();
    if (!t) return false;
    const v = this.form.value;
    const descChanged = (v.description ?? '') !== (t.description ?? '');
    const assigneeChanged = (v.assigneeId ?? '') !== (t.assigneeId ?? '');
    const priorityChanged = (v.priority ?? 'Media') !== t.priority;
    const categoryChanged = (v.categoryId ?? '') !== (t.categoryId ?? '');
    const dueChanged = v.dueDate && t.dueDate && new Date(v.dueDate).getTime() !== new Date(t.dueDate).getTime();
    const projectChanged = (v.projectId ?? '') !== (t.projectId ?? '');
    const tagsChanged =
      JSON.stringify([...(v.tags ?? [])].sort()) !== JSON.stringify([...(t.tags ?? [])].sort());
    const subChanged =
      JSON.stringify([...(v.subAssigneeIds ?? [])].sort()) !==
      JSON.stringify([...(t.subAssigneeIds ?? [])].sort());
    return (
      descChanged ||
      assigneeChanged ||
      priorityChanged ||
      categoryChanged ||
      dueChanged ||
      projectChanged ||
      tagsChanged ||
      subChanged
    );
  });

  canSave = computed(() => this.hasChanges() && this.isOnline() && this.form.valid);

  constructor() {
    effect(() => {
      const t = this.task();
      if (t) {
        this.form.patchValue(
          {
            description: t.description ?? '',
            assigneeId: t.assigneeId ?? '',
            priority: t.priority,
            categoryId: t.categoryId ?? '',
            dueDate: t.dueDate ? new Date(t.dueDate) : new Date(),
            projectId: t.projectId ?? '',
            subAssigneeIds: t.subAssigneeIds ?? [],
            tags: t.tags ?? []
          },
          { emitEvent: false }
        );
      }
    });
    this.form.get('assigneeId')?.valueChanges.subscribe((assigneeId) => {
      const subCtrl = this.form.get('subAssigneeIds');
      const subs = (subCtrl?.value ?? []) as string[];
      if (assigneeId && subs.includes(assigneeId)) {
        subCtrl?.setValue(subs.filter((id) => id !== assigneeId), { emitEvent: false });
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim();
    if (value) {
      const tags = [...(this.form.get('tags')?.value ?? []), value];
      this.form.get('tags')?.setValue(tags);
      this.form.get('tags')?.markAsDirty();
    }
    event.chipInput.clear();
  }

  removeTag(tag: string): void {
    const tags = (this.form.get('tags')?.value ?? []).filter((t) => t !== tag);
    this.form.get('tags')?.setValue(tags);
    this.form.get('tags')?.markAsDirty();
  }

  onSave(): void {
    if (!this.canSave()) return;
    const t = this.task();
    if (!t) return;
    const v = this.form.value;
    const user = this.users().find((u) => u.id === v.assigneeId);
    const assigneeId = v.assigneeId ?? '';
    const subAssigneeIds = (v.subAssigneeIds ?? []).filter((id) => id && id !== assigneeId);
    this.saveChanges.emit({
      description: v.description ?? t.description,
      assignee: user?.name ?? 'Sin asignar',
      assigneeId,
      priority: (v.priority as Priority) ?? t.priority,
      categoryId: v.categoryId ?? t.categoryId,
      categoryName: this.categories.find((c) => c.id === v.categoryId)?.name,
      dueDate: v.dueDate ? new Date(v.dueDate) : t.dueDate,
      projectId: v.projectId ?? t.projectId,
      subAssigneeIds,
      tags: v.tags ?? []
    });
    this.isEditing.set(false);
  }

  onCancel(): void {
    const t = this.task();
    if (t) {
      this.form.patchValue(
        {
          description: t.description ?? '',
          assigneeId: t.assigneeId ?? '',
          priority: t.priority,
          categoryId: t.categoryId ?? '',
          dueDate: t.dueDate ? new Date(t.dueDate) : new Date(),
          projectId: t.projectId ?? '',
          subAssigneeIds: t.subAssigneeIds ?? [],
          tags: t.tags ?? []
        },
        { emitEvent: false }
      );
    }
    this.isEditing.set(false);
    this.cancelEdit.emit();
  }

  startEdit(): void {
    this.isEditing.set(true);
  }

  getAssigneeName(id: string): string {
    if (!id) return 'Sin asignar';
    return this.users().find((u) => u.id === id)?.name ?? 'Sin asignar';
  }

  getCategoryName(id: string | undefined): string {
    if (!id) return '—';
    return this.categories.find((c) => c.id === id)?.name ?? '—';
  }

  getProjectName(id: string | undefined): string {
    if (!id) return '—';
    return this.projects().find((p) => p.id === id)?.name ?? '—';
  }

  getSubAssigneeNames(ids: string[] | undefined): string {
    if (!ids?.length) return '—';
    return ids.map((id) => this.getAssigneeName(id)).join(', ');
  }
}
