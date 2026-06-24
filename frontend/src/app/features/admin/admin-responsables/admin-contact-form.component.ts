import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ContactsApiService } from '../../../core/api/contacts-api.service';
import { mapGamoraApiError } from '../../../core/api/gamora-api-error.mapper';

@Component({
  selector: 'app-admin-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PageHeaderComponent,
  ],
  template: `
    <nav class="breadcrumb">
      <a routerLink="/admin/responsables">Responsables</a>
      <span>/</span>
      <span>{{ isEdit() ? 'Editar' : 'Nuevo' }}</span>
    </nav>

    <app-page-header
      [title]="isEdit() ? 'Editar responsable' : 'Nuevo responsable'"
      [subtitle]="isEdit() ? 'Actualiza los datos del contacto operativo' : 'Alta de responsable para compromisos Gamora'"
      icon="badge"
    />

    @if (loading()) {
      <p>Cargando...</p>
    } @else {
      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()" class="form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre para mostrar</mat-label>
              <input matInput formControlName="display_name" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Teléfono (opcional)</mat-label>
              <input matInput formControlName="phone_number" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo (opcional)</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Puesto / rol operativo (opcional)</mat-label>
              <input matInput formControlName="position" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Área / equipo (opcional)</mat-label>
              <input matInput formControlName="team" />
            </mat-form-field>

            @if (linkedUserLabel()) {
              <p class="linked-hint">
                <strong>Usuario vinculado:</strong> {{ linkedUserLabel() }}
                <br />
                <small>Si editas el nombre aquí y hay usuario vinculado, también se actualiza el nombre del usuario.</small>
              </p>
            }

            <div class="actions">
              <a mat-button routerLink="/admin/responsables">Cancelar</a>
              <button mat-flat-button color="primary" type="submit" [disabled]="saving() || form.invalid">
                Guardar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: [
    `
      .breadcrumb {
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        color: #666;
      }
      .breadcrumb a {
        color: #1565c0;
        text-decoration: none;
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        max-width: 520px;
        padding-top: 1rem;
      }
      .full-width {
        width: 100%;
      }
      .linked-hint {
        font-size: 0.9rem;
        color: #555;
        margin: 0.5rem 0;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class AdminContactFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contactsApi = inject(ContactsApiService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly isEdit = signal(false);
  readonly linkedUserLabel = signal<string | null>(null);

  private contactId: string | null = null;

  readonly form = this.fb.nonNullable.group({
    display_name: ['', [Validators.required, Validators.minLength(2)]],
    phone_number: [''],
    email: [''],
    position: [''],
    team: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.isEdit.set(true);
      this.contactId = id;
      void this.load(id);
    }
  }

  async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const c = await this.contactsApi.getById(id);
      this.form.patchValue({
        display_name: c.displayName,
        phone_number: c.phoneNumber ?? '',
        email: c.email ?? '',
        position: c.position ?? '',
        team: c.team ?? '',
      });
      if (c.userId) {
        this.linkedUserLabel.set(`${c.userDisplayName} (${c.userEmail})`);
      }
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    const v = this.form.getRawValue();
    try {
      if (this.isEdit() && this.contactId) {
        await this.contactsApi.update(this.contactId, {
          display_name: v.display_name,
          phone_number: v.phone_number || null,
          email: v.email || null,
          position: v.position || null,
          team: v.team || null,
        });
      } else {
        await this.contactsApi.create({
          display_name: v.display_name,
          phone_number: v.phone_number || undefined,
          email: v.email || undefined,
          position: v.position || undefined,
          team: v.team || undefined,
        });
      }
      this.snackBar.open('Responsable guardado', 'Cerrar', { duration: 2500 });
      await this.router.navigate(['/admin/responsables']);
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.saving.set(false);
    }
  }
}
