import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TaskService } from '../../../core/services/task.service';
import { DataService } from '../../../core/services/data.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import type { Task } from '../../../shared/models';

@Component({
  selector: 'app-ia-task-cards',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, AvatarComponent],
  templateUrl: './ia-task-cards.component.html',
  styleUrl: './ia-task-cards.component.scss'
})
export class IaTaskCardsComponent {
  readonly taskService = inject(TaskService);
  private readonly dataService = inject(DataService);
  private readonly workflow = inject(TaskWorkflowService);

  readonly tasks = input<Task[]>([]);

  getUserById(id: string | undefined) {
    if (!id) return undefined;
    return this.dataService.getUsers().find((u) => u.id === id);
  }

  getUserByName(name: string | undefined) {
    if (!name) return undefined;
    return this.dataService.getUsers().find((u) => u.name === name);
  }

  getEffectiveStatus(task: Task): string {
    return this.workflow.getEffectiveStatus(task);
  }
}
