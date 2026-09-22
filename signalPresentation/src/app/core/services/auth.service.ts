import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { TokenStorageService } from './token-storage.service';
import { LoginRequest, LoginResponse } from '../models/auth.models';

/**
 * Public-facing auth API for the rest of the app (login container, guards,
 * nav bar, etc.). Holds auth state as a plain BehaviorSubject<boolean> —
 * intentionally not a signal, per project convention.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isAuthenticatedSubject: BehaviorSubject<boolean>;
  readonly isAuthenticated$: Observable<boolean>;

  constructor(
    private readonly authApi: AuthApiService,
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenStorage.hasValidSession());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authApi.login(credentials).pipe(
      tap((response) => {
        this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Called by the auth interceptor when the refresh token itself fails.
   * Clears local session state and sends the user back to login.
   */
  logout(): void {
    this.tokenStorage.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
