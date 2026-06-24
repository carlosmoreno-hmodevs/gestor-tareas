import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { envConfig } from './config/env.config';
import { commitmentsRouter, errorHandler } from './modules/commitments/commitments.controller';
import { conversationsRouter } from './modules/conversations/conversations.controller';
import { messagesRouter } from './modules/messages/messages.controller';
import { workspacesRouter } from './modules/workspaces/workspaces.controller';
import { usersRouter } from './modules/users/users.controller';
import { whatsappWebhookRouter } from './modules/channels/whatsapp/whatsapp.webhook.controller';
import { authRouter } from './modules/auth/auth.controller';
import { requireAuth, requireWorkspace } from './modules/auth/auth.middleware';
import { contactsRouter } from './modules/contacts/contacts.controller';
import { healthRouter } from './modules/health/health.controller';
import { notificationsRouter } from './modules/notifications/notifications.controller';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? 'http://localhost:4200',
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Slug'],
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'gamora-bot-api',
      env: envConfig.appEnv,
      timestamp: new Date().toISOString(),
      whatsappSendEnabled: process.env.WHATSAPP_SEND_ENABLED === 'true',
    });
  });

  app.use('/api/health', healthRouter);

  app.use('/api/auth', authRouter);
  app.use('/api/webhooks', whatsappWebhookRouter);

  const protectedMiddleware = [requireAuth, requireWorkspace] as const;
  app.use('/api/workspaces', ...protectedMiddleware, workspacesRouter);
  app.use('/api/users', ...protectedMiddleware, usersRouter);
  app.use('/api/contacts', ...protectedMiddleware, contactsRouter);
  app.use('/api/commitments', ...protectedMiddleware, commitmentsRouter);
  app.use('/api/conversations', ...protectedMiddleware, conversationsRouter);
  app.use('/api/messages', ...protectedMiddleware, messagesRouter);
  app.use('/api/notifications', ...protectedMiddleware, notificationsRouter);

  app.use(errorHandler);

  return app;
}
