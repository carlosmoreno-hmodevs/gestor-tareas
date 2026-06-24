import bcrypt from 'bcrypt';
import type { User, UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';

export const DEFAULT_NEW_USER_PASSWORD = 'GamoraTemp123!';

const ROLES_WITH_CONTACT: UserRole[] = ['admin', 'coordinator', 'assignee'];

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  contactId: string | null;
  contactDisplayName: string | null;
  createdAt: Date;
}

function mapUser(user: User, contact?: { id: string; displayName: string } | null): UserDto {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    status: user.status,
    contactId: contact?.id ?? null,
    contactDisplayName: contact?.displayName ?? null,
    createdAt: user.createdAt,
  };
}

export class UsersService {
  async list(workspaceId: string): Promise<UserDto[]> {
    const users = await prisma.user.findMany({
      where: { workspaceId },
      include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
      orderBy: [{ displayName: 'asc' }],
    });
    return users.map((u) => mapUser(u, u.contacts[0] ?? null));
  }

  async getById(workspaceId: string, userId: string): Promise<UserDto | null> {
    const user = await prisma.user.findFirst({
      where: { id: userId, workspaceId },
      include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
    });
    return user ? mapUser(user, user.contacts[0] ?? null) : null;
  }

  async create(
    workspaceId: string,
    input: {
      email: string;
      displayName: string;
      role: UserRole;
      password?: string;
      createContact?: boolean;
    }
  ): Promise<{ user: UserDto; temporaryPassword: string }> {
    const email = input.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { workspaceId_email: { workspaceId, email } },
    });
    if (existing) {
      throw new UsersError('Ya existe un usuario con ese correo en esta empresa.', 422);
    }

    const temporaryPassword = input.password ?? DEFAULT_NEW_USER_PASSWORD;
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    const shouldCreateContact = input.createContact ?? ROLES_WITH_CONTACT.includes(input.role);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          workspaceId,
          email,
          displayName: input.displayName.trim(),
          role: input.role,
          status: 'active',
          passwordHash,
        },
      });

      let contact: { id: string; displayName: string } | null = null;
      if (shouldCreateContact) {
        contact = await tx.contact.create({
          data: {
            workspaceId,
            userId: user.id,
            displayName: user.displayName,
          },
        });
      }

      return { user, contact };
    });

    return {
      user: mapUser(result.user, result.contact),
      temporaryPassword,
    };
  }

  async update(
    workspaceId: string,
    userId: string,
    input: { displayName?: string; role?: UserRole; email?: string }
  ): Promise<UserDto> {
    const existing = await prisma.user.findFirst({ where: { id: userId, workspaceId } });
    if (!existing) {
      throw new UsersError('Usuario no encontrado.', 404);
    }

    if (input.email) {
      const email = input.email.trim().toLowerCase();
      const dup = await prisma.user.findFirst({
        where: { workspaceId, email, NOT: { id: userId } },
      });
      if (dup) {
        throw new UsersError('Ya existe un usuario con ese correo en esta empresa.', 422);
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
        ...(input.email !== undefined ? { email: input.email.trim().toLowerCase() } : {}),
      },
      include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
    });

    if (input.displayName && user.contacts[0]) {
      await prisma.contact.update({
        where: { id: user.contacts[0].id },
        data: { displayName: input.displayName.trim() },
      });
    }

    if (input.role && ROLES_WITH_CONTACT.includes(input.role) && !user.contacts[0]) {
      const contact = await prisma.contact.create({
        data: {
          workspaceId,
          userId: user.id,
          displayName: user.displayName,
        },
      });
      return mapUser(user, contact);
    }

    return mapUser(user, user.contacts[0] ?? null);
  }

  async updateStatus(
    workspaceId: string,
    userId: string,
    status: UserStatus,
    actorUserId: string
  ): Promise<UserDto> {
    if (userId === actorUserId && status !== 'active') {
      throw new UsersError('No puedes desactivar tu propia cuenta.', 422);
    }

    const existing = await prisma.user.findFirst({
      where: { id: userId, workspaceId },
      include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
    });
    if (!existing) {
      throw new UsersError('Usuario no encontrado.', 404);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: { contacts: { take: 1, orderBy: { createdAt: 'asc' } } },
    });

    return mapUser(user, user.contacts[0] ?? null);
  }

  async getMe(workspaceId: string, userId: string): Promise<UserDto> {
    const user = await this.getById(workspaceId, userId);
    if (!user) {
      throw new UsersError('Usuario no encontrado.', 404);
    }
    return user;
  }

  async updateMe(workspaceId: string, userId: string, input: { displayName?: string }): Promise<UserDto> {
    return this.update(workspaceId, userId, input);
  }

  async changePassword(
    workspaceId: string,
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findFirst({ where: { id: userId, workspaceId } });
    if (!user?.passwordHash) {
      throw new UsersError('Usuario no encontrado.', 404);
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new UsersError('La contraseña actual no es correcta.', 422);
    }

    if (newPassword.length < 8) {
      throw new UsersError('La nueva contraseña debe tener al menos 8 caracteres.', 422);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

export class UsersError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = 'UsersError';
  }
}

export const usersService = new UsersService();
