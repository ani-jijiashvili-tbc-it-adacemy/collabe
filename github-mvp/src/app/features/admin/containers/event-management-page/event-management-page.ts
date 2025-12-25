import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { EventCard } from '../../components/event-card/event-card';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

import { AdminEvent } from '../../services/admin-event';
import { EventListItem, EventStatus, EventType } from '../../models/admin-event.model';
import { SORT_ORDER_OPTIONS, STATUS_OPTIONS } from '../../models/admin-event.model';
import { environment } from '../../../../../environments/environment';
import { AdminEventMock } from '../../services/admin-event.service.mock';
import { AuthService } from '../../../../core/service/auth';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-management-page',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
    EventCard,
    LoadingSpinner,
    RouterModule
  ],
  templateUrl: './event-management-page.html',
  styleUrl: './event-management-page.scss',
})
export class EventManagementPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly adminEventService: AdminEvent | AdminEventMock = environment.useMockApi
    ? inject(AdminEventMock)
    : inject(AdminEvent);
  private readonly authService = inject(AuthService);

  readonly events = signal<EventListItem[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly sortOrder = signal<'newest' | 'oldest'>('newest');
  readonly sortOrderOptions = SORT_ORDER_OPTIONS;

  readonly searchQuery = signal('');
  readonly selectedStatus = signal<EventStatus | 'all'>('all');
  readonly selectedCategory = signal<number | null>(null);

  readonly currentPage = signal(1);
  readonly pageSize = signal(12);
  readonly totalEvents = signal(0);

  readonly selectedEventIds = signal<Set<number>>(new Set());

  readonly filteredEvents = computed(() => this.events());
  readonly totalPages = computed(() =>
    Math.ceil(this.totalEvents() / this.pageSize())
  );
  readonly hasSelection = computed(() => this.selectedEventIds().size > 0);
  readonly allSelected = computed(
    () =>
      this.events().length > 0 &&
      this.selectedEventIds().size === this.events().length
  );

  readonly userName = computed(() => this.authService.user()?.name || 'Guest');
  readonly userRole = computed(() => this.authService.user()?.role || '');
  readonly userAvatar = signal('https://api.dicebear.com/7.x/avataaars/svg?seed=Michael');

  readonly statusOptions = STATUS_OPTIONS;
  readonly categoryOptions = signal<Array<{ id: number | null; name: string }>>([]);

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  loadCategories(): void {
    this.adminEventService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: EventType[]) => {
          this.categoryOptions.set([
            { id: null, name: 'All Categories' },
            ...categories.map((cat: EventType) => ({ id: cat.id, name: cat.name }))
          ]);
        },
        error: (err) => {
          console.error('Failed to load categories', err);
        }
      });
  }

  loadEvents(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const filters = {
      search: this.searchQuery() || undefined,
      status: this.selectedStatus() === 'all' ? undefined : this.selectedStatus() as EventStatus,
      categories: this.selectedCategory() ? [this.selectedCategory()!] : undefined,
      sortOrder: this.sortOrder(),
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    this.adminEventService.getEvents(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const eventsWithCalculations = response.events.map((event) => ({
            ...event,
            utilizationPercentage: Math.round(
              (event.registeredCount / event.capacity) * 100
            ),
            spotsLeft: event.capacity - event.registeredCount,
          }));

          this.events.set(eventsWithCalculations);
          this.totalEvents.set(response.total);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load events. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.loadEvents();
  }

  onStatusChange(value: EventStatus | 'all'): void {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
    this.loadEvents();
  }

  onCategoryChange(value: number | null): void {
    this.selectedCategory.set(value);
    this.currentPage.set(1);
    this.loadEvents();
  }

  onToggleSortOrder(value: 'newest' | 'oldest'): void {
    this.sortOrder.set(value);
    this.currentPage.set(1);
    this.loadEvents();
  }

  onCreateEvent(): void {
    this.router.navigate(['/admin/events/create']);
  }

  onViewEvent(eventId: number): void {
    this.router.navigate(['/admin/events', eventId]);
  }

  onEditEvent(eventId: number): void {
    this.router.navigate(['/admin/events', eventId, 'edit']);
  }

  onDeleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.adminEventService.deleteEvent(eventId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEvents();
          },
          error: () => {
            alert('Failed to delete event. Please try again.');
          },
        });
    }
  }

  onToggleSelection(eventId: number): void {
    const newSelection = new Set(this.selectedEventIds());
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId);
    } else {
      newSelection.add(eventId);
    }
    this.selectedEventIds.set(newSelection);
  }

  onToggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedEventIds.set(new Set());
    } else {
      const allIds = this.events().map((e) => e.id);
      this.selectedEventIds.set(new Set(allIds));
    }
  }

  onExportSelected(): void {
    const selectedEvents = this.events().filter(e => this.selectedEventIds().has(e.id));
    const headers = 'Title,Date,Location,Category,Registrations,Capacity,Status\n';
    const rows = selectedEvents.map(e => 
      `"${e.title}","${e.startDateTime}","${e.location}","${e.eventType.name}",${e.registeredCount},${e.capacity},"${e.status}"`
    ).join('\n');
    const csv = headers + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `selected-events-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onDeleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedEventIds().size} events?`)) {
      const deleteObservables = Array.from(this.selectedEventIds()).map(id => 
        this.adminEventService.deleteEvent(id)
      );
      
      forkJoin(deleteObservables)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedEventIds.set(new Set());
            this.loadEvents();
          },
          error: () => alert('Failed to delete some events')
        });
    }
  }

  onClearSelection(): void {
    this.selectedEventIds.set(new Set());
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEvents();
  }

  isEventSelected(eventId: number): boolean {
    return this.selectedEventIds().has(eventId);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, total);
      } else if (current >= total - 3) {
        pages.push(1, -1, total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  }

  onExportList(): void {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `events-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = 'Title,Date,Location,Category,Registrations,Capacity,Status\n';
    const rows = this.events().map(e =>
      `"${e.title}","${e.startDateTime}","${e.location}","${e.eventType.name}",${e.registeredCount},${e.capacity},"${e.status}"`
    ).join('\n');
    return headers + rows;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}