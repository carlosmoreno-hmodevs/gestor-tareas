import type { UserRole } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/database/prisma';
import { statusesAllowingEvidenceUpload } from '../commitments/commitment-state.machine';

export const FORBIDDEN_MESSAGE = 'No tienes permiso para realizar esta acción.';
export const NOT_FOUND_MESSAGE = 'Compromiso no encontrado.';

export interface AuthActor {
  userId: string;
  workspaceId: string;
  role: UserRole;
  contactId: string | null;
}

export type CommitmentWithAssignees = {
  id: string;
  workspaceId: string;
  status: string;
  assignees: Array<{ contactId: string }>;
};

export class AuthorizationError extends Error {
  constructor(
    message: string,
    readonly statusCode: 403 | 404 = 403
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ error: FORBIDDEN_MESSAGE });
      return;
    }
    next();
  };
}

export async function loadAuthActor(req: Request): Promise<AuthActor> {
  if (!req.auth) {
    throw new AuthorizationError('Debes iniciar sesión.', 403);
  }

  const user = await prisma.user.findFirst({
    where: { id: req.auth.userId, workspaceId: req.auth.workspaceId },
    include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
  });

  return {
    userId: req.auth.userId,
    workspaceId: req.auth.workspaceId,
    role: req.auth.role,
    contactId: user?.contacts[0]?.id ?? null,
  };
}

export function isAssignedToActor(actor: AuthActor, commitment: CommitmentWithAssignees): boolean {
  if (!actor.contactId) return false;
  return commitment.assignees.some((a) => a.contactId === actor.contactId);
}

export function seesAllWorkspaceCommitments(role: UserRole): boolean {
  return role === 'admin' || role === 'coordinator' || role === 'viewer';
}

export function canViewCommitment(actor: AuthActor, commitment: CommitmentWithAssignees): boolean {
  if (commitment.workspaceId !== actor.workspaceId) return false;
  if (seesAllWorkspaceCommitments(actor.role)) return true;
  if (actor.role === 'assignee') return isAssignedToActor(actor, commitment);
  return false;
}

export function canCreateCommitment(actor: AuthActor): boolean {
  return actor.role === 'admin' || actor.role === 'coordinator';
}

export function canUpdateCommitmentMetadata(actor: AuthActor, commitment: CommitmentWithAssignees): boolean {
  if (!canViewCommitment(actor, commitment)) return false;
  return actor.role === 'admin' || actor.role === 'coordinator';
}

export function canReviewCommitment(actor: AuthActor, commitment: CommitmentWithAssignees): boolean {
  if (!canViewCommitment(actor, commitment)) return false;
  return actor.role === 'admin' || actor.role === 'coordinator';
}

const REVIEW_TRANSITIONS = new Set(['in_review', 'closed', 'correction_requested']);
const ASSIGNEE_OPERATIVE_TRANSITIONS = new Set([
  'accepted',
  'evidence_submitted',
  'corrected',
]);

export function canTransitionCommitment(
  actor: AuthActor,
  commitment: CommitmentWithAssignees,
  nextStatus: string
): boolean {
  if (!canViewCommitment(actor, commitment)) return false;

  if (actor.role === 'viewer') return false;

  if (nextStatus === 'cancelled') {
    return actor.role === 'admin' || actor.role === 'coordinator';
  }

  if (actor.role === 'admin') {
    return true;
  }

  if (actor.role === 'coordinator') {
    if (nextStatus === 'cancelled') return true;
    if (nextStatus === 'closed' || nextStatus === 'correction_requested') return true;
    return false;
  }

  if (actor.role !== 'assignee') return false;
  if (!isAssignedToActor(actor, commitment)) return false;

  if (REVIEW_TRANSITIONS.has(nextStatus)) return false;
  if (nextStatus === 'closed' || nextStatus === 'correction_requested') return false;

  if (nextStatus === 'accepted' && commitment.status === 'assigned') return true;
  if (nextStatus === 'in_review' && ['evidence_submitted', 'corrected'].includes(commitment.status)) {
    return true;
  }
  if (nextStatus === 'corrected' && commitment.status === 'correction_requested') return true;

  return ASSIGNEE_OPERATIVE_TRANSITIONS.has(nextStatus);
}

export function canUploadEvidence(actor: AuthActor, commitment: CommitmentWithAssignees): boolean {
  if (!canViewCommitment(actor, commitment)) return false;
  if (actor.role === 'viewer') return false;
  if (!statusesAllowingEvidenceUpload(commitment.status)) return false;

  if (actor.role === 'admin') return true;
  if (actor.role === 'assignee') return isAssignedToActor(actor, commitment);

  return false;
}

export function listScopeWhere(actor: AuthActor) {
  if (seesAllWorkspaceCommitments(actor.role)) {
    return { workspaceId: actor.workspaceId };
  }
  if (actor.role === 'assignee' && actor.contactId) {
    return {
      workspaceId: actor.workspaceId,
      assignees: { some: { contactId: actor.contactId } },
    };
  }
  return { workspaceId: actor.workspaceId, id: { in: [] as string[] } };
}

export function assertCanView(actor: AuthActor, commitment: CommitmentWithAssignees): void {
  if (!canViewCommitment(actor, commitment)) {
    throw new AuthorizationError(NOT_FOUND_MESSAGE, 404);
  }
}

export function assertCanCreate(actor: AuthActor): void {
  if (!canCreateCommitment(actor)) {
    throw new AuthorizationError(FORBIDDEN_MESSAGE, 403);
  }
}

export function assertCanUpdate(actor: AuthActor, commitment: CommitmentWithAssignees): void {
  if (!canUpdateCommitmentMetadata(actor, commitment)) {
    throw new AuthorizationError(FORBIDDEN_MESSAGE, 403);
  }
}

export function assertCanTransition(
  actor: AuthActor,
  commitment: CommitmentWithAssignees,
  nextStatus: string
): void {
  if (!canTransitionCommitment(actor, commitment, nextStatus)) {
    throw new AuthorizationError(FORBIDDEN_MESSAGE, 403);
  }
}

export function assertCanUploadEvidence(actor: AuthActor, commitment: CommitmentWithAssignees): void {
  if (!canUploadEvidence(actor, commitment)) {
    throw new AuthorizationError(FORBIDDEN_MESSAGE, 403);
  }
}

export function handleAuthorizationError(
  err: unknown,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AuthorizationError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  next(err);
}
