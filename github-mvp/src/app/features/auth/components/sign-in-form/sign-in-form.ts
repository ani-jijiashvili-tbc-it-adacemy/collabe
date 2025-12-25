import {
  Component,
  output,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormErrorPipe } from '../../../../shared/pipes/form-error.pipe';
import { LoginRequest } from '../../models/auth-request.model';
import { FormStatus } from '../../../../shared/models/form-state.model';
import { SignInFormInterface } from '../../models/auth-form.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-sign-in-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    FormErrorPipe,
    LoadingSpinner,
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.scss',
})
export class SignInForm implements OnInit {
  readonly submitForm = output<LoginRequest>();
  readonly navigateToSignUp = output<void>();
  readonly navigateToForgotPassword = output<void>();

  readonly status = signal<FormStatus>('idle');
  readonly errorMessage = signal<string | null>(null);

  readonly isLoading = computed(() => this.status() === 'loading');
  readonly hasError = computed(() => this.status() === 'error');

  readonly form = new FormGroup<SignInFormInterface>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  readonly emailControl = computed(() => this.form.controls.email);
  readonly passwordControl = computed(() => this.form.controls.password);
  readonly rememberMeControl = computed(() => this.form.controls.rememberMe);

  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);

  readonly showEmailError = computed(
    () =>
      this.emailTouched() &&
      this.emailControl().invalid &&
      this.emailControl().errors !== null
  );

  readonly showPasswordError = computed(
    () =>
      this.passwordTouched() &&
      this.passwordControl().invalid &&
      this.passwordControl().errors !== null
  );
  readonly formValid = signal(false);
  readonly isDisabled = computed(() => this.isLoading() || !this.formValid());
  constructor() {
    effect(() => {
      if (this.status() === 'success') {
        this.form.reset();
      }
    });
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  onPasswordBlur(): void {
    this.passwordTouched.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.emailTouched.set(true);
      this.passwordTouched.set(true);
      return;
    }

    const formValue = this.form.getRawValue();
    if (formValue.rememberMe) {
      localStorage.setItem('rememberedEmail', formValue.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    this.status.set('loading');
    this.errorMessage.set(null);

    this.submitForm.emit({
      email: formValue.email,
      password: formValue.password,
    });
  }

  onSignUpClick(): void {
    this.navigateToSignUp.emit();
  }

  onForgotPasswordClick(): void {
    this.navigateToForgotPassword.emit();
  }

  setStatus(status: FormStatus): void {
    this.status.set(status);
  }

  setError(message: string): void {
    this.status.set('error');
    this.errorMessage.set(message);
  }
  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.form.patchValue({
        email: rememberedEmail,
        rememberMe: true,
      });
    }
  }
}
