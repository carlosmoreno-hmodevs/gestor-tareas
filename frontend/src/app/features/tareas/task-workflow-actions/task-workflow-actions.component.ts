import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Transition } from '../../../core/services/task-workflow.service';
import type { TaskStatus } from '../../../shared/models';

@Component({
  selector: 'app-task-workflow-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-workflow-actions.component.html',
  styleUrl: './task-workflow-actions.component.scss'
})
export class TaskWorkflowActionsComponent {
  currentStatus = input.required<TaskStatus | null>();
  allowedTransitions = input<Transition[]>([]);
  isOnline = input(true);

  transitionClicked = output<Transition>();

  onTransition(tr: Transition): void {
    this.transitionClicked.emit(tr);
  }
}
