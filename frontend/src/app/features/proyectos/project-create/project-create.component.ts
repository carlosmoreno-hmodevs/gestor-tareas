import { Component, inject, computed } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import type { ProjectStatus, ProjectPriority } from '../../../shared/models';
import { DataService } from '../../../core/services/data.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ProjectCatalogService } from '../../../core/services/project-catalog.service';
import { ProjectService } from '../../../core/services/project.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

function dueDateValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const start = group.get('startDate')?.value;
  const due = group.get('dueDate')?.value;
  if (!start || !due) return null;
  if (new Date(due) < new Date(start)) return { dueBeforeStart: true };
  return null;
}

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly catalog = inject(ProjectCatalogService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snackBar = inject(MatSnackBar);
  readonly connectivity = inject(ConnectivityService);

  users = this.dataService.getUsers();
  orgUnits = this.orgService.getOrgUnits(this.tenantContext.currentTenantId() ?? '');
  teamUsers = computed(() => {
    const base = this.users.filter(
      (u) => u.team === this.currentUser.team || this.currentUser.role === 'Admin'
    );
    const tid = this.tenantContext.currentTenantId();
    const scopeOuId = this.orgService.selectedOrgUnitId();
    if (!tid || !scopeOuId) return base;
    const userIdsInScope = this.orgService.getUserIdsInScope(tid, scopeOuId);
    if (userIdsInScope.length === 0) return base;
    return base.filter((u) => userIdsInScope.includes(u.id));
  });
  statuses = this.catalog.getStatuses();
  priorities = this.catalog.getPriorities();

  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

  imagePreview = '';
  imageMeta: { name: string; size: number; type: string; previewUrl: string } | null = null;
  initialFiles: { name: string; size: number; type?: string }[] = [];
  saving = false;

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      ownerId: ['', Validators.required],
      description: [''],
      status: [''] as [ProjectStatus | ''],
      startDate: [null as Date | null],
      dueDate: [null as Date | null],
      clientArea: [''],
      primaryOrgUnitId: [''],
      memberIds: [[] as string[]],
      tags: [[] as string[]],
      priority: [''] as [ProjectPriority | ''],
      budget: [null as number | null],
      observations: ['']
    },
    { validators: dueDateValidator }
  );

  tagInput = '';

  addTagFromInput(): void {
    const value = this.tagInput.trim();
    if (value) {
      const tags = [...(this.form.get('tags')?.value ?? []), value];
      this.form.get('tags')?.setValue(tags);
      this.tagInput = '';
    }
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
    this.router.navigate(['/proyectos']);
  }

  save(): void {
    if (this.form.invalid || !this.connectivity.isOnline()) return;

    this.saving = true;
    const v = this.form.getRawValue();
    const owner = this.users.find((u) => u.id === v.ownerId);
    const members = (v.memberIds ?? []).map((userId) => ({ userId, role: 'Miembro' }));
    if (v.ownerId && !members.some((m) => m.userId === v.ownerId)) {
      members.unshift({ userId: v.ownerId, role: 'Líder' });
    }

    const payload = {
      name: v.name!,
      description: v.description ?? '',
      owner: owner?.name ?? 'Sin asignar',
      ownerId: v.ownerId ?? '',
      status: (v.status || undefined) as ProjectStatus | undefined,
      image: this.imageMeta ?? undefined,
      startDate: v.startDate ?? undefined,
      dueDate: v.dueDate ?? undefined,
      clientArea: v.clientArea || undefined,
      members,
      tags: v.tags ?? [],
      primaryOrgUnitId: (v as { primaryOrgUnitId?: string }).primaryOrgUnitId || undefined,
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

    const project = this.projectService.createProject(payload);
    this.saving = false;
    this.snackBar.open('Proyecto creado correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/proyectos', project.id]);
  }
}
