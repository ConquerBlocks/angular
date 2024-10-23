import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
};