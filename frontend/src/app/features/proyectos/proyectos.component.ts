import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from '../../core/services/data.service';
import { ProjectService } from '../../core/services/project.service';
import { ConnectivityService } from '../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageHeaderComponent,
    AvatarComponent
  ],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.scss'
})
export class ProyectosComponent {
  private readonly dataService = inject(DataService);
  private readonly projectService = inject(ProjectService);
  readonly connectivity = inject(ConnectivityService);

  projects = this.dataService.getProjects();
  users = this.dataService.getUsers();

  getKpis(projectId: string) {
    return this.projectService.computeKPIs(projectId);
  }

  getUserByName(name: string) {
    return this.users.find((u) => u.name === name);
  }
}
