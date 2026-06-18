import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { envConfig } from './config/env.config';
import { commitmentsRouter, errorHandler } from './modules/commitments/commitments.controller';
import { conversationsRouter } from './modules/conversations/conversations.controller';
import { messagesRouter } from './modules/messages/messages.controller';
import { workspacesRouter } from './modules/workspaces/workspaces.controller';
import { whatsappWebhookRouter } from './modules/channels/whatsapp/whatsapp.webhook.controller';
import { healthRouter } from './modules/health/health.controller';

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

  app.use('/api/workspaces', workspacesRouter);
  app.use('/api/commitments', commitmentsRouter);
  app.use('/api/conversations', conversationsRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/webhooks', whatsappWebhookRouter);

  app.use(errorHandler);

  return app;
}
