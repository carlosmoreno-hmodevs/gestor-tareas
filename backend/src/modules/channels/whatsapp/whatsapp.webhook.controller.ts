import { Router } from 'express';
import { whatsappConfig } from '../../../config/whatsapp.config';
import { whatsappWebhookService } from './whatsapp.webhook.service';
import type { WhatsappWebhookPayload } from './whatsapp.types';

export const whatsappWebhookRouter = Router();

/**
 * Verificación del webhook Meta (hub.challenge).
 * GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 */
whatsappWebhookRouter.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === whatsappConfig.verifyToken && challenge) {
    res.status(200).send(String(challenge));
    return;
  }

  res.status(403).json({ error: 'Token de verificación inválido' });
});

/**
 * Eventos entrantes Meta — responde 200 de inmediato y procesa en background.
 * POST /api/webhooks/whatsapp
 */
whatsappWebhookRouter.post('/whatsapp', (req, res) => {
  res.status(200).send('EVENT_RECEIVED');

  const payload = req.body as WhatsappWebhookPayload;
  setImmediate(() => {
    void whatsappWebhookService.handlePayload(payload);
  });
});
