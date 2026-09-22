import { Routes } from '@angular/router';
import { LoginContainerComponent } from './features/auth/containers/login/login.container';

export const routes: Routes = [
  {
    path: 'login',
   component:LoginContainerComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
