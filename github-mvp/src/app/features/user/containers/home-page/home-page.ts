import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventServiceMock } from '../../services/event.service.mock';
import { environment } from '../../../../../environments/environment';
import { EventListItem, EventCategory } from '../../models/event.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EventCardComponent } from '../../components/event-card/event-card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinner,
    EventCardComponent,
    FormsModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent implements OnInit {
  private readonly eventService = environment.useMockApi
    ? inject(EventServiceMock)
    : inject(EventService);

  readonly upcomingEvents = signal<EventListItem[]>([]);
  readonly categories = signal<EventCategory[]>([]);
  readonly loading = signal(true);
  readonly selectedDate = signal<Date>(new Date());

  readonly userName = signal('Sarah');

  readonly eventDates = computed(() => {
    return this.upcomingEvents()
      .map(event => new Date(event.startDateTime))
      .filter(date => date >= new Date());
  });

  ngOnInit(): void {
    this.loadUpcomingEvents();
    this.loadCategories();
  }

  loadUpcomingEvents(): void {
    this.loading.set(true);
    this.eventService.getEvents({ page: 1, pageSize: 4 }).subscribe({
      next: (response) => {
        this.upcomingEvents.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  onRegister(eventId: number): void {
    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        this.loadUpcomingEvents();
      },
      error: (error) => {
        console.error('Error registering for event:', error);
      },
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getCategoryIcon(iconName: string): string {
    const iconMap: Record<string, string> = {
      users: 'pi-users',
      book: 'pi-book',
      activity: 'pi-chart-line',
      coffee: 'pi-coffee',
      globe: 'pi-globe',
      heart: 'pi-heart',
    };
    return iconMap[iconName] || 'pi-calendar';
  }
}