type EventRow = {
  id: string;
  commitmentId: string;
  eventType: string;
  fromStatus: string | null;
  toStatus: string | null;
  actorContactId: string | null;
  actorUserId: string | null;
  messageId: string | null;
  payloadJson: unknown;
  createdAt: Date;
};

export type EnrichedCommitmentEvent = EventRow & {
  actorContactName: string | null;
  actorUserName: string | null;
  actorName: string;
};

export function resolveActorName(
  event: Pick<EventRow, 'eventType' | 'actorContactId' | 'actorUserId'>,
  contactName?: string | null,
  userName?: string | null
): string {
  if (contactName) return contactName;
  if (userName) return userName;
  if (event.eventType === 'created' && !event.actorContactId && !event.actorUserId) {
    return 'Gamora';
  }
  return 'Sistema';
}

export async function enrichCommitmentEvents(
  events: EventRow[],
  loadContacts: (ids: string[]) => Promise<Array<{ id: string; displayName: string }>>,
  loadUsers: (ids: string[]) => Promise<Array<{ id: string; displayName: string }>>
): Promise<EnrichedCommitmentEvent[]> {
  const contactIds = [...new Set(events.map((e) => e.actorContactId).filter((id): id is string => !!id))];
  const userIds = [...new Set(events.map((e) => e.actorUserId).filter((id): id is string => !!id))];

  const [contacts, users] = await Promise.all([
    contactIds.length ? loadContacts(contactIds) : [],
    userIds.length ? loadUsers(userIds) : [],
  ]);

  const contactMap = new Map(contacts.map((c) => [c.id, c.displayName]));
  const userMap = new Map(users.map((u) => [u.id, u.displayName]));

  return events.map((event) => {
    const actorContactName = event.actorContactId
      ? (contactMap.get(event.actorContactId) ?? null)
      : null;
    const actorUserName = event.actorUserId ? (userMap.get(event.actorUserId) ?? null) : null;
    return {
      ...event,
      actorContactName,
      actorUserName,
      actorName: resolveActorName(event, actorContactName, actorUserName),
    };
  });
}

export function mapEventForApi(event: EnrichedCommitmentEvent) {
  return {
    id: event.id,
    commitmentId: event.commitmentId,
    eventType: event.eventType,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    actorContactId: event.actorContactId,
    actorUserId: event.actorUserId,
    actorContactName: event.actorContactName,
    actorUserName: event.actorUserName,
    actorName: event.actorName,
    messageId: event.messageId,
    payloadJson: event.payloadJson,
    createdAt: event.createdAt,
  };
}
