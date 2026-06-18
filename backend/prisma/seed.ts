import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WORKSPACE_SLUG = 'ferreteria-luisito';

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: WORKSPACE_SLUG },
    update: {
      name: 'Ferretería Luisito',
      settingsJson: {
        audio_enabled: false,
        audio_max_duration_seconds: 120,
        audio_max_size_bytes: 16777216,
      },
    },
    create: {
      name: 'Ferretería Luisito',
      slug: WORKSPACE_SLUG,
      settingsJson: {
        audio_enabled: false,
        audio_max_duration_seconds: 120,
        audio_max_size_bytes: 16777216,
      },
    },
  });

  const luisitoUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'luisito@ferreteria.local' } },
    update: { displayName: 'Luisito', role: 'admin', status: 'active' },
    create: {
      workspaceId: workspace.id,
      email: 'luisito@ferreteria.local',
      displayName: 'Luisito',
      role: 'admin',
      status: 'active',
    },
  });

  const panchitoUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'panchito@ferreteria.local' } },
    update: { displayName: 'Panchito', role: 'assignee', status: 'active' },
    create: {
      workspaceId: workspace.id,
      email: 'panchito@ferreteria.local',
      displayName: 'Panchito',
      role: 'assignee',
      status: 'active',
    },
  });

  const luisitoContact = await prisma.contact.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {
      workspaceId: workspace.id,
      userId: luisitoUser.id,
      displayName: 'Luisito',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      workspaceId: workspace.id,
      userId: luisitoUser.id,
      displayName: 'Luisito',
    },
  });

  const panchitoContact = await prisma.contact.upsert({
    where: { id: '00000000-0000-4000-8000-000000000002' },
    update: {
      workspaceId: workspace.id,
      userId: panchitoUser.id,
      displayName: 'Panchito',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000002',
      workspaceId: workspace.id,
      userId: panchitoUser.id,
      displayName: 'Panchito',
    },
  });

  const marcoContact = await prisma.contact.upsert({
    where: { id: '00000000-0000-4000-8000-000000000003' },
    update: {
      workspaceId: workspace.id,
      displayName: 'Marco',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000003',
      workspaceId: workspace.id,
      displayName: 'Marco',
    },
  });

  await prisma.channelContact.upsert({
    where: {
      channel_provider_externalId: {
        channel: 'simulator',
        provider: 'internal',
        externalId: 'luisito-sim',
      },
    },
    update: { contactId: luisitoContact.id, optInStatus: 'active' },
    create: {
      contactId: luisitoContact.id,
      channel: 'simulator',
      provider: 'internal',
      externalId: 'luisito-sim',
      optInStatus: 'active',
      optInAt: new Date(),
    },
  });

  await prisma.channelContact.upsert({
    where: {
      channel_provider_externalId: {
        channel: 'simulator',
        provider: 'internal',
        externalId: 'panchito-sim',
      },
    },
    update: { contactId: panchitoContact.id, optInStatus: 'active' },
    create: {
      contactId: panchitoContact.id,
      channel: 'simulator',
      provider: 'internal',
      externalId: 'panchito-sim',
      optInStatus: 'active',
      optInAt: new Date(),
    },
  });

  /** Contacto WhatsApp mock — wa_id para pruebas de webhook sin Meta real */
  await prisma.channelContact.upsert({
    where: {
      channel_provider_externalId: {
        channel: 'whatsapp',
        provider: 'meta',
        externalId: '5215512345678',
      },
    },
    update: { contactId: luisitoContact.id, optInStatus: 'active' },
    create: {
      contactId: luisitoContact.id,
      channel: 'whatsapp',
      provider: 'meta',
      externalId: '5215512345678',
      optInStatus: 'active',
      optInAt: new Date(),
    },
  });

  console.log('Seed OK:', {
    workspace: workspace.slug,
    luisito: luisitoContact.displayName,
    panchito: panchitoContact.displayName,
    marco: marcoContact.displayName,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
