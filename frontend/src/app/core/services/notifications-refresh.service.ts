import { Injectable, signal } from '@angular/core';

/** Señal compartida para refrescar campanita tras acciones que generan notificaciones. */
@Injectable({ providedIn: 'root' })
export class NotificationsRefreshService {
  private readonly _tick = signal(0);
  readonly tick = this._tick.asReadonly();

  bump(): void {
    this._tick.update((n) => n + 1);
  }
}
