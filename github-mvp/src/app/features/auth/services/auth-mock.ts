import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { MOCK_USERS, MOCK_DEPARTMENTS } from '../../../../mocks/mock-auth.data';
import {
  ForgotPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from '../models/auth-request.model';
import {
  ForgotPasswordResponse,
  SignInResponse,
  SignUpResponse,
} from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthMock {
  private mockUsers = [...MOCK_USERS];

  signIn(request: SignInRequest): Observable<SignInResponse> {
    const user = this.mockUsers.find(
      (u) => u.email === request.email && u.password === request.password
    );

    if (user) {
      return of({
        token: `mock-jwt-token-${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.departmentId,
          phone: user.phone,
        },
      }).pipe(delay(1000));
    }

    return throwError(() => ({
      status: 401,
      error: { error: { message: 'Invalid email or password' } },
    })).pipe(delay(500));
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    const existingUser = this.mockUsers.find((u) => u.email === request.email);

    if (existingUser) {
      return throwError(() => ({
        status: 409,
        error: {
          error: { message: 'An account with this email already exists' },
        },
      })).pipe(delay(500));
    }

    const newUser = {
      id: this.mockUsers.length + 1,
      name: `${request.firstName} ${request.lastName}`,
      email: request.email,
      password: request.password,
      role: 'employee' as const,
      departmentId: request.department[0]?.id || 1,
      phone: request.phone,
    };

    this.mockUsers.push(newUser);

    return of({
      token: `mock-jwt-token-${newUser.id}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.departmentId,
        phone: newUser.phone,
      },
    }).pipe(delay(1000));
  }

  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse> {
    const user = this.mockUsers.find((u) => u.email === request.email);

    if (!user) {
      return throwError(() => ({
        status: 404,
        error: {
          error: { message: 'No account found with this email address' },
        },
      })).pipe(delay(500));
    }

    return of({
      success: true,
      message: 'Password reset link has been sent to your email',
    }).pipe(delay(1000));
  }

  getDepartments(): Observable<typeof MOCK_DEPARTMENTS> {
    return of(MOCK_DEPARTMENTS).pipe(delay(300));
  }
  sendOtp(phone: string): Observable<void> {
    console.log('Mock OTP:', phone);
    return of(void 0).pipe(delay(1000));
  }

  verifyOtp(otp: string): Observable<{ verified: boolean }> {
    return of({ verified: otp === '123456' }).pipe(delay(500));
  }
}
