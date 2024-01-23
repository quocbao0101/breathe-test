export interface CreateUserReq {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}


export interface CreateUserRequest {
  fullName: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  roleId: number;
  communeId: number;
  description: string;
  tenantId: number;
}

export interface UpdateUserReq {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  image?: Image;
  deleteCurrentImage: boolean;
}

export interface Image {
  name: string;
  extension: string;
  byteData: string;
}

export interface ToggleStatusUserReq {
  activateUser: boolean;
  userId: string;
}

export interface DataUserRole {
  description: string,
  roleId: number,
  roleName: string,
  map: Function,
}

export interface DataProvinces {
  map: Function,
}

export interface DataCommune {
  map: Function,
}

export interface UserRole {
  data: DataUserRole,
}
