export interface AlertRule {
  id: string;
  name: string;
  thresholdHours?: number;
  thresholdDays?: number;
  frequency: 'diaria' | 'cada12h' | 'cada6h' | 'inmediato';
  escalationTargets: string[];
  allowedActionsForOverdue: ('editar' | 'reprogramar' | 'bloquear')[];
}
