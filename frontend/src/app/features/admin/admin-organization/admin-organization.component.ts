import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { OrgService } from '../../../core/services/org.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { AdminService } from '../../../core/services/admin.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import type { OrgUnit, OrgUnitTreeNode } from '../../../shared/models/org.model';

@Component({
  selector: 'app-admin-organization',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    PageHeaderComponent
  ],
  templateUrl: './admin-organization.component.html',
  styleUrl: './admin-organization.component.scss'
})
export class AdminOrganizationComponent {
  readonly orgService = inject(OrgService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly adminService = inject(AdminService);

  selectedUnitForUsers = signal<string>('');

  orgTree = computed(() =>
    this.orgService.getOrgTree(this.tenantContext.currentTenantId() ?? '')
  );
  orgUnitTypes = computed(() =>
    this.orgService.getOrgUnitTypes(this.tenantContext.currentTenantId() ?? '')
  );

  newName = '';
  newCode = '';
  newTypeKey = '';
  newParentId = '';

  addOrgUnit(): void {
    const tid = this.tenantContext.currentTenantId();
    if (!tid || !this.newName.trim()) return;
    const typeKey = this.newTypeKey || this.orgUnitTypes()[0]?.key || 'STORE';
    this.orgService.addOrgUnit({
      tenantId: tid,
      parentId: this.newParentId || undefined,
      typeKey,
      name: this.newName.trim(),
      code: this.newCode.trim() || undefined,
      isActive: true
    });
    this.newName = '';
    this.newCode = '';
    this.newParentId = '';
    this.newTypeKey = '';
  }

  flattenForSelect(node: OrgUnitTreeNode, depth: number): { id: string; name: string; prefix: string }[] {
    const prefix = '  '.repeat(depth) + (depth > 0 ? '↳ ' : '');
    const result: { id: string; name: string; prefix: string }[] = [
      { id: node.id, name: node.name, prefix }
    ];
    for (const c of node.children ?? []) {
      result.push(...this.flattenForSelect(c, depth + 1));
    }
    return result;
  }

  deactivate(unit: OrgUnit): void {
    if (!confirm(`¿Desactivar "${unit.name}"?`)) return;
    this.orgService.deactivateOrgUnit(unit.id);
  }

  /** Usuarios del tenant */
  tenantUsers = computed(() => {
    const tid = this.tenantContext.currentTenantId();
    if (!tid) return [];
    return this.adminService.getUsers();
  });

  /** Lista plana de unidades para el select */
  flatOrgUnits = computed(() => {
    const result: { id: string; name: string; prefix: string }[] = [];
    for (const node of this.orgTree()) {
      result.push(...this.flattenForSelect(node, 0));
    }
    return result;
  });

  /** Usuarios asignados a la unidad seleccionada */
  usersInSelectedUnit = computed(() => {
    this.orgService.memberships(); // dependencia reactiva
    const unitId = this.selectedUnitForUsers();
    const tid = this.tenantContext.currentTenantId();
    if (!unitId || !tid) return [];
    const memberships = this.orgService.getMembershipsByOrgUnit(tid, unitId);
    return memberships.map((m) => {
      const u = this.tenantUsers().find((u) => u.id === m.userId);
      return { membershipId: m.id, userId: m.userId, userName: u?.name ?? m.userId };
    });
  });

  /** Usuarios que aún no están en la unidad seleccionada (para el dropdown) */
  usersAvailableForUnit = computed(() => {
    this.orgService.memberships(); // dependencia reactiva
    const unitId = this.selectedUnitForUsers();
    const tid = this.tenantContext.currentTenantId();
    const all = this.tenantUsers();
    if (!unitId || !tid) return all;
    const inUnit = this.orgService.getMembershipsByOrgUnit(tid, unitId).map((m) => m.userId);
    return all.filter((u) => !inUnit.includes(u.id));
  });

  newUserToAdd = '';

  addUserToUnit(): void {
    const unitId = this.selectedUnitForUsers();
    const userId = this.newUserToAdd.trim();
    const tid = this.tenantContext.currentTenantId();
    if (!unitId || !userId || !tid) return;
    this.orgService.assignUserToOrgUnit(userId, unitId, tid);
    this.newUserToAdd = '';
  }

  removeUserFromUnit(membershipId: string): void {
    this.orgService.removeUserFromOrgUnit(membershipId);
  }
}
