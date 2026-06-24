import bcrypt from 'bcrypt';
import type { User, Workspace } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import { jwtService } from './jwt.service';

const INACTIVE_MESSAGE = 'Tu cuenta no está activa. Contacta al administrador.';
const INACTIVE_WORKSPACE_MESSAGE = 'Esta empresa está inactiva. Contacta al administrador.';
const INVALID_CREDENTIALS = 'Credenciales inválidas.';

export interface AuthSessionUser {
  id: string;
  email: string;
  displayName: string;
  role: User['role'];
  status: User['status'];
  contactId: string | null;
}

export interface AuthSessionWorkspace {
  id: string;
  name: string;
  slug: string;
  status: Workspace['status'];
}

export interface LoginResult {
  token: string;
  user: AuthSessionUser;
  workspace: AuthSessionWorkspace;
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { email: normalizedEmail },
      include: {
        workspace: true,
        contacts: { take: 1, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!user?.passwordHash) {
      throw new AuthError(INVALID_CREDENTIALS, 401);
    }

    if (user.status !== 'active') {
      throw new AuthError(INACTIVE_MESSAGE, 401);
    }

    if (user.workspace.status === 'inactive') {
      throw new AuthError(INACTIVE_WORKSPACE_MESSAGE, 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AuthError(INVALID_CREDENTIALS, 401);
    }

    const token = jwtService.sign({
      sub: user.id,
      workspaceId: user.workspaceId,
      role: user.role,
    });

    return {
      token,
      user: this.mapUser(user, user.contacts[0]?.id ?? null),
      workspace: this.mapWorkspace(user.workspace),
    };
  }

  async getMe(userId: string, workspaceId: string): Promise<{ user: AuthSessionUser; workspace: AuthSessionWorkspace }> {
    const user = await prisma.user.findFirst({
      where: { id: userId, workspaceId },
      include: {
        workspace: true,
        contacts: { take: 1, orderBy: { createdAt: 'asc' } },
      },
    });

    if (!user || user.status !== 'active') {
      throw new AuthError(INACTIVE_MESSAGE, 401);
    }

    return {
      user: this.mapUser(user, user.contacts[0]?.id ?? null),
      workspace: this.mapWorkspace(user.workspace),
    };
  }

  private mapUser(user: User, contactId: string | null): AuthSessionUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      contactId,
    };
  }

  private mapWorkspace(workspace: Workspace): AuthSessionWorkspace {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      status: workspace.status,
    };
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = new AuthService();
