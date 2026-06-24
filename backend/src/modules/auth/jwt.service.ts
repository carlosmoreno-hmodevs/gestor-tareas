import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';
import { authConfig } from '../../config/auth.config';

export interface AccessTokenPayload {
  sub: string;
  workspaceId: string;
  role: UserRole;
}

export class JwtService {
  sign(payload: AccessTokenPayload): string {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  verify(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    if (typeof decoded === 'string' || !decoded || typeof decoded !== 'object') {
      throw new Error('Token inválido');
    }
    const { sub, workspaceId, role } = decoded as AccessTokenPayload;
    if (!sub || !workspaceId || !role) {
      throw new Error('Token inválido');
    }
    return { sub, workspaceId, role };
  }
}

export const jwtService = new JwtService();
