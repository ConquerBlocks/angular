const revokedTokens: string[] = [];

export const addRevokedToken = (token: string): void => {
  revokedTokens.push(token);
};

export const isTokenRevoked = (token: string): boolean => {
  return revokedTokens.includes(token);
};
