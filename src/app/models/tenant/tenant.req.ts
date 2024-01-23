export interface CreateTenantReq {
  displayName: string;
  tenantName: string;
  description: string;
}

export interface UpdateTenantReq {
  displayName: string;
  description: string;
}
