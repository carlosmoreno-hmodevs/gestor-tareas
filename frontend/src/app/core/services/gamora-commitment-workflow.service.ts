import { Injectable } from '@angular/core';

export interface GamoraWorkflowAction {
  key: string;
  label: string;
  description: string;
  targetStatus: string;
  icon: string;
  color?: 'primary' | 'warn' | 'accent';
  requiresComment?: boolean;
}

export interface GamoraFlowStep {
  key: string;
  label: string;
}

export interface GamoraStatusGuidance {
  statusLabel: string;
  summary: string;
  nextStep: string;
}

export interface GamoraEvidenceUploadPolicy {
  canUpload: boolean;
  canView: boolean;
  readOnly: boolean;
  blockedMessage?: string;
  hintMessage?: string;
}

export const GAMORA_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  assigned: 'Asignada',
  accepted: 'En progreso',
  evidence_submitted: 'Evidencia enviada',
  in_review: 'En revisión',
  correction_requested: 'Corrección solicitada',
  corrected: 'Corregida',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
};

export const GAMORA_MAIN_FLOW_STEPS: GamoraFlowStep[] = [
  { key: 'assigned', label: 'Asignada' },
  { key: 'accepted', label: 'Aceptada' },
  { key: 'evidence_submitted', label: 'Evidencia enviada' },
  { key: 'in_review', label: 'En revisión' },
  { key: 'closed', label: 'Cerrada' },
];

export const GAMORA_CORRECTION_STEPS: GamoraFlowStep[] = [
  { key: 'correction_requested', label: 'Corrección solicitada' },
  { key: 'corrected', label: 'Corregida' },
];

const STATUS_ORDER: Record<string, number> = {
  assigned: 0,
  accepted: 1,
  evidence_submitted: 2,
  in_review: 3,
  correction_requested: 3.5,
  corrected: 3.8,
  closed: 4,
  cancelled: -1,
};

@Injectable({ providedIn: 'root' })
export class GamoraCommitmentWorkflowService {
  getStatusLabel(status: string): string {
    return GAMORA_STATUS_LABELS[status] ?? status;
  }

  getStatusGuidance(status: string): GamoraStatusGuidance {
    const statusLabel = this.getStatusLabel(status);
    const guidance: Record<string, Omit<GamoraStatusGuidance, 'statusLabel'>> = {
      assigned: {
        summary: 'Esta tarea fue asignada.',
        nextStep: 'El siguiente paso es que el responsable la acepte.',
      },
      accepted: {
        summary: 'La tarea está en progreso.',
        nextStep: 'El siguiente paso es subir evidencia.',
      },
      evidence_submitted: {
        summary: 'Ya se envió evidencia.',
        nextStep: 'El siguiente paso es enviarla a revisión.',
      },
      in_review: {
        summary: 'La evidencia está en revisión.',
        nextStep: 'Puedes cerrar la tarea o solicitar corrección.',
      },
      correction_requested: {
        summary: 'Se solicitó corrección.',
        nextStep: 'El responsable debe subir evidencia corregida o marcar como corregida.',
      },
      corrected: {
        summary: 'La corrección fue marcada.',
        nextStep: 'El siguiente paso es enviar nuevamente a revisión.',
      },
      closed: {
        summary: 'Ciclo operativo finalizado.',
        nextStep: 'No hay acciones pendientes.',
      },
      cancelled: {
        summary: 'La tarea fue cancelada.',
        nextStep: 'No hay acciones pendientes.',
      },
    };

    const entry = guidance[status] ?? {
      summary: `Estado actual: ${statusLabel}.`,
      nextStep: 'Revisa las acciones disponibles.',
    };

    return { statusLabel, ...entry };
  }

