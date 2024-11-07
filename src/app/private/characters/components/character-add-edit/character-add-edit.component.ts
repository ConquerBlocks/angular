import { CustomInputComponent, CustomSelectComponent } from '@/components';
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Character, EmptyCharacter, Status } from '../../models';
import { CharacterService } from '../../services';

interface CharacterForm {
  name: FormControl<string>;
  status: FormControl<Status>;
}

@Component({
  selector: 'app-character-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent, CustomSelectComponent],
  templateUrl: './character-add-edit.component.html',
  styleUrl: './character-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterAddEditComponent {
  readonly id = input<number>();
  private readonly characterService = inject(CharacterService);
  protected options = Object.values(Status);

  characterToEdit = computed(() => this.characterService.getCharacterById(Number(this.id())) ?? EmptyCharacter)

  characterForm: Signal<FormGroup> = computed(
    () => new FormGroup<CharacterForm>({
      name: new FormControl<string>(this.characterToEdit().name, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      status: new FormControl<Status>(this.characterToEdit().status, {
        nonNullable: true,
        validators: [Validators.required]
      })
    })
  )

  onSubmit(): void {
    if (this.characterForm().valid) {
      const character: Character = {
        ...(this.id() ? { id: Number(this.id()) } : {}),
        ...this.characterForm().getRawValue(),
        species: "Human",
        type: "",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Earth (Replacement Dimension)",
          url: "https://rickandmortyapi.com/api/location/20",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        episode: [
          "https://rickandmortyapi.com/api/episode/1",
          "https://rickandmortyapi.com/api/episode/2",
        ],
        url: "https://rickandmortyapi.com/api/character/1",
        created: "2017-11-04T18:48:46.250Z",
      }

      const method = this.id() ? 'editCharacter' : 'addCharacter';

      this.characterService[method](character);

      this.characterForm().reset()
    }
  }
}
