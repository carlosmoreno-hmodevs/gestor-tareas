export interface CommitmentDto {
  id: string;
  workspaceId: string;
  folio: string;
  title: string;
  description: string | null;
  location: string | null;
  status: string;
  requesterContactId: string | null;
  requesterName: string | null;
  dueAt: string | null;
  expectedEvidence: string | null;
  conversationThreadId: string | null;
  originMessageId: string | null;
  assigneeContactId: string | null;
  assigneeName: string | null;
  assigneeStatus: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface CommitmentEventDto {
  id: string;
  commitmentId: string;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  actorContactId: string | null;
  actorUserId: string | null;
  actorContactName?: string | null;
  actorUserName?: string | null;
  actorName?: string | null;
  messageId: string | null;
  payloadJson: Record<string, unknown> | null;
  createdAt: string;
}

export interface CommitmentDetailDto extends CommitmentDto {
  events?: CommitmentEventDto[];
}

export interface EvidenceFileDto {
  id: string;
  workspaceId: string;
  commitmentId: string;
  uploadedByContactId: string | null;
  uploadedByUserId: string | null;
  source: string;
  mediaType: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storageProvider: string;
  createdAt: string;
}
