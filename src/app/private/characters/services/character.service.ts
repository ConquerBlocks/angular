import { inject, Injectable, signal } from '@angular/core';
import { Character, Status } from '../models';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  state = signal({
    characters: new Map<number, Character>
  })

  baseUrl = "http://localhost:4000/characters";
  http = inject(HttpClient)

  constructor() {
    this.getCharacters();
  }

  getFormattedCharacters() {
    return Array.from(this.state().characters.values())
  }

  getCharacters() {
    this.http
      .get<Character[]>(this.baseUrl)
      .pipe(
        catchError((error) => {
          console.error("Error fetching characters", error);

          return [[
            {
              id: 1,
              name: 'Rick Sanchez',
              status: Status.ALIVE,
              species: "Human",
              type: ''
            },
          ]]
        }),
      ).subscribe((result) => {
        const newMap = new Map<number, Character>();

        result.forEach(element => newMap.set(element.id, element))

        this.state.set({ characters: newMap })
      })
  }

  getCharacterById(id: number): Character | undefined {
    return this.state().characters.get(id)
  }

  editCharacter(character: Character) {
    this.http
      .put<Character>(`${this.baseUrl}/${character.id}`, character)
      .pipe(
        catchError(error => {
          console.error("Error editing a character", error)

          return of(character)
        })
      ).subscribe((_result: Character) => {
        this.state.update((s) => {
          s.characters.set(character.id, character)
          return { ...s }
        });
      })
  }

  deleteCharacter(id: number) {
    this.http
      .delete<void>(`${this.baseUrl}/${id}`).subscribe(_result => {
        this.state.update(s => {
          s.characters.delete(id)
          return { ...s }
        })
      })
  }

  addCharacter(character: Character) {
    this.http.post<Character>(`${this.baseUrl}`, character).subscribe(_result => {
      this.state.update(s => {
        s.characters.set(character.id, character)
        return { ...s }
      })
    })
  }

}
