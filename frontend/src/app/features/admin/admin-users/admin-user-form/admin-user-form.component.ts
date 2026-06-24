import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import {
  UsersApiService,
  USER_ROLE_LABELS,
  type ApiUserRole,
} from '../../../../core/api/users-api.service';
import { ConnectivityService } from '../../../../core/services/connectivity.service';
import { mapGamoraApiError } from '../../../../core/api/gamora-api-error.mapper';

const ROLES: ApiUserRole[] = ['admin', 'coordinator', 'assignee', 'viewer'];

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    PageHeaderComponent,
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss',
})
export class AdminUserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly usersApi = inject(UsersApiService);
  private readonly snackBar = inject(MatSnackBar);
  readonly connectivity = inject(ConnectivityService);

  userId: string | null = null;
  readonly saving = signal(false);
  readonly roles = ROLES;
  readonly roleLabels = USER_ROLE_LABELS;

  readonly form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['assignee' as ApiUserRole, Validators.required],
    password: [''],
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.userId = id;
      try {
        const user = await this.usersApi.getById(id);
        this.form.patchValue({
          displayName: user.displayName,
          email: user.email,
          role: user.role,
        });
        this.form.controls.email.disable();
      } catch (err) {
        this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
      }
    }
  }

  get isEditMode(): boolean {
    return !!this.userId;
  }

  async save(): Promise<void> {
    if (this.form.invalid || !this.connectivity.isOnline()) return;

    this.saving.set(true);
    const v = this.form.getRawValue();

    try {
      if (this.userId) {
        await this.usersApi.update(this.userId, {
          display_name: v.displayName,
          role: v.role,
        });
        this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 2000 });
      } else {
        const result = await this.usersApi.create({
          email: v.email,
          display_name: v.displayName,
          role: v.role,
          password: v.password || undefined,
          create_contact: true,
        });
        const temp = result.temporaryPassword;
        this.snackBar.open(
          temp
            ? `Usuario creado. Contraseña temporal: ${temp}`
            : 'Usuario creado',
          'Cerrar',
          { duration: 8000 }
        );
      }
      await this.router.navigate(['/admin/usuarios']);
    } catch (err) {
      this.snackBar.open(mapGamoraApiError(err), 'Cerrar', { duration: 4000 });
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    void this.router.navigate(['/admin/usuarios']);
  }
}
