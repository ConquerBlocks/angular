import { LoginResponse } from "@/app/models/auth.model";

export const AuthAdapter = (loginData: LoginResponse) => loginData.token;
