import { Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { appRoutes } from '../app.routes';
import { authGuard } from '../guards';

export const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: appRoutes.private.characters },
      {
        path: appRoutes.private.characters,
        loadComponent: () =>
          import('./characters/characters.component').then(
            (m) => m.CharactersComponent,
          ),
      },
      {
        path: appRoutes.private.new_character,
        loadComponent: () =>
          import('./characters/components/character-add-edit/character-add-edit.component').then(
            (m) => m.CharacterAddEditComponent,
          ),
      },
      {
        path: `${appRoutes.private.characters}/:id`,
        loadComponent: () =>
          import('./characters/components/character-add-edit/character-add-edit.component').then(
            (m) => m.CharacterAddEditComponent,
          ),
      }
    ],
  },
];
