import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

// Requests to these endpoints must never get an Authorization header,
// and a 401 from them should not trigger a refresh attempt.
const AUTH_ENDPOINTS = ['/api/auth/login', '/api/auth/refresh'];

// Module-level (singleton) refresh coordination so concurrent 401s
// trigger only one refresh call and everyone else waits on it.
let isRefreshing = false;
const refreshedAccessToken$ = new BehaviorSubject<string | null>(null);

function withAuthHeader(req: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
}

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenStorage: TokenStorageService,
  authApi: AuthApiService,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    authService.logout();
    return throwError(() => new Error('No refresh token available.'));
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshedAccessToken$.next(null);

    return authApi.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        isRefreshing = false;
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
        refreshedAccessToken$.next(response.accessToken);
        return next(withAuthHeader(req, response.accessToken));
      }),
      catchError((refreshError: unknown) => {
        isRefreshing = false;
        refreshedAccessToken$.next(null);
        // Refresh token itself failed/expired -> log the user out.
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  }

  // A refresh is already in flight: wait for it, then retry with the new token.
  return refreshedAccessToken$.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(withAuthHeader(req, token)))
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authApi = inject(AuthApiService);
  const authService = inject(AuthService);

  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));
  const accessToken = tokenStorage.getAccessToken();

  const outgoingRequest = accessToken && !isAuthEndpoint ? withAuthHeader(req, accessToken) : req;

  return next(outgoingRequest).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;

      if (isUnauthorized && !isAuthEndpoint) {
        return handleUnauthorized(outgoingRequest, next, tokenStorage, authApi, authService);
      }

      return throwError(() => error);
    })
  );
};
