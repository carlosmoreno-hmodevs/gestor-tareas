import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { workspaceSlugForTenant } from '../config/gamora.config';
import type { CommitmentDetailDto, CommitmentDto, CommitmentEventDto, EvidenceFileDto } from '../../shared/models/commitment.model';

interface ApiListResponse<T> {
  data: T;
}

export interface SimulatorInboundResponse {
  duplicate: boolean;
  inbound_message_id: string;
  outbound_message_id: string;
  reply: string;
  awaiting_confirmation: boolean;
  proposal_cancelled: boolean;
  message_type?: string;
  transcription_status?: 'completed' | 'failed' | 'pending' | null;
  transcript_text?: string | null;
  commitment: {
    id: string;
    folio: string;
    title: string;
    status: string;
  } | null;
}

export type SimulatorInboundPayload =
  | {
      channel_contact_external_id: string;
      external_message_id: string;
      message_type?: 'text';
      text_body: string;
    }
  | {
      channel_contact_external_id: string;
      external_message_id: string;
      message_type: 'audio';
      simulated_transcript?: string;
      simulate_transcription_failure?: boolean;
    };

@Injectable({ providedIn: 'root' })
export class CommitmentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.gamoraApiUrl;

  private headers(tenantId: string): HttpHeaders {
    return new HttpHeaders({
      'X-Workspace-Slug': workspaceSlugForTenant(tenantId),
    });
  }

  async listCommitments(tenantId: string): Promise<CommitmentDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentDto[]>>(`${this.baseUrl}/api/commitments`, {
        headers: this.headers(tenantId),
      })
    );
    return res.data;
  }

  async getCommitment(tenantId: string, id: string): Promise<CommitmentDetailDto> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentDetailDto>>(`${this.baseUrl}/api/commitments/${id}`, {
        headers: this.headers(tenantId),
      })
    );
    return res.data;
  }

  async getCommitmentEvents(tenantId: string, id: string): Promise<CommitmentEventDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentEventDto[]>>(
        `${this.baseUrl}/api/commitments/${id}/events`,
        { headers: this.headers(tenantId) }
      )
    );
    return res.data;
  }

  async patchCommitmentStatus(
    tenantId: string,
    commitmentId: string,
    body: {
      status: string;
      actor_contact_id?: string;
      comment?: string;
    }
  ): Promise<CommitmentDto> {
    const res = await firstValueFrom(
      this.http.patch<ApiListResponse<CommitmentDto>>(
        `${this.baseUrl}/api/commitments/${commitmentId}/status`,
        body,
        { headers: this.headers(tenantId) }
      )
    );
    return res.data;
  }

  async listEvidence(tenantId: string, commitmentId: string): Promise<EvidenceFileDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<EvidenceFileDto[]>>(
        `${this.baseUrl}/api/commitments/${commitmentId}/evidence`,
        { headers: this.headers(tenantId) }
      )
    );
    return res.data;
  }

  async uploadEvidence(
    tenantId: string,
    commitmentId: string,
    file: File,
    actorContactId?: string
  ): Promise<EvidenceFileDto> {
    const form = new FormData();
    form.append('file', file);
    if (actorContactId) form.append('actor_contact_id', actorContactId);
    const res = await firstValueFrom(
      this.http.post<ApiListResponse<EvidenceFileDto>>(
        `${this.baseUrl}/api/commitments/${commitmentId}/evidence`,
        form,
        { headers: this.headers(tenantId) }
      )
    );
    return res.data;
  }

  evidenceFileUrl(tenantId: string, commitmentId: string, evidenceId: string): string {
    return `${this.baseUrl}/api/commitments/${commitmentId}/evidence/${evidenceId}/file`;
  }

  async downloadEvidenceBlob(
    tenantId: string,
    commitmentId: string,
    evidenceId: string
  ): Promise<Blob> {
    return firstValueFrom(
      this.http.get(
        `${this.baseUrl}/api/commitments/${commitmentId}/evidence/${evidenceId}/file`,
        { headers: this.headers(tenantId), responseType: 'blob' }
      )
    );
  }

  async sendSimulatorInbound(
    tenantId: string,
    payload: SimulatorInboundPayload
  ): Promise<SimulatorInboundResponse> {
    return firstValueFrom(
      this.http.post<SimulatorInboundResponse>(`${this.baseUrl}/api/conversations/inbound`, payload, {
        headers: this.headers(tenantId),
      })
    );
  }
}
