import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Priority } from '../../models';

@Component({
  selector: 'app-priority-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-pill.component.html',
  styleUrl: './priority-pill.component.scss'
})
export class PriorityPillComponent {
  priority = input.required<Priority>();
}
