import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Registration } from '../../services/registration';
import { RegistrationList } from '../../models/registration.model';

@Component({
  selector: 'app-participant-row',
  imports: [CommonModule],
  templateUrl: './participant-row.html',
  styleUrl: './participant-row.scss',
})
export class ParticipantRow {
  readonly registration = input.required<RegistrationList>();
  readonly selected = input<boolean>(false);

  readonly selectionChange = output<boolean>();
  readonly contact = output<{ email: string; phone: string }>();

  onSelectionChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectionChange.emit(checked);
  }

  onEmail(): void {
    const participant = this.registration().participant;
    this.contact.emit({
      email: participant.email,
      phone: participant.phone,
    });
  }

  onCall(): void {
    const participant = this.registration().participant;
    this.contact.emit({
      email: participant.email,
      phone: participant.phone,
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getStatusClass(): string {
    return `status-${this.registration().status}`;
  }
}
