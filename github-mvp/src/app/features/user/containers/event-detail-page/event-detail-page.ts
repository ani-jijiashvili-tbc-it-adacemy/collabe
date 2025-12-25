import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventServiceMock } from '../../services/event.service.mock';
import { environment } from '../../../../../environments/environment';
import { EventDetail } from '../../models/event.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-event-detail-page',
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinner,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './event-detail-page.html',
  styleUrl: './event-detail-page.scss',
})
export class EventDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = environment.useMockApi
    ? inject(EventServiceMock)
    : inject(EventService);

  readonly event = signal<EventDetail | null>(null);
  readonly loading = signal(true);
  readonly registering = signal(false);

  readonly availableSpots = computed(() => {
    const evt = this.event();
    return evt ? evt.capacity - evt.registeredCount : 0;
  });

  readonly isFull = computed(() => this.availableSpots() <= 0);

  readonly canRegister = computed(() => {
    const evt = this.event();
    return evt && !evt.isUserRegistered && !this.registering();
  });
  readonly openFaqIndex = signal<number | null>(null);

toggleFaq(index: number): void {
  this.openFaqIndex.update(current => current === index ? null : index);
}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading.set(true);
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.loading.set(false);
        this.router.navigate(['/user/events']);
      },
    });
  }

  onRegister(): void {
    const evt = this.event();
    if (!evt || this.registering()) return;

    this.registering.set(true);
    this.eventService.registerForEvent(evt.id).subscribe({
      next: () => {
        this.loadEvent(evt.id);
        this.registering.set(false);
      },
      error: (error) => {
        console.error('Error registering:', error);
        this.registering.set(false);
      },
    });
  }

  onCancelRegistration(): void {
    const evt = this.event();
    if (!evt) return;

    this.eventService.cancelRegistration(evt.id).subscribe({
      next: () => {
        this.loadEvent(evt.id);
      },
      error: (error) => {
        console.error('Error cancelling registration:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/user/events']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  getCapacityPercentage(): number {
    const evt = this.event();
    if (!evt) return 0;
    return (evt.registeredCount / evt.capacity) * 100;
  }

  getCapacityClass(): string {
    const percentage = this.getCapacityPercentage();
    if (percentage >= 100) return 'full';
    if (percentage >= 70) return 'limited';
    return 'available';
  }
}