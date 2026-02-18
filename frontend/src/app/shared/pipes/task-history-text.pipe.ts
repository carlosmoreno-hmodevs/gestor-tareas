import { Pipe, PipeTransform } from '@angular/core';
import type { TaskHistoryEntry } from '../models';

@Pipe({ name: 'taskHistoryText', standalone: true })
export class TaskHistoryTextPipe implements PipeTransform {
  transform(entry: TaskHistoryEntry): string {
    const d = entry.details ?? {};
    switch (entry.type) {
      case 'CREATED':
        return 'Tarea creada';
      case 'STATUS_CHANGED':
        return d.fromStatus && d.toStatus
          ? `Estado: ${d.fromStatus} → ${d.toStatus}${d.comment ? ` — ${d.comment}` : ''}`
          : 'Cambio de estado';
      case 'EDITED':
        return d.field ? `Editado: ${d.field}` : 'Edición';
      case 'REASSIGNED':
        return 'Reasignación de responsable';
      case 'COMMENT_ADDED':
        return d.comment ? d.comment : 'Comentario agregado';
      case 'DUE_DATE_CHANGED':
        return d.newDueDate ? `Fecha límite: ${new Date(d.newDueDate).toLocaleDateString('es-ES')}` : 'Fecha límite modificada';
      case 'CANCELLED':
        return d.comment ? `Cancelada: ${d.comment}` : 'Tarea cancelada';
      case 'REJECTED':
        return d.comment ? `Rechazada: ${d.comment}` : 'Tarea rechazada';
      case 'RESCHEDULED':
        return d.comment ? `Reagendada: ${d.comment}` : 'Tarea reagendada';
      case 'ATTACHMENT_ADDED':
        return d.fileNames?.length ? `Adjuntó: ${d.fileNames.join(', ')}` : 'Archivo adjuntado';
      case 'PARENT_CHANGED':
        return d.newValue ? 'Subtask asignada a otra tarea' : 'Subtask desvinculada';
      case 'LINK_ADDED':
        return 'Dependencia/enlace agregada';
      case 'LINK_REMOVED':
        return 'Dependencia/enlace eliminada';
      default:
        return entry.type ?? 'Actividad';
    }
  }
}
