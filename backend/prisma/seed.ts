import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const WORKSPACE_SLUG = 'ferreteria-luisito';
/** Contraseña demo local — documentada en backend/README.md */
const DEMO_PASSWORD = 'GamoraDemo123!';

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const workspace = await prisma.workspace.upsert({
    where: { slug: WORKSPACE_SLUG },
    update: {
      name: 'Ferretería Luisito',
      status: 'active',
      settingsJson: {
        timezone: 'America/Mexico_City',
        audio_enabled: false,
        audio_max_duration_seconds: 120,
        audio_max_size_bytes: 16777216,
      },
    },
    create: {
      name: 'Ferretería Luisito',
      slug: WORKSPACE_SLUG,
      status: 'active',
      settingsJson: {
        timezone: 'America/Mexico_City',
        audio_enabled: false,
        audio_max_duration_seconds: 120,
        audio_max_size_bytes: 16777216,
      },
    },
  });

  const luisitoUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'admin@luisito.test' } },
    update: {
      displayName: 'Luisito',
      role: 'admin',
      status: 'active',
      passwordHash,
    },
    create: {
      workspaceId: workspace.id,
      email: 'admin@luisito.test',
      displayName: 'Luisito',
      role: 'admin',
      status: 'active',
      passwordHash,
    },
  });

  const panchitoUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'panchito@luisito.test' } },
    update: {
      displayName: 'Panchito',
      role: 'assignee',
      status: 'active',
      passwordHash,
    },
    create: {
      workspaceId: workspace.id,
      email: 'panchito@luisito.test',
      displayName: 'Panchito',
      role: 'assignee',
      status: 'active',
      passwordHash,
    },
  });

  const coordinatorUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'coordinator@luisito.test' } },
    update: {
      displayName: 'Carla Coordinadora',
      role: 'coordinator',
      status: 'active',
      passwordHash,
    },
    create: {
      workspaceId: workspace.id,
      email: 'coordinator@luisito.test',
      displayName: 'Carla Coordinadora',
      role: 'coordinator',
      status: 'active',
      passwordHash,
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { workspaceId_email: { workspaceId: workspace.id, email: 'viewer@luisito.test' } },
    update: {
      displayName: 'Vicente Viewer',
      role: 'viewer',
      status: 'active',
      passwordHash,
    },
    create: {
      workspaceId: workspace.id,
      email: 'viewer@luisito.test',
      displayName: 'Vicente Viewer',
      role: 'viewer',
      status: 'active',
      passwordHash,
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

  const coordinatorContact = await prisma.contact.upsert({
    where: { id: '00000000-0000-4000-8000-000000000004' },
    update: {
      workspaceId: workspace.id,
      userId: coordinatorUser.id,
      displayName: 'Carla Coordinadora',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000004',
      workspaceId: workspace.id,
      userId: coordinatorUser.id,
      displayName: 'Carla Coordinadora',
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

  await prisma.notification.deleteMany({
    where: { workspaceId: workspace.id, type: 'demo_welcome' },
  });
  await prisma.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: luisitoUser.id,
        type: 'demo_welcome',
        title: 'Notificaciones activas',
        message: 'Verás alertas aquí cuando se asignen compromisos o llegue evidencia nueva.',
      },
      {
        workspaceId: workspace.id,
        userId: panchitoUser.id,
        type: 'demo_welcome',
        title: 'Notificaciones activas',
        message: 'Te avisaremos cuando te asignen un compromiso o pidan corrección.',
      },
    ],
  });

  console.log('Seed OK:', {
    workspace: workspace.slug,
    luisito: luisitoContact.displayName,
    panchito: panchitoContact.displayName,
    coordinator: coordinatorContact.displayName,
    marco: marcoContact.displayName,
    demoUsers: [
      'admin@luisito.test',
      'coordinator@luisito.test',
      'panchito@luisito.test',
      'viewer@luisito.test',
    ],
    demoPassword: DEMO_PASSWORD,
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
