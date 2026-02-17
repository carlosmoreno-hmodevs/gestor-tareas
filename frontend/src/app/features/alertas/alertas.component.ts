import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../core/services/data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AlertRuleEditDialogComponent } from './alert-rule-edit-dialog/alert-rule-edit-dialog.component';
import type { AlertRule } from '../../shared/models';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent
  ],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.scss'
})
export class AlertasComponent {
  private readonly dataService = inject(DataService);
  private readonly dialog = inject(MatDialog);

  rules = this.dataService.getAlertRules();

  openEdit(rule: AlertRule): void {
    this.dialog.open(AlertRuleEditDialogComponent, {
      width: '90vw',
      maxWidth: '560px',
      data: { ...rule }
    });
  }

  getThresholdLabel(rule: AlertRule): string {
    if (rule.thresholdHours) return `Umbral: ${rule.thresholdHours}h`;
    if (rule.thresholdDays) return `Umbral: ${rule.thresholdDays} días`;
    return '';
  }

  getFrequencyLabel(freq: AlertRule['frequency']): string {
    const map: Record<AlertRule['frequency'], string> = {
      diaria: 'Frecuencia: diaria',
      cada12h: 'Cada 12 horas',
      cada6h: 'Cada 6 horas',
      inmediato: 'Inmediato'
    };
    return map[freq] ?? freq;
  }

  getActionLabel(action: string): string {
    const map: Record<string, string> = {
      editar: 'Editar',
      reprogramar: 'Reprogramar',
      bloquear: 'Bloquear'
    };
    return map[action] ?? action;
  }
}
