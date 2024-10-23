import { Request, Response as ExpressResponse, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isTokenRevoked } from "../models/RevokedTokens";

import JWT_SECRET from "../config";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: ExpressResponse,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401); // No autorizado
    return;
  }

  if (isTokenRevoked(token)) {
    res.sendStatus(403); // Prohibido
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verify Error:", err);
      res.sendStatus(403); // Prohibido
      return;
    }
    req.user = user;
    next();
  });
};
