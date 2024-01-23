export interface TokenResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  roles: Roles;
  access_token: string;
  token_type: string;
  tenant: string;
  uid: string;
  tenantId: string;
  refreshToken: string;
  providerId: string;
}

export interface Roles {
  roleId: number;
  roleName: string;
  privileges: string[];
}
