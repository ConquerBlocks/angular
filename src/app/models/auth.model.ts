interface TokenContainer {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenContainer { }
export interface Auth extends TokenContainer { }

export interface AuthData {
  email: string;
  password: string;
}
