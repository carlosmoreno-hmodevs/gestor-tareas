import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { TaskService } from '../../../core/services/task.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import type { Task, TaskChecklistItem } from '../../../shared/models';

@Component({
  selector: 'app-task-checklist-section',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatCardModule],
  template: `
    @if (task()?.checklist?.length) {
      <mat-card class="checklist-card">
        <mat-card-header>
          <mat-card-title>Checklist</mat-card-title>
          <mat-card-subtitle>{{ completedCount() }}/{{ task()!.checklist!.length }} completados</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <ul class="checklist-list">
            @for (item of task()!.checklist!; track item.id) {
              <li class="checklist-item" [class.done]="item.isDone">
                <mat-checkbox
                  [checked]="item.isDone"
                  [disabled]="!isOnline()"
                  (change)="onToggle(item)"
                >
                  {{ item.text }}
                </mat-checkbox>
              </li>
            }
          </ul>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .checklist-card {
        margin-top: 1rem;
      }
      .checklist-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .checklist-item {
        padding: 0.25rem 0;
      }
      .checklist-item.done mat-checkbox {
        text-decoration: line-through;
        opacity: 0.7;
      }
    `
  ]
})
export class TaskChecklistSectionComponent {
  private readonly taskService = inject(TaskService);
  private readonly currentUser = inject(CurrentUserService);

  task = input.required<Task | null>();
  isOnline = input(true);
  checklistUpdated = output<void>();

  completedCount() {
    const items = this.task()?.checklist ?? [];
    return items.filter((i) => i.isDone).length;
  }

  onToggle(item: TaskChecklistItem): void {
    const t = this.task();
    if (!t?.checklist || !this.isOnline()) return;
    const updated = t.checklist.map((i) =>
      i.id === item.id
        ? {
            ...i,
            isDone: !i.isDone,
            doneAt: !i.isDone ? new Date().toISOString() : undefined,
            doneByUserId: !i.isDone ? this.currentUser.id : undefined
          }
        : i
    );
    this.taskService.updateTask(t.id, { checklist: updated });
    this.checklistUpdated.emit();
  }
}
