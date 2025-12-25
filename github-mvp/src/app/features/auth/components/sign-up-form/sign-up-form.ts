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
import { SelectModule } from 'primeng/select';
import { FormErrorPipe } from '../../../../shared/pipes/form-error.pipe';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { RegisterRequest } from '../../models/auth-request.model';
import { Department } from '../../../../shared/models/user.model';
import { FormStatus } from '../../../../shared/models/form-state.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { SignUpFormInterface } from '../../models/auth-form.model';

@Component({
  selector: 'app-sign-up-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    FormErrorPipe,
    LoadingSpinner,
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm implements OnInit {
  readonly navigateToSignIn = output<void>();
  readonly sendOtp = output<string>();
  readonly submitForm = output<RegisterRequest>();
readonly verifyOtp = output<string>(); 

  readonly status = signal<FormStatus>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly otpSent = signal(false);
  readonly otpTimer = signal(300);
  readonly phoneValid = signal(false);

  readonly isLoading = computed(() => this.status() === 'loading');
  readonly hasError = computed(() => this.status() === 'error');
  readonly canSendOtp = computed(() => this.phoneValid() && !this.otpSent());
  readonly formValid = signal(false);
  readonly isDisabled = computed(() => this.isLoading() || !this.formValid());
  readonly otpTimerDisplay = computed(() => {
    const seconds = this.otpTimer();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  });

  readonly departments = signal<Department[]>([
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'Sales' },
    { id: 4, name: 'Human Resources' },
    { id: 5, name: 'Finance' },
  ]);

  readonly form = new FormGroup<SignUpFormInterface>(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.phone()],
      }),
      otp: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      }),
      department: new FormControl<Department | null>(null, {
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, CustomValidators.password()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      agreeToTerms: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    {
      validators: [
        CustomValidators.matchPasswords('password', 'confirmPassword'),
      ],
    }
  );

  readonly touchedFields = signal<Set<string>>(new Set());

  private otpIntervalId: number | null = null;

  constructor() {
    effect(() => {
      if (this.status() === 'success') {
        this.form.reset();
        this.touchedFields.set(new Set());
        this.otpSent.set(false);
        this.stopOtpTimer();
      }
    });
    this.form.controls.phone.statusChanges.subscribe(() => {
      this.phoneValid.set(this.form.controls.phone.valid);
    });
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
  }
  ngOnInit(): void {

  }

  isFieldTouched(fieldName: string): boolean {
    return this.touchedFields().has(fieldName);
  }

  hasFieldError(fieldName: keyof SignUpFormInterface): boolean {
    const control = this.form.controls[fieldName];
    return (
      this.isFieldTouched(fieldName) &&
      control.invalid &&
      control.errors !== null
    );
  }

  onFieldBlur(fieldName: string): void {
    this.touchedFields.update((fields) => {
      const newFields = new Set(fields);
      newFields.add(fieldName);
      return newFields;
    });
  }

  onSendOtp(): void {
    const phone = this.form.controls.phone.value;
    if (!phone || this.form.controls.phone.invalid) {
      this.onFieldBlur('phone');
      return;
    }

    this.sendOtp.emit(phone);
    this.otpSent.set(true);
    this.startOtpTimer();
  }

  onResendOtp(): void {
    const phone = this.form.controls.phone.value;
    if (phone) {
      this.sendOtp.emit(phone);
      this.otpTimer.set(300);
      this.startOtpTimer();
    }
  }

  // onSubmit(): void {
  //   if (this.form.invalid) {
  //     Object.keys(this.form.controls).forEach((key) => {
  //       this.onFieldBlur(key);
  //     });
  //     return;
  //   }

  //   const formValue = this.form.getRawValue();
  //   this.status.set('loading');
  //   this.errorMessage.set(null);

  //   this.submitForm.emit({
  //     firstName: formValue.firstName,
  //     lastName: formValue.lastName,
  //     email: formValue.email,
  //     phone: formValue.phone,
  //     department: formValue.department ? [formValue.department] : [],
  //     password: formValue.password,
  //   });
  // }


onSubmit(): void {
  if (this.form.invalid) {
    Object.keys(this.form.controls).forEach(key => this.onFieldBlur(key));
    return;
  }

  const formValue = this.form.getRawValue();
  this.status.set('loading');
  
  this.verifyOtp.emit(formValue.otp);
}

submitRegistration(): void {
  const formValue = this.form.getRawValue();
  
  this.submitForm.emit({
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    phone: formValue.phone,
    department: formValue.department ? [formValue.department] : [],
    password: formValue.password,
  });
}

  onSignInClick(): void {
    this.navigateToSignIn.emit();
  }

  setStatus(status: FormStatus): void {
    this.status.set(status);
  }

  setError(message: string): void {
    this.status.set('error');
    this.errorMessage.set(message);
  }

  private startOtpTimer(): void {
    this.stopOtpTimer();
    this.otpIntervalId = window.setInterval(() => {
      this.otpTimer.update((time) => {
        if (time <= 1) {
          this.stopOtpTimer();
          this.otpSent.set(false);
          return 300;
        }
        return time - 1;
      });
    }, 1000);
  }

  private stopOtpTimer(): void {
    if (this.otpIntervalId !== null) {
      window.clearInterval(this.otpIntervalId);
      this.otpIntervalId = null;
    }
  }
 
}
