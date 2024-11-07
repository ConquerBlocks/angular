import { Router, Response as ExpressResponse } from "express";
import {
  getAllCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  Character,
} from "../models/Character";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/authenticate";
import { authorizeRoles } from "../middleware/authorize";
import { asyncHandler } from "../utils/asyncHandler";
import Joi from "joi";

const characterRouter = Router();

// Aplica el middleware de autenticación a todas las rutas
characterRouter.use(authenticateToken);

// Esquema de validación para personajes
const characterSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().required(),
  status: Joi.string().valid("Alive", "Dead", "unknown").required(),
  species: Joi.string().required(),
  type: Joi.string().allow(""),
  gender: Joi.string()
    .valid("Female", "Male", "Genderless", "unknown")
    .required(),
  origin: Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
  }).required(),
  location: Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
  }).required(),
  image: Joi.string().uri().required(),
  episode: Joi.array().items(Joi.string().uri()).required(),
  url: Joi.string().uri().required(),
  created: Joi.string().isoDate().required(),
});

// Obtener todos los personajes
characterRouter.get(
  "/",
  asyncHandler(
    async (_req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
      const characters = getAllCharacters();
      res.json(characters);
    },
  ),
);

// Obtener un personaje por ID
characterRouter.get(
  "/:id",
  asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
      const id = parseInt(req.params.id, 10);
      const character = getCharacterById(id);
      if (character) {
        res.json(character);
      } else {
        res.status(404).json({ message: "Personaje no encontrado" });
      }
    },
  ),
);

// Agregar un nuevo personaje (autorizado para 'admin' y 'user')
characterRouter.post(
  "/",
  authorizeRoles("admin", "user"),
  asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
      const { error } = characterSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const characterData: Character = req.body;
      const newCharacter: Character = {
        ...characterData,
        id: Date.now(), // Generar un ID único
      };

      addCharacter(newCharacter);
      res.status(201).json(newCharacter);
    },
  ),
);

// Actualizar un personaje existente
characterRouter.put(
  "/:id",
  authorizeRoles("admin", "user"),
  asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
      const id = parseInt(req.params.id, 10);

      const { error } = characterSchema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const characterData: Character = req.body;
      const updatedCharacter = updateCharacter(id, characterData);
      if (updatedCharacter) {
        res.json(updatedCharacter);
      } else {
        res.status(404).json({ message: "Personaje no encontrado" });
      }
    },
  ),
);

// Eliminar un personaje
characterRouter.delete(
  "/:id",
  authorizeRoles("admin", "user"),
  asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
      const id = parseInt(req.params.id, 10);
      const success = deleteCharacter(id);
      if (success) {
        res.json({ message: "Personaje eliminado" });
      } else {
        res.status(404).json({ message: "Personaje no encontrado" });
      }
    },
  ),
);

export default characterRouter;
