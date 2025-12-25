import { Component, output, signal, computed, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormErrorPipe } from '../../../../shared/pipes/form-error.pipe';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ForgotPasswordRequest } from '../../models/auth-request.model';
import { FormStatus } from '../../../../shared/models/form-state.model';
import { ForgotPasswordFormInterface } from '../../models/auth-form.model';

@Component({
  selector: 'app-forgot-password-form',
  imports: [  CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FormErrorPipe,
    LoadingSpinner],
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.scss',
})
export class ForgotPasswordForm {
readonly submitForm = output<ForgotPasswordRequest>();
  readonly navigateToSignIn = output<void>();

  readonly status = signal<FormStatus>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly isLoading = computed(() => this.status() === 'loading');
  readonly hasError = computed(() => this.status() === 'error');
  readonly isSuccess = computed(() => this.status() === 'success');

  readonly form = new FormGroup<ForgotPasswordFormInterface>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  readonly emailControl = computed(() => this.form.controls.email);
  readonly emailTouched = signal(false);

  readonly showEmailError = computed(() => 
    this.emailTouched() && 
    this.emailControl().invalid && 
    this.emailControl().errors !== null
  );
  readonly formValid = signal(false);
readonly isDisabled = computed(() => this.isLoading() || !this.formValid());

  constructor() {
    effect(() => {
      if (this.status() === 'success') {
        this.successMessage.set(
          'We\'ve sent you a link to reset your password. Please check your email.'
        );
      }
    });
    this.form.statusChanges.subscribe(() => {
    this.formValid.set(this.form.valid);
  });
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.emailTouched.set(true);
      return;
    }

    const formValue = this.form.getRawValue();
    this.status.set('loading');
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.submitForm.emit({
      email: formValue.email
    });
  }

  onBackToSignIn(): void {
    this.navigateToSignIn.emit();
  }

  setStatus(status: FormStatus): void {
    this.status.set(status);
  }

  setError(message: string): void {
    this.status.set('error');
    this.errorMessage.set(message);
  }

  setSuccess(message: string): void {
    this.status.set('success');
    this.successMessage.set(message);
  }
}
