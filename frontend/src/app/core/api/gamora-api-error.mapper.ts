import { HttpErrorResponse } from '@angular/common/http';

const FRIENDLY_BY_SNIPPET: Array<{ match: RegExp; message: string }> = [
  {
    match: /evidence|upload|subir/i,
    message: 'No puedes subir evidencia en este momento. Primero acepta la tarea o revisa el estado actual.',
  },
  {
    match: /transition|transición|invalid status|estado/i,
    message: 'Esta acción no está disponible para el estado actual de la tarea.',
  },
  {
    match: /not found|no encontrad/i,
    message: 'No se encontró el recurso solicitado. Recarga la página e intenta de nuevo.',
  },
];

export type GamoraApiErrorContext = 'upload_evidence' | 'status_transition' | 'generic';

export function mapGamoraApiError(error: unknown, context: GamoraApiErrorContext = 'generic'): string {
  if (error instanceof HttpErrorResponse) {
    const bodyMsg =
      typeof error.error === 'object' && error.error !== null && 'error' in error.error
        ? String((error.error as { error: unknown }).error)
        : typeof error.error === 'string'
          ? error.error
          : undefined;

    if (context === 'upload_evidence') {
      return (
        bodyMsg && !isTechnicalMessage(bodyMsg)
          ? bodyMsg
          : 'No puedes subir evidencia en este momento. Primero acepta la tarea o revisa el estado actual.'
      );
    }

    if (context === 'status_transition') {
      return (
        bodyMsg && !isTechnicalMessage(bodyMsg)
          ? bodyMsg
          : 'Esta acción no está disponible para el estado actual de la tarea.'
      );
    }

    if (bodyMsg && !isTechnicalMessage(bodyMsg)) {
      return bodyMsg;
    }

    if (error.status === 401) {
      return 'Debes iniciar sesión.';
    }

    if (error.status === 403) {
      return 'No tienes permiso para realizar esta acción.';
    }

    if (error.status === 422) {
      return 'Esta acción no está disponible para el estado actual de la tarea.';
    }

    if (error.status === 0) {
      return 'No hay conexión con el servidor. Verifica tu red e intenta de nuevo.';
    }

    for (const rule of FRIENDLY_BY_SNIPPET) {
      const haystack = `${bodyMsg ?? ''} ${error.message}`;
      if (rule.match.test(haystack)) return rule.message;
    }

    return 'Ocurrió un error. Intenta de nuevo en unos momentos.';
  }

  if (error instanceof Error && !isTechnicalMessage(error.message)) {
    return error.message;
  }

  if (context === 'upload_evidence') {
    return 'No se pudo subir el archivo. Intenta de nuevo.';
  }

  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

function isTechnicalMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes('unprocessable entity') ||
    m.includes('http failure') ||
    m.includes('422') ||
    m.includes('500') ||
    m.includes('stack') ||
    m.startsWith('{')
  );
}
