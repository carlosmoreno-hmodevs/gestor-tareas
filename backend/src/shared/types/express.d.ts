import type { UserRole, Workspace } from '@prisma/client';

export interface AuthContext {
  userId: string;
  workspaceId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      workspace?: Workspace;
    }
  }
}

export {};
