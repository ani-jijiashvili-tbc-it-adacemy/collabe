import { computed, Injectable, signal } from '@angular/core';
import { User, UserRole } from '../../shared/models/user.model';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Router } from '@angular/router';
import { Storage } from '../service/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(
    private readonly storageService: Storage,
    private readonly router: Router
  ) {
    this.loadFromStorage();
  }

setAuth(token: string, user: User, rememberMe: boolean = false): void {
  const normalizedUser = {
    ...user,
    role: user.role.toLowerCase() as UserRole
  };
  this.tokenSignal.set(token);
  this.userSignal.set(normalizedUser);
}
  clearAuth(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.storageService.removeItem(STORAGE_KEYS.TOKEN);
    this.storageService.removeItem(STORAGE_KEYS.USER);
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/sign-in']);
  }

  private loadFromStorage(): void {
    const token =
      localStorage.getItem(STORAGE_KEYS.TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson =
      localStorage.getItem(STORAGE_KEYS.USER) ||
      sessionStorage.getItem(STORAGE_KEYS.USER);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.tokenSignal.set(token);
        this.userSignal.set(user);
      } catch (error) {
        this.clearAuth();
      }
    }
  }
}
