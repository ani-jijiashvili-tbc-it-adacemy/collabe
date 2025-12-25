import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  API_ENDPOINTS,
  API_CONFIG,
} from '../../../core/constants/api.constants';
import {
  AuthResponse,
  ForgotPasswordResponse,
  SignInResponse,
  SignUpResponse,
  UserResponse,
} from '../models/auth-response.model';
import {
  ForgotPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from '../models/auth-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.BASE_URL;

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      request
    );
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      request
    );
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      request
    );
  }

  sendOtp(phone: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.SEND_OTP}`,
      phone,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  verifyOtp(otp: string): Observable<{ verified: boolean }> {
    return this.http.post<{ verified: boolean }>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.VERIFY_OTP}`,
      otp,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
