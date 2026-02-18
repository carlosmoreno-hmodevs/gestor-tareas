/** Árbol organizacional por tenant */

export interface OrgUnitType {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  order: number;
}

export interface OrgUnit {
  id: string;
  tenantId: string;
  parentId?: string;
  typeKey: string;
  name: string;
  code?: string;
  isActive: boolean;
}

export interface UserOrgMembership {
  id: string;
  tenantId: string;
  userId: string;
  orgUnitId: string;
  localRole?: string;
}

export interface OrgUnitTreeNode extends OrgUnit {
  children: OrgUnitTreeNode[];
}
