import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-reglas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-reglas.component.html',
  styleUrl: './admin-reglas.component.scss'
})
export class AdminReglasComponent {
  readonly adminService = inject(AdminService);
  readonly connectivity = inject(ConnectivityService);

  dueDateRules = this.adminService.dueDateRules;
  notificationRules = this.adminService.notificationRules;

  dueSoonMax = computed(() => {
    const unit = this.dueDateRules().dueSoonUnit ?? 'days';
    return unit === 'hours' ? 720 : 30;
  });

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[^0-9]/g, '');
    input.value = raw;
    const val = raw === '' ? NaN : parseInt(raw, 10);
    const max = this.dueSoonMax();
    if (!isNaN(val) && val >= 1 && val <= max) {
      try {
        this.adminService.updateDueDateRules({ daysUntilDueSoon: val });
      } catch {
        /* ignore */
      }
    }
  }

  onAmountBlur(): void {
    const current = this.dueDateRules().daysUntilDueSoon;
    const max = this.dueSoonMax();
    if (current < 1 || current > max) {
      const clamped = Math.max(1, Math.min(max, current || 1));
      try {
        this.adminService.updateDueDateRules({ daysUntilDueSoon: clamped });
      } catch {
        /* ignore */
      }
    }
  }

  onUnitChange(unit: 'days' | 'hours'): void {
    const current = this.dueDateRules().daysUntilDueSoon;
    const max = unit === 'hours' ? 720 : 30;
    const clamped = Math.min(max, Math.max(1, current));
    try {
      this.adminService.updateDueDateRules({
        dueSoonUnit: unit,
        daysUntilDueSoon: clamped
      });
    } catch {
      /* ignore */
    }
  }

  toggleNotification(id: string, enabled: boolean): void {
    try {
      this.adminService.updateNotificationRule(id, { enabled });
    } catch {
      /* ignore */
    }
  }
}
