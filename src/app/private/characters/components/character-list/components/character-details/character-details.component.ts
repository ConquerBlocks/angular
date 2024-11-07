import { Character } from '@/private/characters/models';
import { CharacterService } from '@/private/characters/services';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetailsComponent {
  character = input.required<Character>()
  characterService = inject(CharacterService)

  removeCharacter(characterId: number) {
    this.characterService.deleteCharacter(characterId)
  }
}
