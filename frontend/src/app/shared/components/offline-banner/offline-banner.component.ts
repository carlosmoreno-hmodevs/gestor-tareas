import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ConnectivityService } from '../../../core/services/connectivity.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    @if (!connectivity.isOnline()) {
      <div class="offline-banner" role="alert">
        <mat-icon>cloud_off</mat-icon>
        <span>Sin conexión. Mostrando último estado conocido.</span>
        <a routerLink="/offline" class="offline-link">Más información</a>
      </div>
    } @else {
      <div class="online-hint" title="Última sincronización">
        <mat-icon>cloud_done</mat-icon>
        <span>{{ connectivity.formatLastSync() }}</span>
      </div>
    }
  `,
  styles: [`
    .offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #ff9800;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .offline-banner a {
      color: inherit;
      text-decoration: underline;
      margin-left: 0.5rem;
    }
    .offline-banner mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .online-hint {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      color: #757575;
      font-size: 0.75rem;
    }
    .online-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class OfflineBannerComponent {
  readonly connectivity = inject(ConnectivityService);
}
