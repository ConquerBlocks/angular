import { LoginResponse, Auth } from "@/models";

export const AuthAdapter = (loginResponse: LoginResponse): Auth => ({
  accessToken: loginResponse.accessToken,
  refreshToken: loginResponse.refreshToken
});
