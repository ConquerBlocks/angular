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
    ],
  },
];
