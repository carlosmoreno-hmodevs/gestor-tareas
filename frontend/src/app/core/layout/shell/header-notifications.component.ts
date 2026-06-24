import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationsApiService, type NotificationDto } from '../../api/notifications-api.service';
import { TaskService } from '../../services/task.service';
import { NotificationsRefreshService } from '../../services/notifications-refresh.service';
import {
  BrowserNotificationService,
  type BrowserNotificationPermission,
} from '../../services/browser-notification.service';
import { AuthService } from '../../auth/auth.service';

const POLL_INTERVAL_MS = 45_000;

@Component({
  selector: 'app-header-notifications',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule],
  templateUrl: './header-notifications.component.html',
  styleUrl: './header-notifications.component.scss',
})
export class HeaderNotificationsComponent implements OnDestroy {
  private readonly api = inject(NotificationsApiService);
  private readonly taskService = inject(TaskService);
  private readonly refreshBus = inject(NotificationsRefreshService);
  private readonly browserNotif = inject(BrowserNotificationService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  items = signal<NotificationDto[]>([]);
  unreadCount = signal(0);
  loading = signal(false);
  loadError = signal<string | null>(null);
  desktopPermission = signal<BrowserNotificationPermission>('default');

  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private sessionBaselined = false;

  constructor() {
    this.desktopPermission.set(this.browserNotif.getPermission());

    effect(() => {
      const active = this.taskService.gamoraApiActive();
      const token = this.auth.token();
      this.refreshBus.tick();

      if (!active || !token) {
        this.unreadCount.set(0);
        this.items.set([]);
        this.sessionBaselined = false;
        this.browserNotif.resetCursor();
        this.stopPolling();
        return;
      }

      void this.bootstrapSession();
      this.startPolling();
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  desktopSupported(): boolean {
    return this.browserNotif.isSupported();
  }

  async onMenuOpen(): Promise<void> {
    if (!this.taskService.gamoraApiActive() || !this.auth.token()) return;
    this.desktopPermission.set(this.browserNotif.getPermission());
    this.loading.set(true);
    this.loadError.set(null);
    try {
      const [items, count] = await Promise.all([this.api.list(15), this.api.unreadCount()]);
      this.items.set(items);
      this.unreadCount.set(count);
    } catch {
      this.loadError.set('No se pudieron cargar las notificaciones.');
    } finally {
      this.loading.set(false);
    }
  }

  async enableDesktopNotifications(): Promise<void> {
    const result = await this.browserNotif.requestPermission();
    this.desktopPermission.set(result);
    if (result === 'granted') {
      try {
        const items = await this.api.list(20);
        this.browserNotif.baselineFromNotifications(items);
      } catch {
        /* ignore */
      }
    }
  }

  async markAllRead(): Promise<void> {
    await this.api.markAllRead();
    this.unreadCount.set(0);
    this.items.update((list) =>
      list.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    );
  }

  async openNotification(n: NotificationDto): Promise<void> {
    if (!n.readAt) {
      await this.api.markRead(n.id);
      this.unreadCount.update((c) => Math.max(0, c - 1));
      this.items.update((list) =>
        list.map((item) =>
          item.id === n.id ? { ...item, readAt: new Date().toISOString() } : item
        )
      );
    }
    if (n.relatedCommitmentId) {
      void this.router.navigate(['/tareas', n.relatedCommitmentId]);
    }
  }

  private async bootstrapSession(): Promise<void> {
    if (this.sessionBaselined) {
      await this.pollOnce();
      return;
    }
    try {
      const items = await this.api.list(20);
      this.browserNotif.baselineFromNotifications(items);
      this.unreadCount.set(await this.api.unreadCount());
      this.sessionBaselined = true;
    } catch {
      this.loadError.set('Sin conexión con notificaciones');
    }
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => void this.pollOnce(), POLL_INTERVAL_MS);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async pollOnce(): Promise<void> {
    if (!this.taskService.gamoraApiActive() || !this.auth.token()) return;
    try {
      const [items, count] = await Promise.all([this.api.list(20), this.api.unreadCount()]);
      this.unreadCount.set(count);
      this.loadError.set(null);
      this.browserNotif.processNewNotifications(items);
    } catch {
      /* mantener último contador conocido */
    }
  }
}
