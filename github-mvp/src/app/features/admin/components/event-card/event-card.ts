import { Component, input, output } from '@angular/core';
import { EventListItem } from '../../models/admin-event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  readonly event = input.required<EventListItem>();

  readonly view = output<number>();
  readonly edit = output<number>();
  readonly delete = output<number>();

  onView(): void {
    this.view.emit(this.event().id);
  }

  onEdit(): void {
    this.edit.emit(this.event().id);
  }

  onDelete(): void {
    this.delete.emit(this.event().id);
  }

  getStatusClass(): string {
    const status = this.event().status;
    return `status-${status}`;
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
      hour12: true,
    });
  }
}
