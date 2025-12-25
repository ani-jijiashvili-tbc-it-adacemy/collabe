import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventListItem } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCardComponent {
  readonly event = input.required<EventListItem>();
  readonly registerClick = output<number>();

  onRegisterClick(eventId: number): void {
    this.registerClick.emit(eventId);
  }

  getCapacityStatus(): 'available' | 'limited' | 'full' {
    const percentage = (this.event().registeredCount / this.event().capacity) * 100;
    if (percentage >= 100) return 'full';
    if (percentage >= 70) return 'limited';
    return 'available';
  }

  getCapacityClass(): string {
    const status = this.getCapacityStatus();
    return `capacity-${status}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}