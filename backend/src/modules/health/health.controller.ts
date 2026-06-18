import { Router } from 'express';
import { envConfig } from '../../config/env.config';

export const healthRouter = Router();

/** Healthcheck para load balancers y validación de staging */
healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    env: envConfig.appEnv,
    timestamp: new Date().toISOString(),
  });
});
