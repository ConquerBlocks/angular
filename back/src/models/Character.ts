export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

const characters: Character[] = [];

// Funciones CRUD
export const getAllCharacters = (): Character[] => {
  return characters;
};

export const getCharacterById = (id: number): Character | undefined => {
  return characters.find((character) => character.id === id);
};

export const addCharacter = (character: Character): Character => {
  characters.push(character);
  return character;
};

export const updateCharacter = (
  id: number,
  updatedCharacter: Character,
): Character | null => {
  const index = characters.findIndex((char) => char.id === id);
  if (index !== -1) {
    characters[index] = { ...updatedCharacter, id };
    return characters[index];
  }
  return null;
};

export const deleteCharacter = (id: number): boolean => {
  const index = characters.findIndex((char) => char.id === id);
  if (index !== -1) {
    characters.splice(index, 1);
    return true;
  }
  return false;
};
