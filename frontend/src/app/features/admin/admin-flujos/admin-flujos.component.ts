import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-flujos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, PageHeaderComponent],
  templateUrl: './admin-flujos.component.html',
  styleUrl: './admin-flujos.component.scss'
})
export class AdminFlujosComponent {
  private readonly workflow = inject(TaskWorkflowService);
  private readonly breakpoint = inject(BreakpointObserver);

  isMobile = signal(false);
  transitions = this.workflow.getAllTransitions();

  constructor() {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    this.breakpoint.observe('(max-width: 767px)').subscribe((r) => this.isMobile.set(r.matches));
  }
}
