import { Router } from 'express';
import { z } from 'zod';
import { authService, AuthError } from './auth.service';
import { requireAuth, requireWorkspace } from './auth.middleware';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    return;
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    res.json({ data: result });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/** JWT stateless — el cliente elimina el token. */
authRouter.post('/logout', requireAuth, (_req, res) => {
  res.json({ data: { ok: true } });
});

authRouter.get('/me', requireAuth, requireWorkspace, async (req, res) => {
  try {
    const session = await authService.getMe(req.auth!.userId, req.auth!.workspaceId);
    res.json({ data: session });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
