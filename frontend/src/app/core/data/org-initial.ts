import type { OrgUnitType, OrgUnit, UserOrgMembership } from '../../shared/models/org.model';

/** Tipos de unidad org por tenant (keys configurables) */
export const INITIAL_ORG_UNIT_TYPES: OrgUnitType[] = [
  { id: 'out-region', tenantId: 'tenant-1', key: 'REGION', label: 'Región', order: 1 },
  { id: 'out-store', tenantId: 'tenant-1', key: 'STORE', label: 'Tienda', order: 2 },
  { id: 'out-dept', tenantId: 'tenant-1', key: 'DEPARTMENT', label: 'Departamento', order: 3 },
  { id: 'out-region2', tenantId: 'tenant-2', key: 'REGION', label: 'Región', order: 1 },
  { id: 'out-store2', tenantId: 'tenant-2', key: 'STORE', label: 'Tienda', order: 2 },
  { id: 'out-group2', tenantId: 'tenant-2', key: 'GROUP', label: 'Grupo', order: 0 }
];

/** Unidades org dummy por tenant */
export const INITIAL_ORG_UNITS: OrgUnit[] = [
  { id: 'ou-1', tenantId: 'tenant-1', typeKey: 'REGION', name: 'Región Norte', code: 'RN', isActive: true },
  { id: 'ou-2', tenantId: 'tenant-1', parentId: 'ou-1', typeKey: 'STORE', name: 'Tienda Centro', code: 'TC', isActive: true },
  { id: 'ou-3', tenantId: 'tenant-1', parentId: 'ou-2', typeKey: 'DEPARTMENT', name: 'Ventas', code: 'V', isActive: true },
  { id: 'ou-4', tenantId: 'tenant-1', parentId: 'ou-1', typeKey: 'STORE', name: 'Tienda Sur', code: 'TS', isActive: true },
  { id: 'ou-5', tenantId: 'tenant-2', typeKey: 'GROUP', name: 'Grupo X', code: 'GX', isActive: true },
  { id: 'ou-6', tenantId: 'tenant-2', parentId: 'ou-5', typeKey: 'REGION', name: 'Región Sur', code: 'RS', isActive: true },
  { id: 'ou-7', tenantId: 'tenant-2', parentId: 'ou-6', typeKey: 'STORE', name: 'Tienda 1', code: 'T1', isActive: true }
];

export const INITIAL_USER_ORG_MEMBERSHIPS: UserOrgMembership[] = [
  { id: 'uom-1', tenantId: 'tenant-1', userId: 'user-1', orgUnitId: 'ou-1' },
  { id: 'uom-2', tenantId: 'tenant-1', userId: 'user-2', orgUnitId: 'ou-2' },
  { id: 'uom-3', tenantId: 'tenant-1', userId: 'user-3', orgUnitId: 'ou-3' },
  { id: 'uom-4', tenantId: 'tenant-2', userId: 'user-4', orgUnitId: 'ou-6' },
  { id: 'uom-5', tenantId: 'tenant-2', userId: 'user-5', orgUnitId: 'ou-7' }
];
