export interface RoleReq {
  id: string;
  name: string;
  description: string;
}

export interface UpdateRolePermissionsReq {
  roleId: string;
  permissions: string[];
}
