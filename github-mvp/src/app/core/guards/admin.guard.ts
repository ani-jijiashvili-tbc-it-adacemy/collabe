import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth';
import { isOrganizer } from '../../shared/models/user.model';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/signIn']);
  }

  if (!isOrganizer(user)) {
    return router.createUrlTree(['/events']);
  }

  return true;
};