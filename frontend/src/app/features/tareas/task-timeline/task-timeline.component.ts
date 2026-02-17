import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { TaskHistoryTextPipe } from '../../../shared/pipes/task-history-text.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import type { TaskHistoryEntry } from '../../../shared/models';

@Component({
  selector: 'app-task-timeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    AvatarComponent,
    TaskHistoryTextPipe,
    RelativeTimePipe
  ],
  templateUrl: './task-timeline.component.html',
  styleUrl: './task-timeline.component.scss'
})
export class TaskTimelineComponent {
  history = input<TaskHistoryEntry[]>([]);
  isOnline = input(true);
  taskId = input.required<string>();

  commentSubmitted = output<string>();
  itemMenuAction = output<{ entry: TaskHistoryEntry; action: string }>();

  sortedHistory = () => {
    const h = this.history() ?? [];
    return [...h].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  commentText = '';

  getUserDisplayName(entry: TaskHistoryEntry): string {
    return entry.userName ?? entry.userId ?? 'Usuario';
  }

  onSubmitComment(): void {
    const text = this.commentText.trim();
    if (!text || !this.isOnline()) return;
    this.commentSubmitted.emit(text);
    this.commentText = '';
  }

  onItemMenu(entry: TaskHistoryEntry, action: string): void {
    this.itemMenuAction.emit({ entry, action });
  }
}
