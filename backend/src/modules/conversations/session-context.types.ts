/** Propuesta pendiente de confirmación en conversation_threads.session_context_json */
export interface PendingCommitmentProposal {
  version: 1;
  originMessageId: string;
  requesterContactId: string;
  proposal: {
    title: string;
    description: string;
    location?: string;
    dueAt?: string;
    dueDateText?: string;
    expectedEvidence?: string;
    evidenceLabel?: string;
    assigneeContactId?: string;
    assigneeName?: string;
    rawText: string;
    extractionSource?: 'ai' | 'deterministic';
    aiExtractionId?: string;
  };
  createdAt: string;
}

export const SESSION_STATE = {
  idle: 'idle',
  awaitingConfirmation: 'awaiting_confirmation',
  commitmentCreated: 'commitment_created',
} as const;

export function parseSessionContext(json: unknown): PendingCommitmentProposal | null {
  if (!json || typeof json !== 'object') return null;
  const ctx = json as PendingCommitmentProposal;
  if (ctx.version !== 1 || !ctx.originMessageId || !ctx.proposal?.title) return null;
  return ctx;
}
