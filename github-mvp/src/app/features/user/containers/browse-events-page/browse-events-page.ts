import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from '../../components/event-card/event-card';
import { EventFiltersComponent } from '../../components/event-filters/event-filters';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EventService } from '../../services/event.service';
import { EventServiceMock } from '../../services/event.service.mock';
import { environment } from '../../../../../environments/environment';
import { EventListItem, EventCategory } from '../../models/event.model';
import { EventFilters, DEFAULT_EVENT_FILTERS } from '../../models/event-filters.model';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-browse-events-page',
  imports: [
    CommonModule,
    EventCardComponent,
    EventFiltersComponent,
    LoadingSpinner,
    PaginatorModule,
  ],
  templateUrl: './browse-events-page.html',
  styleUrl: './browse-events-page.scss',
})
export class BrowseEventsPageComponent implements OnInit {
  private readonly eventService = environment.useMockApi
    ? inject(EventServiceMock)
    : inject(EventService);

  readonly events = signal<EventListItem[]>([]);
  readonly categories = signal<EventCategory[]>([]);
  readonly locations = signal<string[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly currentFilters = signal<EventFilters>({ ...DEFAULT_EVENT_FILTERS });

  readonly rows = computed(() => this.currentFilters().pageSize);
  readonly first = computed(() => (this.currentFilters().page - 1) * this.currentFilters().pageSize);

  ngOnInit(): void {
    this.loadCategories();
    this.loadLocations();
    this.loadEvents();
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

  loadLocations(): void {
    this.eventService.getLocations().subscribe({
      next: (response) => {
        this.locations.set(response.locations);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
      },
    });
  }

 loadEvents(): void {
  this.loading.set(true);
  this.eventService.getEvents(this.currentFilters()).subscribe({
    next: (response) => {
      console.log('API Response:', response); 
      this.events.set(response.data);
      this.totalRecords.set(response.total);
      this.loading.set(false);
    },
    error: (error) => {
      console.error('Error loading events:', error);
      this.events.set([]); 
      this.loading.set(false);
    },
  });
}
  onFiltersChange(filters: EventFilters): void {
    this.currentFilters.set({ ...filters, page: 1 });
    this.loadEvents();
  }

  onPageChange(event: any): void {
    this.currentFilters.update(filters => ({
      ...filters,
      page: event.page + 1,
    }));
    this.loadEvents();
  }

  onRegister(eventId: number): void {
    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error registering for event:', error);
      },
    });
  }
}