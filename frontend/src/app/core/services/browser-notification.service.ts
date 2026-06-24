import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import type { NotificationDto } from '../api/notifications-api.service';

export type BrowserNotificationPermission = NotificationPermission | 'unsupported';

@Injectable({ providedIn: 'root' })
export class BrowserNotificationService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): BrowserNotificationPermission {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  async requestPermission(): Promise<BrowserNotificationPermission> {
    if (!this.isSupported()) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    return Notification.requestPermission();
  }

  /** Marca el cursor en el lote actual sin mostrar popups (inicio de sesión o tras activar). */
  baselineFromNotifications(notifications: NotificationDto[]): void {
    const latest = this.latestCreatedAt(notifications);
    if (latest) {
      this.setCursor(latest);
    } else if (!this.getCursor()) {
      this.setCursor(new Date().toISOString());
    }
  }

  /** Muestra popups solo para notificaciones más nuevas que el cursor. */
  processNewNotifications(notifications: NotificationDto[]): void {
    if (this.getPermission() !== 'granted') return;

    const cursor = this.getCursor();
    const fresh = notifications
      .filter((n) => !cursor || n.createdAt > cursor)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    if (!fresh.length) return;

    for (const n of fresh) {
      this.showOne(n);
    }
    this.setCursor(fresh[fresh.length - 1].createdAt);
  }

  resetCursor(): void {
    const key = this.storageKey();
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }

  private showOne(n: NotificationDto): void {
    try {
      const desktop = new Notification(n.title, {
        body: n.message,
        tag: n.id,
        icon: '/assets/logo-orkesta.png',
      });
      desktop.onclick = () => {
        window.focus();
        desktop.close();
        if (n.relatedCommitmentId) {
          void this.router.navigate(['/tareas', n.relatedCommitmentId]);
        }
      };
    } catch {
      /* ignore — permisos o contexto no válido */
    }
  }

  private latestCreatedAt(notifications: NotificationDto[]): string | null {
    if (!notifications.length) return null;
    return notifications.reduce((max, n) => (n.createdAt > max ? n.createdAt : max), notifications[0].createdAt);
  }

  private storageKey(): string | null {
    const userId = this.auth.user()?.id;
    if (!userId) return null;
    return `gamora_notif_desktop_cursor_${userId}`;
  }

  private getCursor(): string | null {
    const key = this.storageKey();
    if (!key) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setCursor(iso: string): void {
    const key = this.storageKey();
    if (!key) return;
    try {
      localStorage.setItem(key, iso);
    } catch {
      /* ignore */
    }
  }
}
