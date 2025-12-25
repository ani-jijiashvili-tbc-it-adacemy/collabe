import { FormControl } from '@angular/forms';
import { Department } from '../../../shared/models/user.model';

export interface SignInFormInterface {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}
export interface SignUpFormInterface {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  otp: FormControl<string>;
  department: FormControl<Department | null>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  agreeToTerms: FormControl<boolean>;
}
export interface ForgotPasswordFormInterface {
  email: FormControl<string>;
}

export type AuthView = 'sign-in' | 'sign-up' | 'forgot-password';
