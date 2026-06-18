import type { Contact } from '@prisma/client';
import type { CommitmentExtractionJson } from './ai.types';
import type { ParsedCommitmentIntent } from '../conversations/text-intent.parser';

export interface MappedCommitmentIntent extends ParsedCommitmentIntent {
  assigneeName?: string;
  dueDateText?: string;
  evidenceLabel?: string;
}

export function mapExtractionJsonToIntent(
  json: CommitmentExtractionJson,
  contacts: Contact[],
  inputText: string
): MappedCommitmentIntent {
  const assigneeName = json.assigneeName?.trim();
  let assigneeContactId: string | undefined;
  if (assigneeName) {
    const lower = assigneeName.toLowerCase();
    const contact = contacts.find((c) => c.displayName.toLowerCase() === lower)
      ?? contacts.find((c) => lower.includes(c.displayName.toLowerCase()) || c.displayName.toLowerCase().includes(lower));
    assigneeContactId = contact?.id;
  }

  const activity = json.activity?.trim() ?? '';
  const location = normalizeLocation(json.location);
  const dueDateText = json.dueDateText?.trim();
  const dueAt = parseDueDateText(dueDateText);
  const evidenceLabel = normalizeEvidence(json.evidenceRequired, inputText);

  return {
    title: capitalizeActivity(activity || inputText.slice(0, 120)),
    description: inputText,
    location,
    dueAt,
    dueDateText: dueDateText || undefined,
    expectedEvidence: evidenceLabel ? mapEvidenceToStorage(evidenceLabel) : undefined,
    evidenceLabel,
    assigneeContactId,
    assigneeName: assigneeName || undefined,
    extractionSource: 'ai',
  };
}

export function mapParsedToMapped(parsed: ParsedCommitmentIntent, contacts: Contact[]): MappedCommitmentIntent {
  const assignee = parsed.assigneeContactId
    ? contacts.find((c) => c.id === parsed.assigneeContactId)
    : undefined;

  const dueDateText = parsed.dueDateText ?? inferDueDateText(parsed.dueAt);
  const evidenceLabel = parsed.evidenceLabel ?? inferEvidenceLabel(parsed.expectedEvidence, parsed.description);

  return {
    ...parsed,
    assigneeName: parsed.assigneeName ?? assignee?.displayName,
    dueDateText,
    evidenceLabel,
    extractionSource: 'deterministic',
  };
}

export function mappedToExtractionJson(mapped: MappedCommitmentIntent): CommitmentExtractionJson {
  return {
    intent: 'create_commitment',
    assigneeName: mapped.assigneeName,
    activity: mapped.title,
    location: mapped.location,
    dueDateText: mapped.dueDateText,
    evidenceRequired: mapped.evidenceLabel,
    priority: 'medium',
  };
}

function normalizeLocation(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  let loc = value.trim().split(/\s+y\s+/i)[0].trim();
  loc = loc.replace(/\s+mand[eé]\s+foto.*$/i, '').trim();
  if (!loc) return undefined;
  return /^sucursal\b/i.test(loc) ? capitalizeWords(loc) : `Sucursal ${capitalizeWords(loc)}`;
}

function normalizeEvidence(value?: string, rawText?: string): string | undefined {
  const fromField = value?.trim().toLowerCase();
  if (fromField) {
    if (fromField.includes('foto')) return 'foto';
    return value!.trim();
  }
  const lower = rawText?.toLowerCase() ?? '';
  if (lower.includes('foto')) return 'foto';
  if (lower.includes('evidencia')) return 'evidencia';
  return undefined;
}

function mapEvidenceToStorage(label: string): string {
  if (label.toLowerCase() === 'foto') {
    return 'Fotografía del conteo o evidencia solicitada';
  }
  return label;
}

function parseDueDateText(text?: string): Date | undefined {
  if (!text) return undefined;
  const lower = text.toLowerCase().trim();
  if (lower.includes('mañana')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(17, 0, 0, 0);
    return d;
  }
  if (lower.includes('hoy')) {
    const d = new Date();
    d.setHours(17, 0, 0, 0);
    return d;
  }
  return undefined;
}

function inferDueDateText(dueAt?: Date): string | undefined {
  if (!dueAt) return undefined;
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(dueAt, now)) return 'hoy';
  if (sameDay(dueAt, tomorrow)) return 'mañana';
  return dueAt.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
}

function inferEvidenceLabel(expectedEvidence?: string, rawText?: string): string | undefined {
  const lower = rawText?.toLowerCase() ?? '';
  if (lower.includes('foto')) return 'foto';
  if (expectedEvidence?.toLowerCase().includes('foto')) return 'foto';
  if (expectedEvidence) return 'evidencia';
  return undefined;
}

function capitalizeActivity(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function capitalizeWords(value: string): string {
  return value.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}
