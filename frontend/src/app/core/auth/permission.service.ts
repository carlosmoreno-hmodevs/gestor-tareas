import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import type { GamoraWorkflowAction } from '../services/gamora-commitment-workflow.service';
import type { GamoraEvidenceUploadPolicy } from '../services/gamora-commitment-workflow.service';

export type AppUserRole = 'admin' | 'coordinator' | 'assignee' | 'viewer';

const REVIEW_ONLY_ACTION_KEYS = new Set(['close', 'request_correction', 'cancel']);
const ASSIGNEE_OPERATIVE_KEYS = new Set(['accept', 'mark_corrected']);
const SUBMIT_REVIEW_KEYS = new Set(['submit_review', 'resubmit_review']);

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  readonly role = computed(() => (this.auth.user()?.role as AppUserRole | undefined) ?? null);
  readonly isReadOnly = computed(() => this.role() === 'viewer');
  readonly canAccessAdmin = computed(() => this.role() === 'admin');
  readonly canManageContacts = computed(() => {
    const r = this.role();
    return r === 'admin' || r === 'coordinator';
  });
  readonly canReview = computed(() => {
    const r = this.role();
    return r === 'admin' || r === 'coordinator';
  });
  readonly canCreateCommitment = computed(() => this.canReview());
  readonly contactId = computed(() => this.auth.contactId());

  isAssignedToMe(assigneeContactId: string | null | undefined): boolean {
    const mine = this.contactId();
    return !!mine && !!assigneeContactId && mine === assigneeContactId;
  }

  canPerformAction(action: GamoraWorkflowAction, assigneeContactId?: string | null): boolean {
    const role = this.role();
    if (!role || role === 'viewer') return false;

    if (REVIEW_ONLY_ACTION_KEYS.has(action.key)) {
      return role === 'admin' || role === 'coordinator';
    }

    if (SUBMIT_REVIEW_KEYS.has(action.key)) {
      if (role === 'admin' || role === 'coordinator') return true;
      return role === 'assignee' && this.isAssignedToMe(assigneeContactId);
    }

    if (ASSIGNEE_OPERATIVE_KEYS.has(action.key)) {
      if (role === 'admin') return true;
      return role === 'assignee' && this.isAssignedToMe(assigneeContactId);
    }

    return role === 'admin' || role === 'coordinator';
  }

  filterWorkflowActions(
    actions: GamoraWorkflowAction[],
    assigneeContactId?: string | null
  ): GamoraWorkflowAction[] {
    return actions.filter((a) => this.canPerformAction(a, assigneeContactId));
  }

  getEvidenceUploadPolicy(
    base: GamoraEvidenceUploadPolicy,
    _commitmentStatus: string,
    assigneeContactId?: string | null
  ): GamoraEvidenceUploadPolicy {
    const role = this.role();

    if (!role || role === 'viewer') {
      return {
        ...base,
        canUpload: false,
        readOnly: true,
        blockedMessage: 'Tu rol es de solo lectura. No puedes subir evidencia.',
      };
    }

    if (role === 'coordinator') {
      return {
        ...base,
        canUpload: false,
        blockedMessage: 'Los coordinadores revisan evidencia pero no la suben.',
      };
    }

    if (!base.canUpload) {
      return base;
    }

    if (role === 'admin') {
      return base;
    }

    if (role === 'assignee') {
      if (!this.isAssignedToMe(assigneeContactId)) {
        return {
          ...base,
          canUpload: false,
          blockedMessage: 'Solo puedes subir evidencia en compromisos asignados a ti.',
        };
      }
      return base;
    }

    return { ...base, canUpload: false, blockedMessage: 'No tienes permiso para subir evidencia.' };
  }

  actionDisabledReason(action: GamoraWorkflowAction, assigneeContactId?: string | null): string | null {
    if (this.canPerformAction(action, assigneeContactId)) return null;
    const role = this.role();
    if (role === 'viewer') return 'Tu rol es de solo lectura.';
    if (REVIEW_ONLY_ACTION_KEYS.has(action.key)) {
      return 'Solo coordinadores o administradores pueden revisar o cerrar compromisos.';
    }
    if (role === 'coordinator' && ASSIGNEE_OPERATIVE_KEYS.has(action.key)) {
      return 'Los coordinadores no ejecutan tareas asignadas; solo revisan y cierran.';
    }
    if (ASSIGNEE_OPERATIVE_KEYS.has(action.key) && role === 'assignee' && !this.isAssignedToMe(assigneeContactId)) {
      return 'Esta acción solo está disponible para el responsable asignado.';
    }
    return 'No tienes permiso para realizar esta acción.';
  }
}
