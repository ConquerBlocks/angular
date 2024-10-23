import bcrypt from "bcrypt";

export interface User {
  id: number;
  email: string;
  password: string; // Contraseña hasheada
  role: "admin" | "user";
  refreshToken?: string;
}

const users: User[] = [];

export const createUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role: "user", // Rol por defecto
  };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export const validatePassword = async (
  user: User,
  password: string,
): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

export const getUserById = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};

export const usersList = users; // Exportamos la lista de usuarios para usos posteriores
