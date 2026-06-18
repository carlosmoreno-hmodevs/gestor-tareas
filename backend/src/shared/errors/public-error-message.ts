import { envConfig } from '../../config/env.config';

/** Mensaje seguro para respuestas HTTP 500 — sin detalles técnicos fuera de local/dev. */
export function publicServerErrorMessage(err: unknown): string {
  if (envConfig.isLocal) {
    return err instanceof Error ? err.message : 'Error interno';
  }
  return 'Error interno del servidor';
}
