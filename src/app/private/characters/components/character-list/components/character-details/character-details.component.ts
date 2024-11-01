import { Character } from '@/private/characters/models';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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

}
