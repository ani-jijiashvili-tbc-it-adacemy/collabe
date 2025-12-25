import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {  RegistrationList, WaitlistPriority } from '../../models/registration.model';

@Component({
  selector: 'app-waitlist-row',
  imports: [CommonModule],
  templateUrl: './waitlist-row.html',
  styleUrl: './waitlist-row.scss',
  
})
export class WaitlistRow {
    readonly registration = input.required<RegistrationList>();
  readonly position = input.required<number>();
  
  readonly promote = output<number>();
  readonly remove = output<number>();

  onPromote(): void {
    this.promote.emit(this.registration().id);
  }

  onRemove(): void {
    this.remove.emit(this.registration().id);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  getPriorityClass(): string {
    const priority = this.getPriority();
    return `priority-${priority}`;
  }

  getPriorityLabel(): string {
    return this.getPriority().charAt(0).toUpperCase() + this.getPriority().slice(1);
  }

  private getPriority(): WaitlistPriority {
    const position = this.position();
    if (position <= 3) return 'high';
    if (position <= 7) return 'medium';
    return 'normal';
  }

}
