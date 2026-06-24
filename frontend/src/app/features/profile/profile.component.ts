import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { AuthService } from '../../core/auth/auth.service';
import { UsersApiService, USER_ROLE_LABELS } from '../../core/api/users-api.service';
import { mapGamoraApiError } from '../../core/api/gamora-api-error.mapper';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    PageHeaderComponent,
  ],
  template: `
    <app-page-header title="Mi perfil" subtitle="Tu cuenta y empresa actual" icon="person" />

    <mat-card class="profile-card">
      <mat-card-content>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="profile-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre para mostrar</mat-label>
            <input matInput formControlName="displayName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Correo</mat-label>
            <input matInput [value]="auth.user()?.email ?? ''" readonly />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Rol</mat-label>
            <input matInput [value]="roleLabel()" readonly />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Empresa</mat-label>
            <input matInput [value]="auth.workspace()?.name ?? ''" readonly />
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="savingProfile() || profileForm.invalid">
            Guardar perfil
          </button>
        </form>

        <mat-divider class="section-divider" />

        <h3>Cambiar contraseña</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="profile-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña actual</mat-label>
            <input matInput type="password" formControlName="currentPassword" autocomplete="current-password" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nueva contraseña</mat-label>
            <input matInput type="password" formControlName="newPassword" autocomplete="new-password" />
          </mat-form-field>
          <button mat-stroked-button type="submit" [disabled]="savingPassword() || passwordForm.invalid">
            Actualizar contraseña
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .profile-card {
        max-width: 520px;
      }
      .profile-form {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .full-width {
        width: 100%;
      }
      .section-divider {
        margin: 1.5rem 0;
      }
      h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        font-weight: 600;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly usersApi = inject(UsersApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);

  readonly profileForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.profileForm.patchValue({ displayName: user.displayName });
    }
  }

  roleLabel(): string {
    const role = this.auth.user()?.role;
    if (!role) return '—';
    return USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] ?? role;
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    try {
      await this.usersApi.updateMe({ display_name: this.profileForm.getRawValue().displayName });
      await this.auth.loadMe();
      this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 2500 });
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.savingProfile.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) return;
    this.savingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    try {
      await this.usersApi.changePassword(currentPassword, newPassword);
      this.passwordForm.reset();
      this.snackBar.open('Contraseña actualizada', 'Cerrar', { duration: 2500 });
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.savingPassword.set(false);
    }
  }
}
