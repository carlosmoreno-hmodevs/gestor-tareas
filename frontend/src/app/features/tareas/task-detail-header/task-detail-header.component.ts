import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import type { Task, TaskStatus } from '../../../shared/models';

@Component({
  selector: 'app-task-detail-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    AvatarComponent,
    DateFormatPipe
  ],
  templateUrl: './task-detail-header.component.html',
  styleUrl: './task-detail-header.component.scss'
})
export class TaskDetailHeaderComponent {
  task = input.required<Task | null>();
  effectiveStatus = input.required<TaskStatus | null>();
  assigneeName = input<string>('Sin asignar');
  hasOverdueBadge = input(false);

  menuAction = output<string>();

  onMenuAction(action: string): void {
    this.menuAction.emit(action);
  }
}
