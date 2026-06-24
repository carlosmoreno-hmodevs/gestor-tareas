import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ApiUserRole = 'admin' | 'coordinator' | 'assignee' | 'viewer';
export type ApiUserStatus = 'active' | 'suspended' | 'inactive';

export interface WorkspaceUserDto {
  id: string;
  email: string;
  displayName: string;
  role: ApiUserRole;
  status: ApiUserStatus;
  contactId: string | null;
  contactDisplayName: string | null;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
}

interface CreateUserResponse {
  data: WorkspaceUserDto;
  meta?: { temporary_password?: string };
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.gamoraApiUrl;

  async list(): Promise<WorkspaceUserDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<WorkspaceUserDto[]>>(`${this.baseUrl}/api/users`)
    );
    return res.data;
  }

  async getById(id: string): Promise<WorkspaceUserDto> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<WorkspaceUserDto>>(`${this.baseUrl}/api/users/${id}`)
    );
    return res.data;
  }

  async create(body: {
    email: string;
    display_name: string;
    role: ApiUserRole;
    password?: string;
    create_contact?: boolean;
  }): Promise<{ user: WorkspaceUserDto; temporaryPassword?: string }> {
    const res = await firstValueFrom(
      this.http.post<CreateUserResponse>(`${this.baseUrl}/api/users`, body)
    );
    return {
      user: res.data,
      temporaryPassword: res.meta?.temporary_password,
    };
  }

  async update(
    id: string,
    body: { display_name?: string; role?: ApiUserRole; email?: string }
  ): Promise<WorkspaceUserDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<WorkspaceUserDto>>(`${this.baseUrl}/api/users/${id}`, body)
    );
    return res.data;
  }

  async updateStatus(id: string, status: ApiUserStatus): Promise<WorkspaceUserDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<WorkspaceUserDto>>(`${this.baseUrl}/api/users/${id}/status`, {
        status,
      })
    );
    return res.data;
  }

  async getMe(): Promise<WorkspaceUserDto> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<WorkspaceUserDto>>(`${this.baseUrl}/api/users/me`)
    );
    return res.data;
  }

  async updateMe(body: { display_name?: string }): Promise<WorkspaceUserDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<WorkspaceUserDto>>(`${this.baseUrl}/api/users/me`, body)
    );
    return res.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/api/users/me/password`, {
        current_password: currentPassword,
        new_password: newPassword,
      })
    );
  }
}

export const USER_ROLE_LABELS: Record<ApiUserRole, string> = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  assignee: 'Operador',
  viewer: 'Solo lectura',
};

export const USER_STATUS_LABELS: Record<ApiUserStatus, string> = {
  active: 'Activo',
  suspended: 'Suspendido',
  inactive: 'Inactivo',
};

export function isUserActive(status: ApiUserStatus): boolean {
  return status === 'active';
}
