import { Injectable, inject, signal } from '@angular/core';
import { SwPush } from '@angular/service-worker';

/** Feature flag: activar Web Push (requiere backend VAPID) */
export const WEB_PUSH_ENABLED = false;

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private readonly swPush = inject(SwPush);

  readonly isSupported = signal(!!this.swPush.isEnabled);
  readonly subscription = signal<PushSubscription | null>(null);

  /** Verifica si el navegador soporta notificaciones push */
  isAvailable(): boolean {
    return WEB_PUSH_ENABLED && 'PushManager' in window && !!this.swPush.isEnabled;
  }

  /** Solicita permiso y suscripción (hook para backend) */
  async requestPermission(): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  /** Suscribe al usuario para Web Push (requiere VAPID público del backend) */
  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.isAvailable()) return null;
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: vapidPublicKey
      });
      this.subscription.set(sub);
      return sub;
      // TODO: enviar 'sub' al backend para guardar la suscripción
    } catch (e) {
      console.warn('Push subscribe failed', e);
      return null;
    }
  }

  /** Cancela la suscripción */
  async unsubscribe(): Promise<void> {
    try {
      await this.swPush.unsubscribe();
      this.subscription.set(null);
    } catch {}
  }
}
