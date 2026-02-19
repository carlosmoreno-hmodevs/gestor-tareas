/** Periodicidad de la automatización */
export type AutomationFrequency = 'daily' | 'weekly' | 'monthly';

/** Tipo de automatización: tarea desde plantilla o vinculada a proyecto */
export type AutomationType = 'task_template' | 'project_linked';

/** Si el día del mes no existe (ej. 31 en febrero): omitir o usar último día */
export type MonthEndRule = 'skip' | 'last_day';

/** Días de la semana (0 = domingo, 1 = lunes, ... 6 = sábado) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Blueprint de la tarea que genera la automatización */
export interface AutomationTaskBlueprint {
  title: string;
  description?: string;
  categoryId?: string;
  assigneeId?: string;
  tags?: string[];
  /** Proyecto (opcional en task_template; en project_linked se usa el del automation) */
  projectId?: string;
  /** Unidad org (opcional; si no, se hereda del proyecto) */
  orgUnitId?: string;
  /** Días hasta vencimiento desde la fecha de creación (default 7) */
  dueInDays?: number;
}

export interface Automation {
  id: string;
  tenantId: string;
  name: string;
  /** Si está activa (pausada = false) */
  active: boolean;
  type: AutomationType;
  /** Proyecto al que pertenecen las tareas (obligatorio si type === 'project_linked') */
  projectId?: string;
  taskBlueprint: AutomationTaskBlueprint;
  /** Frecuencia: daily | weekly | monthly */
  frequency: AutomationFrequency;
  /** Cada cuántos (ej. cada 2 semanas => interval 2) */
  interval: number;
  /** Hora del día en formato HH:mm (hora local) */
  timeOfDay: string;
  /** Para weekly: días de la semana (0-6) */
  weeklyDays?: DayOfWeek[];
  /** Para monthly: día del mes (1-31) */
  monthlyDay?: number;
  /** Para monthly: si el mes no tiene ese día */
  monthEndRule?: MonthEndRule;
  /** Rango: fecha inicio (obligatoria) */
  startDate: string;
  /** Rango: fecha fin (opcional; si no hay, no expira por fecha) */
  endDate?: string;
  /** Próxima ejecución programada (ISO) */
  nextRunAt: string;
  /** Última ejecución (ISO) */
  lastRunAt?: string;
  /** Cuántas veces ha corrido */
  runCount: number;
  /** Soft delete */
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
