import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
} from '../../models/auth-request.model';
import { ApiErrorResponse } from '../../../../shared/models/api-response.model';
import { AuthApi } from '../../services/auth-api';
import { AuthView } from '../../models/auth-form.model';
import { SignInForm } from '../../components/sign-in-form/sign-in-form';
import { SignUpForm } from '../../components/sign-up-form/sign-up-form';
import { ForgotPasswordForm } from '../../components/forgot-password-form/forgot-password-form';
import { AuthService } from '../../../../core/service/auth';
import { environment } from '../../../../../environments/environment';
import { AuthMock } from '../../services/auth-mock';
import { isOrganizer } from '../../../../shared/models/user.model';
@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, SignInForm, SignUpForm, ForgotPasswordForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authApiService = environment.useMockApi
    ? inject(AuthMock)
    : inject(AuthApi);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.router.events.subscribe(() => {
      const routeData = this.activatedRoute.snapshot.data;
      if (routeData['view']) {
        this.currentView.set(routeData['view'] as AuthView);
      }
    });
  }

  readonly signInForm = viewChild(SignInForm);
  readonly signUpForm = viewChild(SignUpForm);
  readonly forgotPasswordForm = viewChild(ForgotPasswordForm);

  readonly currentView = signal<AuthView>('sign-in');

  readonly isSignInView = computed(() => this.currentView() === 'sign-in');
  readonly isSignUpView = computed(() => this.currentView() === 'sign-up');
  readonly isForgotPasswordView = computed(
    () => this.currentView() === 'forgot-password'
  );

  ngOnInit(): void {
    const path = this.router.url.split('/')[1];
    if (path === 'signUp') {
      this.currentView.set('sign-up');
    } else if (path === 'forgotPassword') {
      this.currentView.set('forgot-password');
    } else {
      this.currentView.set('sign-in');
    }

    
  }

  onLogin(request: LoginRequest): void {
    this.authApiService.signIn(request).subscribe({
      next: (response) => {
        this.authService.setAuth(
          response.token,
          response.user,
          request.rememberMe
        );
        this.signInForm()?.setStatus('success');
         if (isOrganizer(response.user)) {
        this.router.navigate(['/admin/events']);
      } else {
        this.router.navigate(['/user/events']);
      }

        // if (response.user.role === 'organizer') {
        //   this.router.navigate(['/admin/events']);
        // } else {
        //   this.router.navigate(['/user/events']);
        //   console.log(response);
        // }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = this.extractErrorMessage(error);
        this.signInForm()?.setError(errorMessage);
      },
    });
  }

  onRegister(request: RegisterRequest): void {
    this.authApiService.signUp(request).subscribe({
      next: (response) => {
        this.authService.setAuth(response.token, response.user);
        this.signUpForm()?.setStatus('success');
        console.log(response)

        if (response.user.role === 'organizer') {
          this.router.navigate(['/admin/events']);
        } else {
          this.router.navigate(['/user/events']);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = this.extractErrorMessage(error);
        this.signUpForm()?.setError(errorMessage);
      },
    });
  }

  onForgotPassword(request: ForgotPasswordRequest): void {
    this.authApiService.forgotPassword(request).subscribe({
      next: (response) => {
        this.forgotPasswordForm()?.setSuccess(response.message);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = this.extractErrorMessage(error);
        this.forgotPasswordForm()?.setError(errorMessage);
      },
    });
  }

  onSendOtp(phone: string): void {
    this.authApiService.sendOtp(phone).subscribe({
      next: () => {},
     
    });
  }
  onVerifyOtp(otp: string): void {
    this.authApiService.verifyOtp(otp).subscribe({
      next: (response) => {
        if (response.verified) {
          this.signUpForm()?.submitRegistration();
        } else {
          this.signUpForm()?.setError('Invalid OTP code');
        }
      },
      error: (err) => {
        console.error('Verify OTP error:', err);
        this.signUpForm()?.setError('Failed to verify OTP. Try again.');
      },
    });
  }
  onNavigateToSignIn(): void {
    this.router.navigate(['/signIn']);
  }

  onNavigateToSignUp(): void {
    this.router.navigate(['/signUp']);
  }

  onNavigateToForgotPassword(): void {
    this.router.navigate(['/forgotPassword']);
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object') {
      const apiError = error.error as ApiErrorResponse;

      if (apiError.error?.message) {
        return apiError.error.message;
      }

      if (apiError.error?.details && apiError.error.details.length > 0) {
        return apiError.error.details
          .map((detail) => `${detail.field}: ${detail.message}`)
          .join(', ');
      }
    }

    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid email or password.';
      case 404:
        return 'User not found.';
      case 409:
        return 'An account with this email already exists.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
