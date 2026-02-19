import { Component, inject, computed } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import type { Project, ProjectStatus, ProjectPriority } from '../../../shared/models';
import { DataService } from '../../../core/services/data.service';
import { minDueDateValidator } from '../../../shared/utils/date.utils';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ProjectCatalogService } from '../../../core/services/project-catalog.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';

function dueDateValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const start = group.get('startDate')?.value;
  const due = group.get('dueDate')?.value;
  if (!start || !due) return null;
  if (new Date(due) < new Date(start)) return { dueBeforeStart: true };
  return null;
}

@Component({
  selector: 'app-project-create-dialog',
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
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-create-dialog.component.html',
  styleUrl: './project-create-dialog.component.scss'
})
export class ProjectCreateDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ProjectCreateDialogComponent>);
  private readonly dataService = inject(DataService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly catalog = inject(ProjectCatalogService);
  readonly connectivity = inject(ConnectivityService);

  users = this.dataService.usersForCurrentOrg;
  teamUsers = computed(() =>
    this.users().filter(
      (u) => u.team === this.currentUser.team || this.currentUser.role === 'Admin'
    )
  );
  statuses = this.catalog.getStatuses();
  priorities = this.catalog.getPriorities();

  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  imagePreview = '';
  imageMeta: { name: string; size: number; type: string; previewUrl: string } | null = null;
  initialFiles: { name: string; size: number; type?: string }[] = [];

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      ownerId: ['', Validators.required],
      description: [''],
      status: [''] as [ProjectStatus | ''],
      startDate: [null as Date | null],
      dueDate: [null as Date | null, minDueDateValidator()],
      clientArea: [''],
      memberIds: [[] as string[]],
      tags: [[] as string[]],
      priority: [''] as [ProjectPriority | ''],
      budget: [null as number | null],
      observations: ['']
    },
    { validators: dueDateValidator }
  );

  constructor() {
    this.form.get('ownerId')?.valueChanges.subscribe((ownerId) => {
      const memberCtrl = this.form.get('memberIds');
      const ids = (memberCtrl?.value ?? []) as string[];
      if (ownerId && ids.includes(ownerId)) {
        memberCtrl?.setValue(ids.filter((id) => id !== ownerId), { emitEvent: false });
      }
    });
  }

  get usersForMemberSelect() {
    const ownerId = this.form.get('ownerId')?.value;
    return this.users().filter((u) => u.id !== ownerId);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim();
    if (value) {
      const tags = [...(this.form.get('tags')?.value ?? []), value];
      this.form.get('tags')?.setValue(tags);
    }
    event.chipInput.clear();
  }

  removeTag(tag: string): void {
    const tags = (this.form.get('tags')?.value ?? []).filter((t) => t !== tag);
    this.form.get('tags')?.setValue(tags);
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !/^image\/(png|jpeg|jpg|webp)$/i.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageMeta = {
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: this.imagePreview
      };
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  clearImage(): void {
    this.imagePreview = '';
    this.imageMeta = null;
  }

  onFilesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    for (const f of files) {
      this.initialFiles.push({ name: f.name, size: f.size, type: f.type });
    }
    input.value = '';
  }

  removeFile(idx: number): void {
    this.initialFiles.splice(idx, 1);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (this.form.invalid || !this.connectivity.isOnline()) return;
    const v = this.form.getRawValue();
    const owner = this.users().find((u) => u.id === v.ownerId);
    const ownerId = v.ownerId ?? '';
    const memberIdsFiltered = (v.memberIds ?? []).filter((id) => id && id !== ownerId);
    const members = memberIdsFiltered.map((userId) => ({
      userId,
      role: 'Miembro'
    }));
    if (ownerId && !members.some((m) => m.userId === ownerId)) {
      members.unshift({ userId: ownerId, role: 'Líder' });
    }

    const payload = {
      name: v.name!,
      description: v.description ?? '',
      owner: owner?.name ?? 'Sin asignar',
      ownerId,
      status: (v.status || undefined) as ProjectStatus | undefined,
      image: this.imageMeta ?? undefined,
      startDate: v.startDate ?? undefined,
      dueDate: v.dueDate ?? undefined,
      clientArea: v.clientArea || undefined,
      members,
      tags: v.tags ?? [],
      priority: (v.priority || undefined) as ProjectPriority | undefined,
      budget: v.budget ?? undefined,
      observations: v.observations || undefined,
      filesMeta: this.initialFiles.map((f, i) => ({
        id: `pf-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date(),
        uploadedBy: this.currentUser.name,
        uploadedById: this.currentUser.id
      })),
      milestones: []
    };

    this.dialogRef.close(payload);
  }
}
