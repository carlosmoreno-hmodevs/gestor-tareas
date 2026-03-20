import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Redirige a /tareas con vista Tablero (antes en /tablero).
 */
@Component({
  selector: 'app-tasks-board-redirect',
  standalone: true,
  template: ''
})
export class TasksBoardRedirectComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.router.navigate(['/tareas'], {
      replaceUrl: true,
      queryParams: { vista: 'tablero' }
    });
  }
}
