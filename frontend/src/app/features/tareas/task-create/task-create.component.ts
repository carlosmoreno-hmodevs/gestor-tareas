import { Component, inject, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
import type { Task, Priority } from '../../../shared/models';
import { DataService } from '../../../core/services/data.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-task-create',
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
    PageHeaderComponent,
    AvatarComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly orgService = inject(OrgService);
  private readonly dataService = inject(DataService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly tenantContext = inject(TenantContextService);
  readonly connectivity = inject(ConnectivityService);
  private readonly snackBar = inject(MatSnackBar);

  /** Si se viene desde un proyecto, el ID está fijado y no se puede cambiar */
  fixedProjectId: string | null = null;
  fixedProjectName = '';

  users = this.dataService.getUsers();
  categories = this.dataService.getCategories();
  orgUnits = this.orgService.getOrgUnits(this.tenantContext.currentTenantId() ?? '');
  priorities = this.dataService.getPriorities();
  projects = this.dataService.getProjects();

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

  minDate = new Date();

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    categoryId: [''],
    priority: ['Media' as Priority],
    assigneeId: ['', Validators.required],
    subAssigneeIds: [[]] as [string[]],
    dueDate: [new Date()],
    projectId: [''],
    orgUnitId: [''],
    tags: ['']
  });

  tagInput = '';
  selectedFiles: { name: string; size: number }[] = [];
  saving = false;

  ngOnInit(): void {
    const projectId = this.route.snapshot.queryParamMap.get('projectId');
    if (projectId) {
      this.fixedProjectId = projectId;
      const proj = this.projectService.getProjectById(projectId);
      this.fixedProjectName = proj?.name ?? projectId;
      this.form.patchValue({ projectId });
      this.form.get('projectId')?.disable();
    }
  }

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
      this.selectedFiles.push({ name: files[i].name, size: files[i].size });
    }
    input.value = '';
  }

  removeFile(idx: number): void {
    this.selectedFiles.splice(idx, 1);
  }

  cancel(): void {
    this.router.navigate(['/tareas']);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.connectivity.isOnline()) return;

    this.saving = true;
    const v = this.form.getRawValue();
    const projectId = this.fixedProjectId ?? v.projectId;
    const folio = `TASK-${String(Date.now()).slice(-6)}`;
    const assignee = this.users.find((u) => u.id === v.assigneeId);
    const category = this.categories.find((c) => c.id === v.categoryId);
    const subIds = v.subAssigneeIds ?? [];
    const subNames = subIds.map((id) => this.users.find((u) => u.id === id)?.name ?? '').filter(Boolean);

    const payload = {
      tenantId: this.tenantContext.currentTenantId() ?? 'tenant-1',
      folio,
      title: v.title!,
      description: v.description ?? '',
      assignee: assignee?.name ?? 'Sin asignar',
      assigneeId: v.assigneeId ?? '',
      status: 'Pendiente' as const,
      priority: (v.priority ?? 'Media') as Priority,
      dueDate: v.dueDate ? new Date(v.dueDate) : new Date(),
      riskIndicator: 'ok' as const,
      tags: this.tagsList,
      attachmentsCount: this.selectedFiles.length,
      commentsCount: 0,
      createdAt: new Date(),
      createdBy: this.currentUser.id,
      createdByName: this.currentUser.name,
      projectId: v.projectId || undefined,
      orgUnitId: (v as { orgUnitId?: string }).orgUnitId || undefined,
      categoryId: v.categoryId || undefined,
      categoryName: category?.name,
      subAssigneeIds: subIds,
      subAssignees: subNames,
      attachments: this.selectedFiles.map((f, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        size: f.size,
        uploadedAt: new Date(),
        uploadedBy: this.currentUser.name
      })),
      history: []
    } as Omit<Task, 'id' | 'history'>;

    const task = this.taskService.createTask(payload);
    this.saving = false;
    this.snackBar.open('Tarea creada correctamente', 'Cerrar', { duration: 3000 });

    if (this.fixedProjectId) {
      this.projectService.addActivity(this.fixedProjectId, {
        type: 'TASK_ADDED',
        timestamp: new Date(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        details: { taskId: task.id, taskTitle: task.title }
      });
      this.router.navigate(['/proyectos', this.fixedProjectId]);
    } else {
      this.router.navigate(['/tareas']);
    }
  }
}
