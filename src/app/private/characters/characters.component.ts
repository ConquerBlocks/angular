import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CharacterService } from './services';
import { CharacterListComponent } from './components';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CharacterListComponent],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersComponent {
  private charactersService = inject(CharacterService)

  characters = computed(() => Array.from(this.charactersService.state().characters).map(element => {
    const [, character] = element

    return character
  }))


  constructor() {
    this.charactersService.getCharacters();
  }
}
