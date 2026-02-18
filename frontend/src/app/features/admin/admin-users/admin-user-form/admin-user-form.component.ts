import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../../core/services/admin.service';
import { OrgService } from '../../../../core/services/org.service';
import { TenantContextService } from '../../../../core/services/tenant-context.service';
import { ConnectivityService } from '../../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import type { OrgUnitTreeNode } from '../../../../shared/models/org.model';

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
    MatSlideToggleModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss'
})
export class AdminUserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  private readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly snackBar = inject(MatSnackBar);
  readonly connectivity = inject(ConnectivityService);

  readonly isEdit = false;
  userId: string | null = null;
  saving = false;

  roles = this.adminService.roles;
  teams = this.adminService.teams;

  orgTree = computed(() =>
    this.orgService.getOrgTree(this.tenantContext.currentTenantId() ?? '')
  );

  flatOrgUnits = computed(() => {
    const result: { id: string; name: string; prefix: string }[] = [];
    const flatten = (node: OrgUnitTreeNode, depth: number) => {
      const prefix = '  '.repeat(depth) + (depth > 0 ? '↳ ' : '');
      result.push({ id: node.id, name: node.name, prefix });
      for (const c of node.children ?? []) flatten(c, depth + 1);
    };
    for (const n of this.orgTree()) flatten(n, 0);
    return result;
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    roleId: ['', Validators.required],
    teamId: ['', Validators.required],
    phone: [''],
    position: [''],
    notes: [''],
    isActive: [true],
    orgUnitIds: [[] as string[]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.userId = id;
      const user = this.adminService.getUserById(id);
      if (user) {
        const tid = this.tenantContext.currentTenantId();
        const orgUnitIds = tid ? this.orgService.getOrgUnitIdsForUser(tid, id) : [];
        this.form.patchValue({
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          teamId: user.teamId,
          phone: user.phone ?? '',
          position: user.position ?? '',
          notes: user.notes ?? '',
          isActive: user.isActive,
          orgUnitIds
        });
        this.form.get('email')?.disable();
      }
    }
  }

  get isEditMode(): boolean {
    return !!this.userId;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.connectivity.isOnline()) return;

    this.saving = true;
    const v = this.form.getRawValue();
    const payload = {
      name: v.name!,
      email: (v.email ?? '').toString(),
      roleId: v.roleId!,
      teamId: v.teamId!,
      phone: v.phone || undefined,
      position: v.position || undefined,
      notes: v.notes || undefined,
      isActive: v.isActive ?? true
    };

    try {
      let finalUserId: string;
      if (this.userId) {
        this.adminService.updateUser(this.userId, payload);
        finalUserId = this.userId;
        this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 2000 });
      } else {
        const created = this.adminService.createUser(payload);
        finalUserId = created.id;
        this.snackBar.open('Usuario creado', 'Cerrar', { duration: 2000 });
      }
      const tid = this.tenantContext.currentTenantId();
      const orgUnitIds = (this.form.get('orgUnitIds')?.value ?? []) as string[];
      if (tid) {
        this.orgService.setUserOrgUnits(tid, finalUserId, orgUnitIds);
      }
      this.router.navigate(['/admin/usuarios']);
    } catch (e) {
      this.saving = false;
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 4000 });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
