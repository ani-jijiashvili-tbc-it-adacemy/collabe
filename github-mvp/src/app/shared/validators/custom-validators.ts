import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const isValidLength = value.length >= 8;

      const valid = hasUpperCase && hasLowerCase && hasNumber && isValidLength;
      return valid ? null : {
        password: {
          message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
        },
      };
    };
  }

  static matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);

      if (!password || !confirmPassword) return null;
      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) return null;

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;

      const cleanValue = value.replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+995\d{9}$/;
      const valid = phoneRegex.test(cleanValue);

      return valid ? null : { 
        phone: {
          message: 'Phone must be: +995XXXXXXXXX'
        }
      };
    };
  }

  static dateRange(startField: string, endField: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startField)?.value;
      const end = group.get(endField)?.value;
      
      if (!start || !end) return null;
      
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (startDate >= endDate) {
        return { dateRange: 'End date and time must be after start date and time' };
      }
      return null;
    };
  }
}