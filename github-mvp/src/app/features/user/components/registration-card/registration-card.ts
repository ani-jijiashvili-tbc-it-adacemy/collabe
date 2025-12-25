import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Registration } from '../../models/registration.model';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-registration-card',
  imports: [CommonModule, RouterModule, TagModule, ButtonModule],
  templateUrl: './registration-card.html',
  styleUrl: './registration-card.scss',
})
export class RegistrationCardComponent {
  readonly registration = input.required<Registration>();
  readonly cancelClick = output<number>();

  onCancelClick(registrationId: number): void {
    this.cancelClick.emit(registrationId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
getStatusSeverity(): 'success' | 'warn' | 'danger' {
  const status = this.registration().status;
  if (status === 'confirmed') return 'success';
  if (status === 'waitlisted') return 'warn';
  return 'danger';
}
 

  getStatusLabel(): string {
    const status = this.registration().status;
    if (status === 'confirmed') return 'Confirmed';
    if (status === 'waitlisted') return `Waitlisted (#${this.registration().waitlistPosition})`;
    return 'Cancelled';
  }
  isPastEvent(): boolean {
  return new Date(this.registration().startDateTime) < new Date();
}
}