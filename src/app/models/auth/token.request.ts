export interface TokenRequest { 
    username: string;
    password: string;
    device: string;
}

export interface RefreshTokenRequest { 
    token?: string;
    refreshToken?: string;
}

export interface ResetPasswordRequest { 
    email?: string;
    password?: string;
    token?: string;
}

export interface ForgotPassword {
    email?: string;
}

export interface ChangePass {
    email?: string,
    password?: string,
    code?: string
}