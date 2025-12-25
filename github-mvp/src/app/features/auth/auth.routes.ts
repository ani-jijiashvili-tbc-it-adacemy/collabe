import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'signIn',
    pathMatch: 'full'
  },
  {
    path: 'signIn',
    loadComponent: () => 
      import('./containers/auth-page/auth-page')
        .then(m => m.AuthPage),
    data: { view: 'sign-in' }
  },
  {
    path: 'signUp',
    loadComponent: () => 
      import('./containers/auth-page/auth-page')
        .then(m => m.AuthPage),
    data: { view: 'sign-up' }
  },
  {
    path: 'forgotPassword',
    loadComponent: () => 
      import('./containers/auth-page/auth-page')
        .then(m => m.AuthPage),
    data: { view: 'forgot-password' }
  }
];