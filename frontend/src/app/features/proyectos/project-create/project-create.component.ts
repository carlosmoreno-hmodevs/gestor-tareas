import { Component, inject, computed, signal } from '@angular/core';
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
import { minDueDateValidator, normalizeDateToNoonLocal } from '../../../shared/utils/date.utils';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ProjectCatalogService } from '../../../core/services/project-catalog.service';
import { ProjectService } from '../../../core/services/project.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';
import { FERRETERO_PROJECT_TEMPLATES, FERRETERO_TASK_TEMPLATES } from '../../../core/data/ferretero-initial';
import type { ProjectTemplate } from '../../../shared/models/project-template.model';
import type { ProjectTemplateBuilderItem } from '../../../shared/models/project-template-builder.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ProjectTemplateBuilderComponent } from '../project-template-builder/project-template-builder.component';
import { TaskPickerInlineComponent } from '../task-picker-inline/task-picker-inline.component';

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
    MatSlideToggleModule,
    MatTabsModule,
    PageHeaderComponent,
    ProjectTemplateBuilderComponent,
    TaskPickerInlineComponent
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
  private readonly tenantSettings = inject(TenantSettingsService);

  isFerretero = this.tenantSettings.isFerretero;
  projectTemplates = FERRETERO_PROJECT_TEMPLATES;
  taskTemplates = FERRETERO_TASK_TEMPLATES;
  selectedTemplateId = signal<string>('');
  builderItems = signal<ProjectTemplateBuilderItem[]>([]);
  selectedExistingTaskIds = signal<string[]>([]);
  /** El picker emite si puede proceder (false cuando hay tareas en otro proyecto sin confirmar) */
  tasksPickerCanProceed = signal(true);

  users = this.dataService.usersForCurrentOrg;
  orgUnits = this.orgService.getOrgUnits(this.tenantContext.currentTenantId() ?? '');
  teamUsers = computed(() => {
    const base = this.users().filter(
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
  get categoriesList() {
    return this.dataService.getCategories();
  }

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
      dueDate: [null as Date | null, minDueDateValidator()],
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

  applyProjectTemplate(templateId: string): void {
    if (!templateId) {
      this.selectedTemplateId.set('');
      this.builderItems.set([]);
      return;
    }
    const t = this.projectTemplates.find((x: ProjectTemplate) => x.id === templateId);
    if (!t) return;
    this.selectedTemplateId.set(templateId);
    this.form.patchValue({
      name: t.nameTemplate,
      description: t.description ?? ''
    });
    const ownerId = this.form.get('ownerId')?.value ?? '';
    const owner = this.users().find((u) => u.id === ownerId);
    const rawDue = this.form.get('dueDate')?.value;
    const dueDate = rawDue
      ? (normalizeDateToNoonLocal(rawDue as Date) ?? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 0, 0, 0))
      : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 0, 0, 0);
    const items: ProjectTemplateBuilderItem[] = (t.taskTemplateIds ?? []).map((tplId, i) => {
      const tt = FERRETERO_TASK_TEMPLATES.find((x) => x.id === tplId);
      const overrides = t.taskOverrides?.[tplId];
      const descParts: string[] = [];
      if (tt?.descriptionText?.trim()) descParts.push(tt.descriptionText!.trim());
      if (tt?.evidenceHint?.trim()) descParts.push('Evidencia: ' + tt.evidenceHint!.trim());
      if (tt?.controlNotes?.trim()) descParts.push('Nota: ' + tt.controlNotes!.trim());
      return {
        key: `tpl-${Date.now()}-${tplId}-${i}`,
        taskTemplateId: tplId,
        included: true,
        title: overrides?.title ?? tt?.titleTemplate ?? tplId,
        categoryId: overrides?.categoryId ?? tt?.categoryId ?? '',
        priority: (overrides?.priority ?? 'Media') as string,
        assigneeId: ownerId,
        dueDate,
        description: descParts.join('\n\n'),
        checklistItems: [...(tt?.checklistItems ?? [])]
      };
    });
    this.builderItems.set(items);
  }

  get selectedProjectTemplate(): ProjectTemplate | null {
    const id = this.selectedTemplateId();
    return id ? (this.projectTemplates.find((x: ProjectTemplate) => x.id === id) ?? null) : null;
  }

  get previewTaskTitles(): string[] {
    const tpl = this.selectedProjectTemplate;
    if (!tpl?.taskTemplateIds?.length) return [];
    return tpl.taskTemplateIds.map((id: string) => {
      const tt = FERRETERO_TASK_TEMPLATES.find((t) => t.id === id);
      return tt?.name ?? id;
    });
  }

  cancel(): void {
    this.router.navigate(['/proyectos']);
  }

  save(): void {
    if (this.form.invalid || !this.connectivity.isOnline()) return;

    this.saving = true;
    const v = this.form.getRawValue();
    const owner = this.users().find((u) => u.id === v.ownerId);
    const ownerId = v.ownerId ?? '';
    const memberIdsFiltered = (v.memberIds ?? []).filter((id) => id && id !== ownerId);
    const members: { userId: string; role: 'Miembro' | 'Líder' }[] = memberIdsFiltered.map((userId) => ({ userId, role: 'Miembro' }));
    if (ownerId && !members.some((m) => m.userId === ownerId)) {
      members.unshift({ userId: ownerId, role: 'Líder' });
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

    const tplId = this.selectedTemplateId();
    const tpl = tplId ? this.projectTemplates.find((x: ProjectTemplate) => x.id === tplId) : null;
    if (this.isFerretero() && tpl) {
      Object.assign(payload, {
        templateId: tpl.id,
        templateName: tpl.name,
        templateAppliedAt: new Date().toISOString(),
        templateAppliedByUserId: this.currentUser.id,
        templateTasksGenerated: false
      });
    }

    const project = this.projectService.createProject(payload);

    const includedItems = this.builderItems().filter((i: ProjectTemplateBuilderItem) => i.included);
    if (this.isFerretero() && project.templateId && includedItems.length > 0) {
      const count = this.projectService.createTasksFromBuilder(project.id, includedItems);
      if (count > 0) {
        this.snackBar.open(`Proyecto creado con ${count} tareas`, 'Cerrar', { duration: 4000 });
      } else {
        this.snackBar.open('Proyecto creado correctamente', 'Cerrar', { duration: 3000 });
      }
    } else {
      this.snackBar.open('Proyecto creado correctamente', 'Cerrar', { duration: 3000 });
    }

    const existingIds = this.selectedExistingTaskIds();
    if (existingIds.length > 0) {
      const result = this.projectService.linkTasksToProject(project.id, existingIds, true);
      if (result.linked > 0) {
        this.snackBar.open(`${result.linked} tarea(s) existente(s) asociada(s) al proyecto`, 'Cerrar', { duration: 3000 });
      }
    }

    this.saving = false;
    this.router.navigate(['/proyectos', project.id]);
  }
}
