import type { CommitmentEventDto } from '../../shared/models/commitment.model';

/** Etiquetas de estado para timeline (usuario final) */
export const GAMORA_TIMELINE_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  assigned: 'Asignada',
  accepted: 'En progreso',
  evidence_submitted: 'Evidencia enviada',
  in_review: 'En revisión',
  correction_requested: 'Corrección solicitada',
  corrected: 'Corregido',
  closed: 'Cerrado',
  cancelled: 'Cancelado',
};

export const GAMORA_EVENT_TYPE_LABELS: Record<string, string> = {
  created: 'Compromiso creado',
  status_changed: 'Estado actualizado',
  evidence_uploaded: 'Evidencia enviada',
  comment_added: 'Comentario agregado',
  cancelled: 'Compromiso cancelado',
  updated: 'Compromiso actualizado',
};

export function timelineStatusLabel(status: string | null | undefined): string {
  if (!status) return '';
  return GAMORA_TIMELINE_STATUS_LABELS[status] ?? status;
}

export function resolveEventActorName(event: CommitmentEventDto): string {
  if (event.actorName) return event.actorName;
  if (event.actorContactName) return event.actorContactName;
  if (event.actorUserName) return event.actorUserName;
  if (event.eventType === 'created' && !event.actorContactId && !event.actorUserId) {
    return 'Gamora';
  }
  return 'Sistema';
}

export function formatGamoraTimelineText(event: CommitmentEventDto): string {
  const payload = event.payloadJson ?? {};

  switch (event.eventType) {
    case 'created':
      return GAMORA_EVENT_TYPE_LABELS['created'];

    case 'status_changed': {
      const from = timelineStatusLabel(event.fromStatus);
      const to = timelineStatusLabel(event.toStatus);
      if (from && to) {
        let text = `Estado: ${from} → ${to}`;
        const comment = payload['comment'];
        if (typeof comment === 'string' && comment.trim()) {
          text += `\n${comment.trim()}`;
        }
        return text;
      }
      return GAMORA_EVENT_TYPE_LABELS['status_changed'];
    }

    case 'evidence_uploaded': {
      const filename = payload['originalFilename'];
      if (typeof filename === 'string' && filename.trim()) {
        return `Evidencia enviada: ${filename.trim()}`;
      }
      return 'Evidencia enviada';
    }

    case 'comment_added': {
      const comment = payload['comment'];
      if (typeof comment === 'string' && comment.trim()) {
        return comment.trim();
      }
      return GAMORA_EVENT_TYPE_LABELS['comment_added'];
    }

    case 'cancelled':
      return GAMORA_EVENT_TYPE_LABELS['cancelled'];

    case 'updated':
      return GAMORA_EVENT_TYPE_LABELS['updated'];

    default:
      return GAMORA_EVENT_TYPE_LABELS[event.eventType] ?? 'Actividad registrada';
  }
}
