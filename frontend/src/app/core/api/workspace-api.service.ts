import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WorkspaceSettingsDto {
  timezone?: string;
  logoUrl?: string | null;
  audio_enabled?: boolean;
  audio_max_duration_seconds?: number;
  audio_max_size_bytes?: number;
  evidenceRequiredDefault?: boolean;
  defaultDueDays?: number;
  allowAssigneeEvidenceAfterReview?: boolean;
}

export interface WorkspaceDto {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  settings: WorkspaceSettingsDto;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.gamoraApiUrl;

  async getCurrent(): Promise<WorkspaceDto> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<WorkspaceDto>>(`${this.baseUrl}/api/workspaces/current`)
    );
    return res.data;
  }

  async updateCurrent(body: {
    name?: string;
    settings?: Partial<WorkspaceSettingsDto>;
  }): Promise<WorkspaceDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<WorkspaceDto>>(`${this.baseUrl}/api/workspaces/current`, body)
    );
    return res.data;
  }
}
