import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutomationService } from '../../../core/services/automation.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { Automation, AutomationFrequency } from '../../../shared/models/automation.model';

const FREQ_LABEL: Record<AutomationFrequency, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensual'
};

@Component({
  selector: 'app-admin-automatizaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-automatizaciones.component.html',
  styleUrl: './admin-automatizaciones.component.scss'
})
export class AdminAutomatizacionesComponent {
  private readonly automationService = inject(AutomationService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly list = signal<Automation[]>([]);
  automations = computed(() => this.list());

  constructor() {
    this.load();
  }

  private load(): void {
    const tid = this.tenantContext.currentTenantId();
    if (tid) this.list.set(this.automationService.getAutomations(tid));
  }

  freqLabel(freq: AutomationFrequency): string {
    return FREQ_LABEL[freq] ?? freq;
  }

  formatDate(iso: string | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' });
  }

  toggleActive(a: Automation): void {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    this.automationService.setActive(tid, a.id, !a.active);
    this.load();
    this.snackBar.open(a.active ? 'Automatización pausada' : 'Automatización activada', 'Cerrar', { duration: 2000 });
  }

  runNow(a: Automation): void {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    const result = this.automationService.runNow(tid, a.id);
    if ('error' in result) {
      this.snackBar.open(result.error, 'Cerrar', { duration: 3000 });
      return;
    }
    this.load();
    this.snackBar.open(`Tarea "${result.task.title}" creada`, 'Cerrar', { duration: 2500 });
  }

  remove(a: Automation): void {
    if (!confirm(`¿Eliminar la automatización "${a.name}"?`)) return;
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    this.automationService.remove(tid, a.id);
    this.load();
    this.snackBar.open('Automatización eliminada', 'Cerrar', { duration: 2000 });
  }
}
