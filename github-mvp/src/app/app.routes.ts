import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { adminRoutes } from './features/admin/admin.routes';
import { userRoutes } from './features/user/user.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'signIn', pathMatch: 'full' },
  ...authRoutes,
  ...adminRoutes,...userRoutes,
  {
    path: '**',
    redirectTo: 'sign-in',
  },
];
