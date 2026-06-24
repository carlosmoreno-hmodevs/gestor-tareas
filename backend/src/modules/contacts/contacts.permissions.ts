import type { UserRole } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';

export const FORBIDDEN_MESSAGE = 'No tienes permiso para realizar esta acción.';

export function canManageContacts(role: UserRole): boolean {
  return role === 'admin' || role === 'coordinator';
}

export function canListContacts(role: UserRole): boolean {
  return role === 'admin' || role === 'coordinator' || role === 'viewer' || role === 'assignee';
}

export function requireManageContacts(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth || !canManageContacts(req.auth.role)) {
    res.status(403).json({ error: FORBIDDEN_MESSAGE });
    return;
  }
  next();
}

export function listScopeWhere(actor: { role: UserRole; contactId: string | null; workspaceId: string }) {
  if (actor.role === 'assignee' && actor.contactId) {
    return { workspaceId: actor.workspaceId, id: actor.contactId };
  }
  if (actor.role === 'assignee') {
    return { workspaceId: actor.workspaceId, id: { in: [] as string[] } };
  }
  return { workspaceId: actor.workspaceId };
}
