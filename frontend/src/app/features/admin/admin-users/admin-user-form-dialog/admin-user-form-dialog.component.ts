import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from '../../../../core/services/admin.service';
import type { AdminUser } from '../../../../shared/models';

export interface AdminUserFormData {
  user?: AdminUser;
}

@Component({
  selector: 'app-admin-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './admin-user-form-dialog.component.html'
})
export class AdminUserFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<AdminUserFormDialogComponent>);
  readonly data = inject<AdminUserFormData>(MAT_DIALOG_DATA);
  readonly adminService = inject(AdminService);

  roles = this.adminService.roles;
  teams = this.adminService.teams;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    roleId: ['', Validators.required],
    teamId: ['', Validators.required],
    phone: [''],
    position: [''],
    notes: [''],
    isActive: [true]
  });

  ngOnInit(): void {
    if (this.data.user) {
      this.form.patchValue({
        name: this.data.user.name,
        email: this.data.user.email,
        roleId: this.data.user.roleId,
        teamId: this.data.user.teamId,
        phone: this.data.user.phone ?? '',
        position: this.data.user.position ?? '',
        notes: this.data.user.notes ?? '',
        isActive: this.data.user.isActive
      });
      this.form.get('email')?.disable();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name,
      email: v.email,
      roleId: v.roleId,
      teamId: v.teamId,
      phone: v.phone || undefined,
      position: v.position || undefined,
      notes: v.notes || undefined,
      isActive: v.isActive ?? true
    });
  }

  cancel(): void {
    this.ref.close();
  }
}
