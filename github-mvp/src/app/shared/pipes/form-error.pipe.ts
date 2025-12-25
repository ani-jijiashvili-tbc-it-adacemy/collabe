import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formError',
  standalone: true
})
export class FormErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return 'This field is required';
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['password']) {
      return errors['password'].message;
    }

    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    if (errors['phone']) {
      return errors['phone'].message;
    }

    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    }

    return 'Invalid value';
  }
}