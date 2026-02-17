import { Injectable, inject, signal, computed } from '@angular/core';
import { fromEvent, merge, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

const STORAGE_KEY_LAST_SYNC = 'gestor-tareas:lastSync';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly _online = toSignal(
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).pipe(startWith(navigator.onLine)),
    { initialValue: navigator.onLine }
  );

  readonly isOnline = computed(() => this._online() ?? navigator.onLine);
  readonly lastSync = signal<Date | null>(this.loadLastSync());

  private loadLastSync(): Date | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
      return raw ? new Date(raw) : null;
    } catch {
      return null;
    }
  }

  markSync(): void {
    const now = new Date();
    this.lastSync.set(now);
    try {
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, now.toISOString());
    } catch {}
  }

  formatLastSync(): string {
    const d = this.lastSync();
    if (!d) return 'Nunca';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
