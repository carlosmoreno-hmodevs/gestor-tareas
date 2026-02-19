import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validador: la fecha límite debe ser hoy o posterior. */
export function minDueDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return null;
    const d = typeof v === 'string' ? new Date(v) : v;
    if (isNaN(d?.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const valueDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return valueDate >= today ? null : { minDueDate: true };
  };
}

/**
 * Normaliza una fecha al mediodía local para evitar desfases de timezone.
 * Maneja correctamente: Date, ISO string (YYYY-MM-DD), y otros formatos.
 * Las cadenas ISO como "2026-02-27" se interpretan como fecha LOCAL, no UTC,
 * para evitar que se guarde un día menos (p.ej. medianoche UTC = día anterior en América).
 */
export function normalizeDateToNoonLocal(value: Date | string | null | undefined): Date | undefined {
  if (value == null) return undefined;
  let y: number; let m: number; let d: number;
  if (typeof value === 'string') {
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      y = +isoMatch[1]; m = +isoMatch[2] - 1; d = +isoMatch[3];
    } else {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) return undefined;
      y = parsed.getFullYear(); m = parsed.getMonth(); d = parsed.getDate();
    }
  } else {
    if (isNaN(value.getTime())) return undefined;
    y = value.getFullYear(); m = value.getMonth(); d = value.getDate();
  }
  return new Date(y, m, d, 12, 0, 0, 0);
}
