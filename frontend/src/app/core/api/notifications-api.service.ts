import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedCommitmentId: string | null;
  readAt: string | null;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.gamoraApiUrl;

  async list(limit = 20): Promise<NotificationDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<NotificationDto[]>>(`${this.baseUrl}/api/notifications`, {
        params: { limit: String(limit) },
      })
    );
    return res.data;
  }

  async unreadCount(): Promise<number> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<{ count: number }>>(`${this.baseUrl}/api/notifications/unread-count`)
    );
    return res.data.count;
  }

  async markRead(id: string): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${this.baseUrl}/api/notifications/${id}/read`, {})
    );
  }

  async markAllRead(): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${this.baseUrl}/api/notifications/read-all`, {})
    );
  }
}
