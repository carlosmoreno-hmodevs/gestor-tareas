import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-denied',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="denied-container">
      <mat-icon class="denied-icon">lock</mat-icon>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para acceder a la administración.</p>
      <button mat-flat-button color="primary" routerLink="/tablero">Volver al tablero</button>
    </div>
  `,
  styles: [`
    .denied-container {
      text-align: center;
      padding: 3rem 1.5rem;
    }
    .denied-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--color-text-secondary, #757575);
      margin-bottom: 1rem;
    }
    h2 { margin: 0 0 0.5rem; }
    p { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
  `]
})
export class AdminDeniedComponent {}
