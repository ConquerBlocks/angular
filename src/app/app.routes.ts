import { Routes } from '@angular/router';

export const appRoutes = {
  public: {
    root: 'public',
    register: 'register',
    login: 'login',
    notFound: 'not-found',
  },
  private: {
    root: 'private',
    characters: 'characters',
  },
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `/${appRoutes.public.login}`,
  },
  {
    path: appRoutes.public.login,
    loadComponent: () =>
      import('./public/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: appRoutes.public.register,
    loadComponent: () =>
      import('./public/components/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: appRoutes.private.root,
    loadChildren: () =>
      import('./private/private.routes').then((m) => m.routes),
  },
  {
    path: appRoutes.public.notFound,
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  { path: '**', redirectTo: appRoutes.public.notFound },
];