  getEvidenceUploadPolicy(status: string): GamoraEvidenceUploadPolicy {
    switch (status) {
      case 'assigned':
        return {
          canUpload: false,
          canView: true,
          readOnly: false,
          blockedMessage:
            'Primero el responsable debe aceptar la tarea para poder enviar evidencia.',
        };
      case 'accepted':
        return {
          canUpload: true,
          canView: true,
          readOnly: false,
          hintMessage: 'Adjunta foto o documento como prueba de avance.',
        };
      case 'evidence_submitted':
        return {
          canUpload: false,
          canView: true,
          readOnly: false,
          blockedMessage:
            'Ya se envió evidencia. Usa «Enviar evidencia a revisión» para continuar.',
        };
      case 'in_review':
        return {
          canUpload: false,
          canView: true,
          readOnly: false,
          blockedMessage: 'La evidencia está en revisión.',
        };
      case 'correction_requested':
        return {
          canUpload: true,
          canView: true,
          readOnly: false,
          hintMessage: 'Sube la evidencia corregida o marca la tarea como corregida.',
        };
      case 'corrected':
        return {
          canUpload: false,
          canView: true,
          readOnly: false,
          blockedMessage:
            'La corrección ya fue marcada. Envía de nuevo a revisión antes de subir más archivos.',
        };
      case 'closed':
      case 'cancelled':
        return {
          canUpload: false,
          canView: true,
          readOnly: true,
          blockedMessage: 'Esta tarea está en solo lectura.',
        };
      default:
        return {
          canUpload: false,
          canView: true,
          readOnly: true,
          blockedMessage: 'No puedes subir evidencia en el estado actual.',
        };
    }
  }

  canUploadEvidence(commitmentStatus: string): boolean {
    return this.getEvidenceUploadPolicy(commitmentStatus).canUpload;
  }

  canTransition(commitmentStatus: string, targetStatus: string): boolean {
    return this.getAvailableActions(commitmentStatus).some((a) => a.targetStatus === targetStatus);
  }

  getFlowStepState(
    stepKey: string,
    currentStatus: string
  ): 'completed' | 'current' | 'upcoming' | 'skipped' {
    if (currentStatus === 'cancelled') {
      return stepKey === 'assigned' ? 'completed' : 'skipped';
    }
    if (currentStatus === 'closed') {
      const order = STATUS_ORDER[stepKey] ?? 0;
      return order <= STATUS_ORDER['closed'] ? 'completed' : 'upcoming';
    }

    const currentOrder = STATUS_ORDER[currentStatus] ?? 0;
    const stepOrder = STATUS_ORDER[stepKey] ?? 0;

    if (currentStatus === stepKey) return 'current';
    if (stepOrder < currentOrder) return 'completed';
    if (['correction_requested', 'corrected'].includes(currentStatus) && stepKey === 'in_review') {
      return 'completed';
    }
    return 'upcoming';
  }

  isCorrectionBranch(status: string): boolean {
    return status === 'correction_requested' || status === 'corrected';
  }

  getAvailableActions(commitmentStatus: string): GamoraWorkflowAction[] {
    switch (commitmentStatus) {
      case 'assigned':
        return [
          {
            key: 'accept',
            label: 'Aceptar tarea',
            description: 'Confirma que el responsable acepta realizar esta tarea.',
            targetStatus: 'accepted',
            icon: 'check_circle',
            color: 'primary',
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      case 'accepted':
        return [
          {
            key: 'upload_hint',
            label: 'Sube evidencia para continuar',
            description: 'Usa el panel de evidencia para adjuntar foto o documento.',
            targetStatus: 'accepted',
            icon: 'upload_file',
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      case 'evidence_submitted':
        return [
          {
            key: 'submit_review',
            label: 'Enviar evidencia a revisión',
            description: 'El solicitante podrá aprobarla o pedir corrección.',
            targetStatus: 'in_review',
            icon: 'send',
            color: 'primary',
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      case 'in_review':
        return [
          {
            key: 'close',
            label: 'Cerrar tarea',
            description: 'Aprueba el trabajo y finaliza el ciclo operativo.',
            targetStatus: 'closed',
            icon: 'verified',
            color: 'primary',
          },
          {
            key: 'request_correction',
            label: 'Solicitar corrección',
            description: 'Pide al responsable que corrija o reenvíe evidencia.',
            targetStatus: 'correction_requested',
            icon: 'edit',
            requiresComment: true,
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      case 'correction_requested':
        return [
          {
            key: 'mark_corrected',
            label: 'Marcar como corregido',
            description: 'Usa esta opción cuando la evidencia corregida ya fue enviada.',
            targetStatus: 'corrected',
            icon: 'task_alt',
            color: 'primary',
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      case 'corrected':
        return [
          {
            key: 'resubmit_review',
            label: 'Enviar de nuevo a revisión',
            description: 'Devuelve la tarea a revisión con la corrección aplicada.',
            targetStatus: 'in_review',
            icon: 'send',
            color: 'primary',
          },
          {
            key: 'cancel',
            label: 'Cancelar tarea',
            description: 'Cancela el compromiso si ya no aplica.',
            targetStatus: 'cancelled',
            icon: 'cancel',
            color: 'warn',
            requiresComment: true,
          },
        ];
      default:
        return [];
    }
  }
}
