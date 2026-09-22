import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../models/auth.models';

// TODO: point this at your real API base URL (e.g. via environment files).
const AUTH_API_BASE_URL = 'https://srmsapi.stepacademy.ge/api/v1/auth';
/**
 * Thin wrapper around the two auth endpoints. No token/storage logic here —
 * that lives in AuthService / TokenStorageService. Keeping this service
 * "dumb" means the interceptor can also depend on it directly without
 * pulling in unrelated auth state.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${AUTH_API_BASE_URL}/login`, payload);
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${AUTH_API_BASE_URL}/refresh`, { refreshToken });
  }
}
