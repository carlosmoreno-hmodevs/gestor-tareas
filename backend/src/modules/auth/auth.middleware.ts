import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/database/prisma';
import { jwtService } from './jwt.service';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Debes iniciar sesión.' });
    return;
  }

  try {
    const payload = jwtService.verify(header.slice(7));
    req.auth = {
      userId: payload.sub,
      workspaceId: payload.workspaceId,
      role: payload.role,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.auth?.role !== 'admin') {
    res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
    return;
  }
  next();
}

export async function requireWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.auth) {
    res.status(401).json({ error: 'Debes iniciar sesión.' });
    return;
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: req.auth.workspaceId },
  });

  if (!workspace) {
    res.status(401).json({ error: 'Debes iniciar sesión.' });
    return;
  }

  if (workspace.status === 'inactive') {
    res.status(403).json({ error: 'Esta empresa está inactiva. Contacta al administrador.' });
    return;
  }

  const slugHeader = req.header('x-workspace-slug');
  if (slugHeader && slugHeader !== workspace.slug) {
    res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
    return;
  }

  req.workspace = workspace;
  next();
}

export function getWorkspace(req: Request) {
  if (!req.workspace) {
    throw new Error('Workspace no resuelto en la solicitud autenticada');
  }
  return req.workspace;
}
