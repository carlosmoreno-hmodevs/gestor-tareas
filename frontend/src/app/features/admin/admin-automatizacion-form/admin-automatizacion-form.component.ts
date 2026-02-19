import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AutomationService } from '../../../core/services/automation.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { AdminService } from '../../../core/services/admin.service';
import { ProjectService } from '../../../core/services/project.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { Automation, AutomationFrequency, AutomationType, DayOfWeek, MonthEndRule } from '../../../shared/models/automation.model';

const WEEKDAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];

@Component({
  selector: 'app-admin-automatizacion-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-automatizacion-form.component.html',
  styleUrl: './admin-automatizacion-form.component.scss'
})
export class AdminAutomatizacionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly automationService = inject(AutomationService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly adminService = inject(AdminService);
  private readonly projectService = inject(ProjectService);

  readonly isEdit = signal(false);
  readonly automationId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly weekdayOptions = WEEKDAY_OPTIONS;

  categories = this.adminService.getCategories();
  users = this.adminService.getUsers();
  projects = computed(() => this.projectService.getProjects());

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    active: [true],
    type: ['task_template' as AutomationType, Validators.required],
    projectId: [''],
    title: ['', Validators.required],
    description: [''],
    categoryId: [''],
    assigneeId: [''],
    tags: [''],
    dueInDays: [7, [Validators.required, Validators.min(1), Validators.max(365)]],
    frequency: ['daily' as AutomationFrequency, Validators.required],
    interval: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
    timeOfDay: ['09:00', [Validators.required, Validators.pattern(/^\d{1,2}:\d{2}$/)]],
    weeklyDays: [[] as DayOfWeek[]],
    monthlyDay: [1, [Validators.min(1), Validators.max(31)]],
    monthEndRule: ['skip' as MonthEndRule],
    startDate: ['', Validators.required],
    endDate: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.automationId.set(id);
      this.isEdit.set(true);
      const tid = this.tenantContext.currentTenantId();
      if (tid) {
        const a = this.automationService.getById(tid, id);
        if (a) {
          this.form.patchValue({
            name: a.name,
            active: a.active,
            type: a.type,
            projectId: a.projectId ?? '',
            title: a.taskBlueprint.title,
            description: a.taskBlueprint.description ?? '',
            categoryId: a.taskBlueprint.categoryId ?? '',
            assigneeId: a.taskBlueprint.assigneeId ?? '',
            tags: (a.taskBlueprint.tags ?? []).join(', '),
            dueInDays: a.taskBlueprint.dueInDays ?? 7,
            frequency: a.frequency,
            interval: a.interval,
            timeOfDay: a.timeOfDay,
            weeklyDays: a.weeklyDays ?? [],
            monthlyDay: a.monthlyDay ?? 1,
            monthEndRule: a.monthEndRule ?? 'skip',
            startDate: a.startDate,
            endDate: a.endDate ?? ''
          });
        }
      }
    } else {
      const today = new Date();
      this.form.patchValue({
        startDate: today.toISOString().slice(0, 10),
        weeklyDays: [1]
      });
    }
  }

  toggleWeekday(day: DayOfWeek): void {
    const current = (this.form.get('weeklyDays')?.value ?? []) as DayOfWeek[];
    const set = new Set(current);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    this.form.get('weeklyDays')?.setValue(Array.from(set));
  }

  hasWeekday(day: DayOfWeek): boolean {
    return ((this.form.get('weeklyDays')?.value ?? []) as DayOfWeek[]).includes(day);
  }

  submit(): void {
    if (this.form.invalid) return;
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    const v = this.form.getRawValue();
    const startDate = v.startDate!;
    const endDate = v.endDate?.trim() || undefined;
    if (endDate && startDate > endDate) {
      this.form.get('endDate')?.setErrors({ min: true });
      return;
    }
    const nextRunAt = this.automationService.computeInitialNextRunAt({
      startDate,
      endDate: endDate ?? undefined,
      frequency: v.frequency!,
      interval: v.interval!,
      timeOfDay: v.timeOfDay!,
      weeklyDays: v.weeklyDays?.length ? v.weeklyDays : undefined,
      monthlyDay: v.monthlyDay ?? undefined,
      monthEndRule: (v.monthEndRule ?? 'skip') as MonthEndRule
    });

    const blueprint = {
      title: v.title!,
      description: v.description?.trim() || undefined,
      categoryId: v.categoryId?.trim() || undefined,
      assigneeId: v.assigneeId?.trim() || undefined,
      tags: v.tags ? v.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      projectId: v.projectId?.trim() || undefined,
      dueInDays: v.dueInDays ?? 7
    };

    this.saving.set(true);
    try {
      if (this.isEdit() && this.automationId()) {
        this.automationService.update(tid, this.automationId()!, {
          name: v.name!,
          active: v.active!,
          type: v.type!,
          projectId: v.projectId?.trim() || undefined,
          taskBlueprint: blueprint,
          frequency: v.frequency!,
          interval: v.interval!,
          timeOfDay: v.timeOfDay!,
          weeklyDays: v.weeklyDays?.length ? v.weeklyDays : undefined,
          monthlyDay: v.monthlyDay ?? undefined,
          monthEndRule: (v.monthEndRule ?? 'skip') as MonthEndRule,
          startDate,
          endDate: endDate ?? undefined
        });
        this.router.navigate(['/admin/automatizaciones']);
      } else {
        this.automationService.create(tid, {
          name: v.name!,
          active: v.active!,
          type: v.type!,
          projectId: v.projectId?.trim() || undefined,
          taskBlueprint: blueprint,
          frequency: v.frequency!,
          interval: v.interval!,
          timeOfDay: v.timeOfDay!,
          weeklyDays: v.weeklyDays?.length ? v.weeklyDays : undefined,
          monthlyDay: v.monthlyDay ?? undefined,
          monthEndRule: (v.monthEndRule ?? 'skip') as MonthEndRule,
          startDate,
          endDate: endDate ?? undefined,
          nextRunAt
        });
        this.router.navigate(['/admin/automatizaciones']);
      }
    } finally {
      this.saving.set(false);
    }
  }
}
