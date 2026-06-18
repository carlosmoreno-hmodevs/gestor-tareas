import type { Contact } from '@prisma/client';

export interface ParsedCommitmentIntent {
  title: string;
  description: string;
  location?: string;
  dueAt?: Date;
  dueDateText?: string;
  expectedEvidence?: string;
  evidenceLabel?: string;
  assigneeContactId?: string;
  assigneeName?: string;
  mentionedAssigneeName?: string;
  assigneeNotFound?: boolean;
  extractionSource?: 'ai' | 'deterministic';
}

const INSTRUCTION_PREFIX =
  /^(?:dile|p[ií]dele|asigna|encarga)\s+a\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s+que\s+(.+)$/iu;

const LOCATION_REGEX =
  /\b(?:de la|en la|del|en el|en)\s+(sucursal|tienda|almac[eé]n)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ0-9]+)/iu;

const EVIDENCE_STRIP_PATTERNS: Array<{ regex: RegExp; label: 'foto' | 'evidencia' }> = [
  {
    regex: /\s*(?:,|\.)?\s*(?:y\s+)?que\s+(?:mand[eé]|env[ií]e|suba)\s+(?:una\s+)?foto\.?/iu,
    label: 'foto',
  },
  {
    regex: /\s*(?:,|\.)?\s*(?:y\s+)?(?:mand[eé]|env[ií]e|suba)\s+(?:una\s+)?foto\.?/iu,
    label: 'foto',
  },
  {
    regex: /\s*(?:,|\.)?\s*(?:y\s+)?que\s+(?:mand[eé]|env[ií]e|suba)\s+evidencia\.?/iu,
    label: 'evidencia',
  },
  {
    regex: /\s*(?:,|\.)?\s*(?:y\s+)?(?:mand[eé]|env[ií]e|suba)\s+evidencia\.?/iu,
    label: 'evidencia',
  },
];

const IRREGULAR_VERBS: Record<string, string> = {
  saque: 'sacar',
  cuente: 'contar',
  haga: 'hacer',
  tenga: 'tener',
  vaya: 'ir',
  diga: 'decir',
  ponga: 'poner',
  salga: 'salir',
};

const LOWERCASE_LOCATION_NAMES = new Set(['sur', 'norte', 'este', 'oeste']);

/** Parser determinístico — sin LLM; fallback cuando IA está desactivada o falla */
export function parseCommitmentFromText(
  text: string,
  contacts: Contact[]
): ParsedCommitmentIntent {
  const normalized = text.trim().replace(/\s+/g, ' ');
  const prefixMatch = normalized.match(INSTRUCTION_PREFIX);

  let mentionedAssigneeName: string | undefined;
  let activityRaw = normalized;

  if (prefixMatch) {
    mentionedAssigneeName = capitalizeName(prefixMatch[1]);
    activityRaw = prefixMatch[2].trim();
  }

  const evidence = extractEvidence(activityRaw);
  activityRaw = evidence.stripped;

  const locationResult = extractLocation(activityRaw);
  activityRaw = locationResult.stripped;

  const due = extractDueDate(activityRaw);
  activityRaw = due.stripped;

  let activity = activityRaw
    .replace(/\s+y\s+que\s*$/iu, '')
    .replace(/\s+que\s*$/iu, '')
    .replace(/[.,]\s*$/u, '')
    .trim();

  const title = verbToInfinitiveTitle(activity);

  const assigneeMatch = resolveAssignee(mentionedAssigneeName, contacts, normalized);
  const assigneeNotFound = Boolean(mentionedAssigneeName && !assigneeMatch.contactId);

  return {
    title: title || normalized.slice(0, 120),
    description: normalized,
    location: locationResult.location,
    dueAt: due.dueAt,
    dueDateText: due.dueDateText,
    expectedEvidence: evidence.expected,
    evidenceLabel: evidence.label,
    assigneeContactId: assigneeMatch.contactId,
    assigneeName: assigneeMatch.displayName,
    mentionedAssigneeName,
    assigneeNotFound,
    extractionSource: 'deterministic',
  };
}

function resolveAssignee(
  mentionedName: string | undefined,
  contacts: Contact[],
  fullText: string
): { contactId?: string; displayName?: string } {
  if (mentionedName) {
    const lower = mentionedName.toLowerCase();
    const exact = contacts.find((c) => c.displayName.toLowerCase() === lower);
    if (exact) return { contactId: exact.id, displayName: exact.displayName };
    const partial = contacts.find(
      (c) =>
        lower.includes(c.displayName.toLowerCase()) ||
        c.displayName.toLowerCase().includes(lower)
    );
    if (partial) return { contactId: partial.id, displayName: partial.displayName };
    return {};
  }

  const lowerText = fullText.toLowerCase();
  for (const contact of contacts) {
    const name = contact.displayName.toLowerCase();
    if (lowerText.includes(name)) {
      return { contactId: contact.id, displayName: contact.displayName };
    }
  }
  return {};
}

function extractEvidence(text: string): {
  label?: string;
  expected?: string;
  stripped: string;
} {
  for (const pattern of EVIDENCE_STRIP_PATTERNS) {
    if (pattern.regex.test(text)) {
      return {
        label: pattern.label,
        expected:
          pattern.label === 'foto'
            ? 'Fotografía del conteo o evidencia solicitada'
            : 'Evidencia solicitada',
        stripped: text.replace(pattern.regex, '').replace(/\s+/g, ' ').trim(),
      };
    }
  }
  return { stripped: text };
}

function extractLocation(text: string): { location?: string; stripped: string } {
  const match = text.match(LOCATION_REGEX);
  if (!match) return { stripped: text };

  const tipo = match[1]
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  const name = match[2].trim();
  const tipoLabel =
    tipo === 'sucursal' ? 'Sucursal' : tipo === 'tienda' ? 'Tienda' : 'Almacén';
  const location = `${tipoLabel} ${formatLocationName(name)}`;
  const stripped = text.replace(match[0], ' ').replace(/\s+/g, ' ').trim();

  return { location, stripped };
}

function extractDueDate(text: string): {
  dueAt?: Date;
  dueDateText?: string;
  stripped: string;
} {
  const lower = text.toLowerCase();
  let stripped = text;

  if (/\bmañana\b/u.test(lower)) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 1);
    dueAt.setHours(17, 0, 0, 0);
    stripped = stripped.replace(/^\s*mañana\s+/iu, '').trim();
    return { dueAt, dueDateText: 'mañana', stripped };
  }

  if (/\bhoy\b/u.test(lower)) {
    const dueAt = new Date();
    dueAt.setHours(17, 0, 0, 0);
    stripped = stripped.replace(/^\s*hoy\s+/iu, '').trim();
    return { dueAt, dueDateText: 'hoy', stripped };
  }

  return { stripped };
}

function verbToInfinitiveTitle(activity: string): string {
  const trimmed = activity.trim();
  if (!trimmed) return trimmed;

  const words = trimmed.split(/\s+/);
  const verb = words[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

  let infinitive = IRREGULAR_VERBS[verb];
  if (!infinitive) {
    if (verb.endsWith('e') && verb.length > 3) {
      infinitive = `${verb.slice(0, -1)}ar`;
    } else if (verb.endsWith('a') && verb.length > 3) {
      infinitive = `${verb.slice(0, -1)}ar`;
    } else {
      infinitive = verb;
    }
  }

  words[0] = capitalizeName(infinitive);
  return words.join(' ');
}

function formatLocationName(name: string): string {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (LOWERCASE_LOCATION_NAMES.has(lower)) return lower;
  return capitalizeName(trimmed);
}

function capitalizeName(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
