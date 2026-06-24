import type { Contact, ContactStatus, Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';

export interface ContactDto {
  id: string;
  workspaceId: string;
  displayName: string;
  phoneNumber: string | null;
  email: string | null;
  position: string | null;
  team: string | null;
  status: ContactStatus;
  userId: string | null;
  userDisplayName: string | null;
  userEmail: string | null;
  simulatorExternalId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type ContactWithUser = Contact & {
  user?: { displayName: string; email: string } | null;
  channelContacts?: Array<{ channel: string; externalId: string }>;
};

function mapContact(c: ContactWithUser): ContactDto {
  const sim = c.channelContacts?.find((cc) => cc.channel === 'simulator');
  return {
    id: c.id,
    workspaceId: c.workspaceId,
    displayName: c.displayName,
    phoneNumber: c.phoneNumber,
    email: c.email,
    position: c.position,
    team: c.team,
    status: c.status,
    userId: c.userId,
    userDisplayName: c.user?.displayName ?? null,
    userEmail: c.user?.email ?? null,
    simulatorExternalId: sim?.externalId ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

const contactInclude = {
  user: { select: { displayName: true, email: true } },
  channelContacts: {
    where: { channel: 'simulator' as const },
    select: { channel: true, externalId: true },
  },
} satisfies Prisma.ContactInclude;

export class ContactsService {
  async list(
    workspaceId: string,
    scopeWhere: Record<string, unknown>,
    filters?: { status?: ContactStatus; activeOnly?: boolean }
  ): Promise<ContactDto[]> {
    const where: Prisma.ContactWhereInput = {
      ...scopeWhere,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.activeOnly ? { status: 'active' } : {}),
    };

    const items = await prisma.contact.findMany({
      where,
      include: contactInclude,
      orderBy: [{ status: 'asc' }, { displayName: 'asc' }],
    });
    return items.map(mapContact);
  }

  async getById(workspaceId: string, id: string): Promise<ContactDto | null> {
    const item = await prisma.contact.findFirst({
      where: { id, workspaceId },
      include: contactInclude,
    });
    return item ? mapContact(item) : null;
  }

  async getMe(workspaceId: string, contactId: string | null): Promise<ContactDto | null> {
    if (!contactId) return null;
    return this.getById(workspaceId, contactId);
  }

  async create(
    workspaceId: string,
    input: {
      displayName: string;
      phoneNumber?: string;
      email?: string;
      position?: string;
      team?: string;
      userId?: string;
    }
  ): Promise<ContactDto> {
    const displayName = input.displayName.trim();
    if (!displayName) {
      throw new ContactsError('El nombre es obligatorio.', 422);
    }

    if (input.userId) {
      const user = await prisma.user.findFirst({
        where: { id: input.userId, workspaceId },
      });
      if (!user) {
        throw new ContactsError('Usuario no encontrado en esta empresa.', 422);
      }
      const existingLink = await prisma.contact.findFirst({
        where: { workspaceId, userId: input.userId },
      });
      if (existingLink) {
        throw new ContactsError('Ese usuario ya tiene un responsable vinculado.', 422);
      }
    }

    const dup = await prisma.contact.findFirst({
      where: {
        workspaceId,
        displayName,
        status: 'active',
        ...(input.userId ? { NOT: { userId: input.userId } } : {}),
      },
    });
    if (dup && !input.userId) {
      throw new ContactsError('Ya existe un responsable activo con ese nombre.', 422);
    }

    const created = await prisma.contact.create({
      data: {
        workspaceId,
        displayName,
        phoneNumber: input.phoneNumber?.trim() || null,
        email: input.email?.trim().toLowerCase() || null,
        position: input.position?.trim() || null,
        team: input.team?.trim() || null,
        userId: input.userId ?? null,
        status: 'active',
      },
      include: contactInclude,
    });
    return mapContact(created);
  }

  async update(
    workspaceId: string,
    id: string,
    input: {
      displayName?: string;
      phoneNumber?: string | null;
      email?: string | null;
      position?: string | null;
      team?: string | null;
    }
  ): Promise<ContactDto> {
    const existing = await prisma.contact.findFirst({ where: { id, workspaceId } });
    if (!existing) {
      throw new ContactsError('Responsable no encontrado.', 404);
    }

    if (input.displayName !== undefined) {
      const name = input.displayName.trim();
      if (!name) {
        throw new ContactsError('El nombre es obligatorio.', 422);
      }
      const dup = await prisma.contact.findFirst({
        where: {
          workspaceId,
          displayName: name,
          status: 'active',
          NOT: { id },
        },
      });
      if (dup) {
        throw new ContactsError('Ya existe un responsable activo con ese nombre.', 422);
      }
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
        ...(input.phoneNumber !== undefined ? { phoneNumber: input.phoneNumber?.trim() || null } : {}),
        ...(input.email !== undefined ? { email: input.email?.trim().toLowerCase() || null } : {}),
        ...(input.position !== undefined ? { position: input.position?.trim() || null } : {}),
        ...(input.team !== undefined ? { team: input.team?.trim() || null } : {}),
      },
      include: contactInclude,
    });

    if (input.displayName && existing.userId) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { displayName: input.displayName.trim() },
      });
    }

    return mapContact(updated);
  }

  async updateStatus(workspaceId: string, id: string, status: ContactStatus): Promise<ContactDto> {
    const existing = await prisma.contact.findFirst({ where: { id, workspaceId } });
    if (!existing) {
      throw new ContactsError('Responsable no encontrado.', 404);
    }

    const updated = await prisma.contact.update({
      where: { id },
      data: { status },
      include: contactInclude,
    });
    return mapContact(updated);
  }

  async assertActiveAssignees(workspaceId: string, contactIds: string[]): Promise<void> {
    if (!contactIds.length) return;
    const contacts = await prisma.contact.findMany({
      where: { workspaceId, id: { in: contactIds } },
      select: { id: true, status: true, displayName: true },
    });
    if (contacts.length !== contactIds.length) {
      throw new ContactsError('Uno o más responsables no existen en esta empresa.', 422);
    }
    const inactive = contacts.filter((c) => c.status !== 'active');
    if (inactive.length) {
      throw new ContactsError(
        `No se puede asignar a responsables inactivos: ${inactive.map((c) => c.displayName).join(', ')}.`,
        422
      );
    }
  }
}

export class ContactsError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = 'ContactsError';
  }
}

export const contactsService = new ContactsService();
