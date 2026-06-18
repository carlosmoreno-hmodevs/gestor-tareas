import type { Contact } from '@prisma/client';
import type { MappedCommitmentIntent } from '../ai/commitment-intent.mapper';

function assigneeDisplay(parsed: MappedCommitmentIntent, contacts: Contact[]): string {
  if (parsed.assigneeName) return parsed.assigneeName;
  if (parsed.assigneeContactId) {
    const contact = contacts.find((c) => c.id === parsed.assigneeContactId);
    if (contact) return contact.displayName;
  }
  return parsed.mentionedAssigneeName ?? '—';
}

/** Mensaje outbound pidiendo confirmación humana — formato estructurado */
export function buildConfirmationPrompt(
  parsed: MappedCommitmentIntent,
  contacts: Contact[]
): string {
  const lines = ['Entendí tu instrucción:', ''];
  lines.push(`Actividad: ${parsed.title}`);
  lines.push(`Responsable: ${assigneeDisplay(parsed, contacts)}`);

  if (parsed.location) {
    lines.push(`Ubicación: ${parsed.location}`);
  }

  if (parsed.dueDateText) {
    lines.push(`Fecha: ${parsed.dueDateText}`);
  } else if (parsed.dueAt) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    if (sameDay(parsed.dueAt, tomorrow)) {
      lines.push('Fecha: mañana');
    } else if (sameDay(parsed.dueAt, now)) {
      lines.push('Fecha: hoy');
    } else {
      lines.push('Fecha: sin fecha indicada');
    }
  } else {
    lines.push('Fecha: sin fecha indicada');
  }

  if (parsed.evidenceLabel) {
    lines.push(`Evidencia: ${parsed.evidenceLabel}`);
  }

  lines.push('', '¿Confirmas?');
  return lines.join('\n');
}

export function buildAssigneeNotFoundMessage(name: string): string {
  return `No encontré a ${name} como responsable registrado. ¿Quieres seleccionar otro responsable?`;
}
