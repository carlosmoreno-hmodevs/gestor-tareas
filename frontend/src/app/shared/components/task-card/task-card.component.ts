import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { PriorityPillComponent } from '../priority-pill/priority-pill.component';
import type { Task } from '../../models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    StatusChipComponent,
    PriorityPillComponent
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  task = input.required<Task>();
  viewDetail = output<Task>();
  changeStatus = output<Task>();

  onView(e: Event, t: Task): void {
    e.preventDefault();
    this.viewDetail.emit(t);
  }
}
