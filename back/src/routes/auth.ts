import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  validatePassword,
  usersList,
} from "../models/User";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/authenticate";
import { addRevokedToken } from "../models/RevokedTokens";
import { asyncHandler } from "../utils/asyncHandler";
import Joi from "joi";
import JWT_SECRET from "../config";

const authRouter = Router();

// Esquemas de validación con Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Registro de usuario
authRouter.post(
  "/register",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };

    if (findUserByEmail(email)) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const user = await createUser(email, password);
    res.status(201).json({ id: user.id, email: user.email });
  }),
);

// Login de usuario
authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };
    const user = findUserByEmail(email);

    if (!user || !(await validatePassword(user, password))) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Guarda el refreshToken en el usuario
    user.refreshToken = refreshToken;

    res.json({ accessToken, refreshToken });
  }),
);

// Endpoint para refrescar el Access Token
authRouter.post(
  "/token",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh Token requerido" });
      return;
    }

    // Busca al usuario con este refreshToken
    const user = usersList.find((u) => u.refreshToken === refreshToken);

    if (!user) {
      res.status(403).json({ message: "Refresh Token inválido" });
      return;
    }

    try {
      jwt.verify(refreshToken, JWT_SECRET);

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: "Refresh Token inválido" });
    }
  }),
);

// Logout de usuario
authRouter.post(
  "/logout",
  authenticateToken,
  asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        addRevokedToken(token);

        // Eliminar el refreshToken del usuario
        const user = usersList.find((u) => u.id === (req.user as any).id);
        if (user) {
          user.refreshToken = undefined;
        }
      }
      res.json({ message: "Cierre de sesión exitoso" });
    },
  ),
);

export default authRouter;
