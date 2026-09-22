import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.models';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

/**
 * Smart/container component: talks to AuthService, owns submitting/error
 * state, and decides where to navigate after a successful login. State is
 * plain component fields (no signals) — fine here since it's only ever
 * mutated from this component's own event handlers.
 */
@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.container.html',
  styleUrl: './login.container.scss'
})
export class LoginContainerComponent implements OnDestroy {
  isSubmitting = false;
  errorMessage: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmitLogin(credentials: LoginRequest): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .login(credentials)
      .pipe(
        finalize(() => (this.isSubmitting = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => this.router.navigate(['/menu']),
        error: () => {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}