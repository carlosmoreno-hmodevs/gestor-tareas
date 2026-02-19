import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantSettingsService } from '../../../core/services/tenant-settings.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { SystemMode } from '../../../shared/models/tenant-settings.model';
import { AdminSistemaConfirmDialogComponent } from './admin-sistema-confirm-dialog.component';

@Component({
  selector: 'app-admin-sistema',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-sistema.component.html',
  styleUrl: './admin-sistema.component.scss'
})
export class AdminSistemaComponent implements OnInit {
  private readonly tenantSettings = inject(TenantSettingsService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly currentUser = inject(CurrentUserService);
  readonly connectivity = inject(ConnectivityService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /** Valor local del radio (puede no estar aplicado aún). */
  selectedMode = signal<SystemMode>('normal');

  ngOnInit(): void {
    this.selectedMode.set(this.tenantSettings.systemMode());
  }

  get currentMode(): SystemMode {
    return this.tenantSettings.systemMode();
  }

  onModeChange(mode: SystemMode): void {
    this.selectedMode.set(mode);
  }

  applyMode(): void {
    if (!this.connectivity.isOnline()) {
      this.snackBar.open('Requiere conexión para cambiar el modo', undefined, { duration: 3000 });
      return;
    }
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return;
    const mode = this.selectedMode();
    if (mode === this.currentMode) {
      this.snackBar.open('El modo ya está aplicado', undefined, { duration: 2000 });
      return;
    }

    const dialogRef = this.dialog.open(AdminSistemaConfirmDialogComponent, {
      width: '480px',
      data: { mode }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tenantSettings.setSystemMode(tid, mode, this.currentUser.id);
        this.snackBar.open(
          mode === 'ferretero'
            ? 'Modo Ferretero aplicado. UI, catálogos y KPIs se han ajustado.'
            : 'Modo Normal aplicado.',
          undefined,
          { duration: 4000 }
        );
      }
    });
  }
}
