import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../core/services/project.service';
import { DataService } from '../../../core/services/data.service';
import { TaskService } from '../../../core/services/task.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import type { Project } from '../../../shared/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    DateFormatPipe,
    RelativeTimePipe,
    AvatarComponent
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly dataService = inject(DataService);
  private readonly taskService = inject(TaskService);
  private readonly currentUser = inject(CurrentUserService);
  private readonly snackBar = inject(MatSnackBar);
  readonly connectivity = inject(ConnectivityService);

  projectId = input.required<string>({ alias: 'id' });
  project = computed(() => this.projectService.getProjectById(this.projectId()));
  projectsInScope = this.dataService.projectsForCurrentOrg;
  isProjectInScope = computed(() => {
    const p = this.project();
    if (!p) return false;
    return this.projectsInScope().some((pr) => pr.id === p.id);
  });
  kpis = computed(() => this.projectService.computeKPIs(this.projectId()));
  projectTasks = computed(() => this.projectService.getProjectTasks(this.projectId()));

  users = this.dataService.usersForCurrentOrg;

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  getMilestoneLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      'in-progress': 'En progreso',
      completed: 'Completado'
    };
    return labels[status] ?? status;
  }

  getActivityLabel(type: string): string {
    const labels: Record<string, string> = {
      CREATED: 'Creó el proyecto',
      TASK_ADDED: 'Añadió una tarea',
      TASK_COMPLETED: 'Completó una tarea',
      UPDATED: 'Actualizó el proyecto',
      FILE_UPLOADED: 'Subió un archivo'
    };
    return labels[type] ?? type;
  }

  openAddTask(): void {
    if (!this.connectivity.isOnline()) return;
    this.router.navigate(['/tareas/nueva'], {
      queryParams: { projectId: this.projectId() }
    });
  }

  onMenuAction(action: string): void {
    this.snackBar.open(`Acción "${action}" (placeholder)`, 'Cerrar', { duration: 1500 });
  }

  goToTask(taskId: string): void {
    this.router.navigate(['/tareas', taskId]);
  }

  goBack(): void {
    this.router.navigate(['/proyectos']);
  }
}
