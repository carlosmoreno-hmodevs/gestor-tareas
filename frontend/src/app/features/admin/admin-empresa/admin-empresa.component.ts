import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { WorkspaceApiService, type WorkspaceDto } from '../../../core/api/workspace-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { mapGamoraApiError } from '../../../core/api/gamora-api-error.mapper';

const TIMEZONES = [
  'America/Mexico_City',
  'America/Monterrey',
  'America/Tijuana',
  'America/Cancun',
  'America/Bogota',
  'America/Lima',
  'America/Santiago',
  'UTC',
];

@Component({
  selector: 'app-admin-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header
      title="Empresa"
      subtitle="Datos generales y configuración operativa del workspace"
      icon="business"
    />

    @if (loading()) {
      <p>Cargando...</p>
    } @else {
      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()" class="empresa-form">
            <h3 class="section-title">Datos generales</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre de la empresa</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Identificador (slug)</mat-label>
              <input matInput [value]="workspace()?.slug ?? ''" readonly />
              <mat-hint>Solo lectura en esta fase</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Estado</mat-label>
              <input matInput [value]="workspace()?.status === 'active' ? 'Activa' : 'Inactiva'" readonly />
            </mat-form-field>

            <h3 class="section-title">Configuración operativa</h3>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Zona horaria</mat-label>
              <mat-select formControlName="timezone">
                @for (tz of timezones; track tz) {
                  <mat-option [value]="tz">{{ tz }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-slide-toggle formControlName="evidenceRequiredDefault">
              Evidencia obligatoria por defecto en nuevos compromisos
            </mat-slide-toggle>

            <mat-slide-toggle formControlName="allowAssigneeEvidenceAfterReview">
              Permitir al responsable subir evidencia después de enviar a revisión
            </mat-slide-toggle>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Días para vencimiento por defecto (opcional)</mat-label>
              <input matInput type="number" min="0" max="365" formControlName="defaultDueDays" />
              <mat-hint>Dejar vacío para no aplicar plazo automático</mat-hint>
            </mat-form-field>

            @if (!canEdit()) {
              <p class="readonly-hint">Solo administradores pueden editar estos datos.</p>
            }

            <div class="actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="saving() || form.invalid || !canEdit()">
                Guardar cambios
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .empresa-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 520px;
        padding-top: 1rem;
      }
      .section-title {
        margin: 1rem 0 0.25rem;
        font-size: 1rem;
        font-weight: 600;
      }
      .full-width {
        width: 100%;
      }
      .readonly-hint {
        color: #666;
        font-size: 0.9rem;
      }
      .actions {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class AdminEmpresaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly workspaceApi = inject(WorkspaceApiService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly workspace = signal<WorkspaceDto | null>(null);
  readonly timezones = TIMEZONES;

  readonly canEdit = () => this.auth.user()?.role === 'admin';

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    timezone: ['America/Mexico_City', Validators.required],
    evidenceRequiredDefault: [true],
    allowAssigneeEvidenceAfterReview: [false],
    defaultDueDays: [null as number | null],
  });

  async ngOnInit(): Promise<void> {
    try {
      const ws = await this.workspaceApi.getCurrent();
      this.workspace.set(ws);
      this.form.patchValue({
        name: ws.name,
        timezone: ws.settings.timezone ?? 'America/Mexico_City',
        evidenceRequiredDefault: ws.settings.evidenceRequiredDefault ?? true,
        allowAssigneeEvidenceAfterReview: ws.settings.allowAssigneeEvidenceAfterReview ?? false,
        defaultDueDays: ws.settings.defaultDueDays ?? null,
      });
      if (!this.canEdit()) {
        this.form.disable();
      }
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid || !this.canEdit()) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    try {
      const updated = await this.workspaceApi.updateCurrent({
        name: v.name!,
        settings: {
          timezone: v.timezone!,
          evidenceRequiredDefault: v.evidenceRequiredDefault ?? true,
          allowAssigneeEvidenceAfterReview: v.allowAssigneeEvidenceAfterReview ?? false,
          defaultDueDays: v.defaultDueDays ?? undefined,
        },
      });
      this.workspace.set(updated);
      this.snackBar.open('Empresa actualizada correctamente', 'Cerrar', { duration: 2500 });
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.saving.set(false);
    }
  }
}
