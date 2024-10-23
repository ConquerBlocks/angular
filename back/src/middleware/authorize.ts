import { Response as ExpressResponse, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): void => {
    const userRole = (req.user as any)?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.sendStatus(403); // Prohibido
      return;
    }
    next();
  };
};
