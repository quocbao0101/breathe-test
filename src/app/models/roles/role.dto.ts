export interface RoleDto {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface PermissionDto {
  description: string;
  action: string;
  resource: string;
  isBasic: boolean;
  isRoot: boolean;
  name: string;
}
