import { Routes } from '@angular/router';

export const appRoutes = {
  public: {
    root: 'public',
    login: 'login',
    register: 'register'
  }
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: `/${appRoutes.public.login}`,
    pathMatch: 'full'
  },
  {
    path: appRoutes.public.login,
    loadComponent: () => import('./public/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: appRoutes.public.register,
    loadComponent: () => import('./public/components/register/register.component').then(m => m.RegisterComponent)
  },
];
