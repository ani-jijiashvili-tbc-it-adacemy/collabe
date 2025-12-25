import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RegistrationTabs } from '../../components/registration-tabs/registration-tabs';
import { ParticipantRow } from '../../components/participant-row/participant-row';
import { WaitlistRow } from '../../components/waitlist-row/waitlist-row';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminEvent } from '../../services/admin-event';
import {
  RegistrationList,
  RegistrationTab,
} from '../../models/registration.model';
import { AdminEventList } from '../../models/admin-event.model';
import { Registration } from '../../services/registration';
import { environment } from '../../../../../environments/environment';
import { AdminEventMock } from '../../services/admin-event.service.mock';
import { RegistrationMock} from '../../services/registration.service.mock';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-event-details-page',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RegistrationTabs,
    ParticipantRow,
    WaitlistRow,
    LoadingSpinner,
  ],
  templateUrl: './event-details-page.html',
  styleUrl: './event-details-page.scss',
})
export class EventDetailsPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminEventService: AdminEvent | AdminEventMock = environment.useMockApi
    ? inject(AdminEventMock)
    : inject(AdminEvent);
  private readonly registrationService: Registration | RegistrationMock = environment.useMockApi
    ? inject(RegistrationMock)
    : inject(Registration);

  readonly event = signal<AdminEventList | null>(null);
  readonly registrations = signal<RegistrationList[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly activeTab = signal<RegistrationTab>('registered');
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly totalRegistrations = signal(0);

  readonly selectedRegistrationIds = signal<Set<number>>(new Set());
  readonly isLoadingRegistrations = signal(false);

  readonly registeredCount = signal(0);
  readonly waitlistCount = signal(0);
  readonly cancelledCount = signal(0);
  readonly waitlistRegistrations = signal<RegistrationList[]>([]);

  readonly filteredRegistrations = computed(() => this.registrations());
  readonly totalPages = computed(() =>
    Math.ceil(this.totalRegistrations() / this.pageSize())
  );
  readonly hasSelection = computed(
    () => this.selectedRegistrationIds().size > 0
  );
  readonly isDeleting = signal(false);

  readonly eventId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  });

  ngOnInit(): void {
    const id = this.eventId();
    if (id) {
      this.loadEvent(id);
      this.loadRegistrations(id);
      this.loadWaitlistData(id);
    }
  }

  loadWaitlistData(id: number): void {
    const filters = {
      tab: 'waitlist' as RegistrationTab,
      search: undefined,
      page: 1,
      pageSize: 100
    };

    this.registrationService.getRegistrations(id, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.waitlistRegistrations.set(response.registrations);
        },
        error: (err) => {
          console.error('Error loading waitlist:', err);
        }
      });
  }

  loadEvent(id: number): void {
    this.isLoading.set(true);

    this.adminEventService.getEventById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.event.set(event);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load event details.');
          this.isLoading.set(false);
          console.error('Error loading event:', err);
        },
      });
  }

  loadRegistrations(id: number): void {
    const filters = {
      tab: this.activeTab(),
      search: this.searchQuery() || undefined,
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };

    this.registrationService.getRegistrations(id, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.registrations.set(response.registrations);
          this.totalRegistrations.set(response.total);
          this.registeredCount.set(response.counts.registered);
          this.waitlistCount.set(response.counts.waitlist);
          this.cancelledCount.set(response.counts.cancelled);
          const currentEvent = this.event();
          if (currentEvent) {
            this.event.set({
              ...currentEvent,
              registeredCount: response.counts.registered,
              waitlistCount: response.counts.waitlist
            });
          }
        },
        error: (err) => {
          this.error.set('Failed to load registrations.');
          console.error('Error loading registrations:', err);
        },
      });
  }

  onTabChange(tab: RegistrationTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.selectedRegistrationIds.set(new Set());
    const id = this.eventId();
    if (id) {
      this.loadRegistrations(id);
    }
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    const id = this.eventId();
    if (id) {
      this.loadRegistrations(id);
    }
  }

  onEditEvent(): void {
    const id = this.eventId();
    if (id) {
      this.router.navigate(['/admin/events', id, 'edit']);
    }
  }

  onExportAll(): void {
    const id = this.eventId();
    if (id) {
      this.registrationService.exportRegistrations(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `event-${id}-registrations-${Date.now()}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            alert('Failed to export registrations.');
            console.error('Error exporting:', err);
          },
        });
    }
  }

  onToggleSelection(registrationId: number): void {
    const newSelection = new Set(this.selectedRegistrationIds());
    if (newSelection.has(registrationId)) {
      newSelection.delete(registrationId);
    } else {
      newSelection.add(registrationId);
    }
    this.selectedRegistrationIds.set(newSelection);
  }

  onExportSelected(): void {
    console.log(
      'Exporting registrations:',
      Array.from(this.selectedRegistrationIds())
    );
    alert('Export selected functionality will be implemented');
  }

  onDeleteSelected(): void {
    const eventId = this.eventId();
    if (!eventId) return;

    const count = this.selectedRegistrationIds().size;
    
    if (confirm(`Are you sure you want to delete ${count} registration${count > 1 ? 's' : ''}?`)) {
      this.isDeleting.set(true);
      
      const deleteRequests = Array.from(this.selectedRegistrationIds()).map(id =>
        this.registrationService.deleteRegistration(eventId, id)
      );

      forkJoin(deleteRequests)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isDeleting.set(false);
            this.selectedRegistrationIds.set(new Set());
            
            const currentEvent = this.event();
            if (currentEvent) {
              this.event.set({
                ...currentEvent,
                registeredCount: this.registeredCount() - count,
              });
            }
            
            this.loadRegistrations(eventId);
          },
          error: (err) => {
            this.isDeleting.set(false);
            alert('Failed to delete registrations');
            console.error('Delete error:', err);
          }
        });
    }
  }

  onClearSelection(): void {
    this.selectedRegistrationIds.set(new Set());
  }

  onPromoteWaitlist(registrationId: number): void {
    const eventId = this.eventId();
    if (!eventId) return;

    if (
      confirm(
        'Are you sure you want to promote this participant from the waitlist?'
      )
    ) {
      this.registrationService
        .promoteFromWaitlist(eventId, registrationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadRegistrations(eventId);
            this.loadEvent(eventId);
          },
          error: (err) => {
            alert('Failed to promote participant.');
            console.error('Error promoting:', err);
          },
        });
    }
  }

  onRemoveWaitlist(registrationId: number): void {
    if (
      confirm(
        'Are you sure you want to remove this participant from the waitlist?'
      )
    ) {
      console.log('Removing from waitlist:', registrationId);
      alert('Remove functionality will be implemented');
    }
  }

  onContactParticipant(contact: { email: string; phone: string }): void {
    console.log('Contact participant:', contact);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    const id = this.eventId();
    if (id) {
      this.loadRegistrations(id);
    }
  }

  isRegistrationSelected(registrationId: number): boolean {
    return this.selectedRegistrationIds().has(registrationId);
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

  navigateBack(): void {
    this.router.navigate(['/admin/events']);
  }

  getWaitlistRegistrations(): RegistrationList[] {
    return this.waitlistRegistrations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}