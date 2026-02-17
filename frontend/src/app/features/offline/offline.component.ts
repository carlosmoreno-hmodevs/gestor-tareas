import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="offline-page">
      <mat-icon class="offline-hero">cloud_off</mat-icon>
      <h1>Sin conexión a Internet</h1>
      <p>
        No tienes conexión en este momento. Puedes seguir consultando las tareas que teníamos guardadas
        localmente (último estado conocido).
      </p>
      <p class="hint">
        Cuando recuperes la conexión, la aplicación se actualizará automáticamente. Las acciones que
        requieren internet (crear tarea, exportar, etc.) estarán deshabilitadas hasta entonces.
      </p>
      <a mat-flat-button color="primary" routerLink="/tablero">Ver tablero</a>
      <a mat-button routerLink="/tareas">Ver tareas</a>
    </div>
  `,
  styles: [`
    .offline-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem;
      text-align: center;
    }
    .offline-hero {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ff9800;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin: 0 0 1rem;
    }
    p {
      max-width: 400px;
      margin: 0 0 1rem;
      color: #757575;
    }
    .hint {
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }
    a {
      margin: 0 0.5rem;
    }
  `]
})
export class OfflineComponent {}
