export interface TokenContainer {
  token: string;
}

export interface LoginResponse extends TokenContainer { }
export interface Auth extends TokenContainer { }

export interface AuthData {
  email: string;
  password: string;
}
