import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CommitmentDetailDto,
  CommitmentDto,
  CommitmentEventDto,
  CommitmentListPageDto,
  CommitmentListParams,
  CommitmentSummaryDto,
  EvidenceFileDto,
} from '../../shared/models/commitment.model';

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

  private buildListParams(params?: CommitmentListParams): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.assigneeContactId) httpParams = httpParams.set('assigneeContactId', params.assigneeContactId);
    if (params.priority) httpParams = httpParams.set('priority', params.priority);
    if (params.dueFrom) httpParams = httpParams.set('dueFrom', params.dueFrom);
    if (params.dueTo) httpParams = httpParams.set('dueTo', params.dueTo);
    if (params.overdue) httpParams = httpParams.set('overdue', 'true');
    if (params.dueWithin48h) httpParams = httpParams.set('dueWithin48h', 'true');
    if (params.unassigned) httpParams = httpParams.set('unassigned', 'true');
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.page !== undefined) httpParams = httpParams.set('page', String(params.page));
    if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', String(params.pageSize));
    return httpParams;
  }

  async getSummary(_tenantId: string): Promise<CommitmentSummaryDto> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentSummaryDto>>(`${this.baseUrl}/api/commitments/summary`)
    );
    return res.data;
  }

  async listCommitments(
    _tenantId: string,
    params?: CommitmentListParams
  ): Promise<CommitmentDto[]> {
    const result = await this.listCommitmentsPage(_tenantId, params);
    return result.items;
  }

  async listCommitmentsPage(
    _tenantId: string,
    params?: CommitmentListParams
  ): Promise<CommitmentListPageDto> {
    const httpParams = this.buildListParams(params);
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentDto[] | CommitmentListPageDto>>(
        `${this.baseUrl}/api/commitments`,
        { params: httpParams }
      )
    );
    const data = res.data;
    if (Array.isArray(data)) {
      return { items: data, total: data.length, page: 1, pageSize: data.length };
    }
    return data;
  }

  async getCommitment(_tenantId: string, id: string): Promise<CommitmentDetailDto> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentDetailDto>>(`${this.baseUrl}/api/commitments/${id}`)
    );
    return res.data;
  }

  async getCommitmentEvents(_tenantId: string, id: string): Promise<CommitmentEventDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<CommitmentEventDto[]>>(`${this.baseUrl}/api/commitments/${id}/events`)
    );
    return res.data;
  }

  async patchCommitmentStatus(
    _tenantId: string,
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
        body
      )
    );
    return res.data;
  }

  async listEvidence(_tenantId: string, commitmentId: string): Promise<EvidenceFileDto[]> {
    const res = await firstValueFrom(
      this.http.get<ApiListResponse<EvidenceFileDto[]>>(
        `${this.baseUrl}/api/commitments/${commitmentId}/evidence`
      )
    );
    return res.data;
  }

  async uploadEvidence(
    _tenantId: string,
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
        form
      )
    );
    return res.data;
  }

  evidenceFileUrl(_tenantId: string, commitmentId: string, evidenceId: string): string {
    return `${this.baseUrl}/api/commitments/${commitmentId}/evidence/${evidenceId}/file`;
  }

  async downloadEvidenceBlob(
    _tenantId: string,
    commitmentId: string,
    evidenceId: string
  ): Promise<Blob> {
    return firstValueFrom(
      this.http.get(`${this.baseUrl}/api/commitments/${commitmentId}/evidence/${evidenceId}/file`, {
        responseType: 'blob',
      })
    );
  }

  async sendSimulatorInbound(
    _tenantId: string,
    payload: SimulatorInboundPayload
  ): Promise<SimulatorInboundResponse> {
    return firstValueFrom(
      this.http.post<SimulatorInboundResponse>(`${this.baseUrl}/api/conversations/inbound`, payload)
    );
  }

  async createCommitment(body: {
    title: string;
    description?: string;
    location?: string;
    assignee_contact_id?: string;
    expected_evidence?: string;
    due_at?: string;
  }): Promise<CommitmentDto> {
    const res = await firstValueFrom(
      this.http.post<ApiListResponse<CommitmentDto>>(`${this.baseUrl}/api/commitments`, body)
    );
    return res.data;
  }
}
