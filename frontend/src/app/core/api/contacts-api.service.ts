import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ContactStatus = 'active' | 'inactive';

export interface ContactDto {
  id: string;
  workspaceId: string;
  displayName: string;
  phoneNumber: string | null;
  email: string | null;
  position: string | null;
  team: string | null;
  status: ContactStatus;
  userId: string | null;
  userDisplayName: string | null;
  userEmail: string | null;
  simulatorExternalId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
};

interface ApiResponse<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ContactsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.gamoraApiUrl;

  async list(options?: { status?: ContactStatus; activeOnly?: boolean }): Promise<ContactDto[]> {
    let params = new HttpParams();
    if (options?.status) params = params.set('status', options.status);
    if (options?.activeOnly) params = params.set('for_assignment', 'true');
    const res = await firstValueFrom(
      this.http.get<ApiResponse<ContactDto[]>>(`${this.baseUrl}/api/contacts`, { params })
    );
    return res.data;
  }

  async getMe(): Promise<ContactDto> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<ContactDto>>(`${this.baseUrl}/api/contacts/me`)
    );
    return res.data;
  }

  async getById(id: string): Promise<ContactDto> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<ContactDto>>(`${this.baseUrl}/api/contacts/${id}`)
    );
    return res.data;
  }

  async create(body: {
    display_name: string;
    phone_number?: string;
    email?: string;
    position?: string;
    team?: string;
    user_id?: string;
  }): Promise<ContactDto> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<ContactDto>>(`${this.baseUrl}/api/contacts`, body)
    );
    return res.data;
  }

  async update(
    id: string,
    body: {
      display_name?: string;
      phone_number?: string | null;
      email?: string | null;
      position?: string | null;
      team?: string | null;
    }
  ): Promise<ContactDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<ContactDto>>(`${this.baseUrl}/api/contacts/${id}`, body)
    );
    return res.data;
  }

  async updateStatus(id: string, status: ContactStatus): Promise<ContactDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiResponse<ContactDto>>(`${this.baseUrl}/api/contacts/${id}/status`, { status })
    );
    return res.data;
  }
}
