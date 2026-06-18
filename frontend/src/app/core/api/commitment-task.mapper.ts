import type { CommitmentDetailDto, CommitmentDto, CommitmentEventDto, EvidenceFileDto } from '../../shared/models/commitment.model';

import type { Task, TaskHistoryEntry, TaskStatus, TaskAttachment } from '../../shared/models';

import { environment } from '../../../environments/environment';

import {

  formatGamoraTimelineText,

  resolveEventActorName,

  timelineStatusLabel,

} from './commitment-event-labels';



const STATUS_MAP: Record<string, TaskStatus> = {

  draft: 'Pendiente',

  assigned: 'Pendiente',

  accepted: 'En Progreso',

  evidence_submitted: 'En Progreso',

  in_review: 'En Progreso',

  correction_requested: 'En Espera',

  corrected: 'En Progreso',

  pending_close: 'En Progreso',

  closed: 'Completada',

  cancelled: 'Cancelada',

  rejected: 'Rechazada',

};



export function mapCommitmentStatus(status: string): TaskStatus {

  return STATUS_MAP[status] ?? 'Pendiente';

}



function isAutoEvidenceStatusChange(
  event: CommitmentEventDto,
  previous: CommitmentEventDto | null
): boolean {
  if (event.eventType !== 'status_changed') return false;
  if (event.fromStatus !== 'accepted' || event.toStatus !== 'evidence_submitted') return false;
  if (!previous || previous.eventType !== 'evidence_uploaded') return false;
  const delta =
    new Date(event.createdAt).getTime() - new Date(previous.createdAt).getTime();
  return delta >= 0 && delta <= 10_000;
}

/** Oculta en UI el status_changed automático tras subir evidencia (auditoría en BD intacta). */
function filterEventsForTimeline(events: CommitmentEventDto[]): CommitmentEventDto[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return sorted.filter((event, index) => {
    if (index === 0) return true;
    return !isAutoEvidenceStatusChange(event, sorted[index - 1] ?? null);
  });
}

function mapEventToHistory(event: CommitmentEventDto): TaskHistoryEntry {

  const type =

    event.eventType === 'created'

      ? 'CREATED'

      : event.eventType === 'status_changed'

        ? 'STATUS_CHANGED'

        : event.eventType === 'comment_added'

          ? 'COMMENT_ADDED'

          : event.eventType === 'cancelled'

            ? 'CANCELLED'

            : 'EDITED';



  const timelineText = formatGamoraTimelineText(event);

  const payload = event.payloadJson ?? {};

  const comment =

    typeof payload['comment'] === 'string' ? payload['comment'] : undefined;



  return {

    id: event.id,

    type,

    timestamp: new Date(event.createdAt),

    userId: 'gamora',

    userName: resolveEventActorName(event),

    details: {

      timelineText,

      fromStatus: event.fromStatus ? mapCommitmentStatus(event.fromStatus) : undefined,

      toStatus: event.toStatus ? mapCommitmentStatus(event.toStatus) : undefined,

      fromStatusLabel: timelineStatusLabel(event.fromStatus),

      toStatusLabel: timelineStatusLabel(event.toStatus),

      comment,

    },

  };

}



function riskFromDue(dueAt: string | null, status: TaskStatus): Task['riskIndicator'] {

  if (!dueAt || ['Completada', 'Liberada', 'Cancelada'].includes(status)) return 'ok';

  const due = new Date(dueAt);

  const now = new Date();

  if (due < now) return 'vencida';

  const diff = due.getTime() - now.getTime();

  if (diff < 48 * 60 * 60 * 1000) return 'por-vencer';

  return 'ok';

}



export function evidenceToAttachment(

  e: EvidenceFileDto,

  tenantId: string,

  commitmentId: string

): TaskAttachment {

  const base = environment.gamoraApiUrl;

  return {

    id: e.id,

    name: e.originalFilename,

    size: e.sizeBytes,

    type: e.mimeType,

    uploadedAt: new Date(e.createdAt),

    url: `${base}/api/commitments/${commitmentId}/evidence/${e.id}/file`,

  };

}



export function commitmentToTask(

  c: CommitmentDto | CommitmentDetailDto,

  tenantId: string,

  evidence: EvidenceFileDto[] = []

): Task {

  const status = mapCommitmentStatus(c.status);

  const dueDate = c.dueAt ? new Date(c.dueAt) : new Date();

  const events = 'events' in c && c.events ? c.events : [];



  const history: TaskHistoryEntry[] = events.length

    ? filterEventsForTimeline(events).map((e) => mapEventToHistory(e))

    : [

        {

          id: `hist-${c.id}-created`,

          type: 'CREATED',

          timestamp: new Date(c.createdAt),

          userId: 'gamora',

          userName: c.requesterName ?? 'Gamora',

          details: {

            timelineText: 'Compromiso creado',

            comment: c.originMessageId

              ? 'Origen: mensaje conversacional (simulador)'

              : 'Compromiso creado',

          },

        },

      ];



  const descriptionParts = [

    c.description,

    c.location ? `Ubicación: ${c.location}` : null,

    c.expectedEvidence ? `Evidencia esperada: ${c.expectedEvidence}` : null,

  ].filter(Boolean);



  const attachments: TaskAttachment[] = evidence.map((e) => evidenceToAttachment(e, tenantId, c.id));



  return {

    id: c.id,

    tenantId,

    folio: c.folio,

    title: c.title,

    description: descriptionParts.join('\n'),

    assignee: c.assigneeName ?? 'Sin asignar',

    assigneeId: c.assigneeContactId ?? '',

    status,

    priority: 'Media',

    dueDate,

    riskIndicator: riskFromDue(c.dueAt, status),

    tags: ['gamora', 'compromiso'],

    attachmentsCount: attachments.length,

    commentsCount: 0,

    createdAt: new Date(c.createdAt),

    createdBy: c.requesterContactId ?? 'system',

    createdByName: c.requesterName ?? undefined,

    history,

    observations: c.status,

    attachments,

  };

}



export function commitmentsToTasks(items: CommitmentDto[], tenantId: string): Task[] {

  return items.map((c) => commitmentToTask(c, tenantId));

}


