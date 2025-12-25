import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  EventsResponse,
  EventDetail,
  EventCategory,
  EventListItem,
} from '../models/event.model';
import { EventFilters } from '../models/event-filters.model';
import { MOCK_ADMIN_EVENTS } from '../../../../mocks/mock-admin-event.data';
import { MOCK_REGISTRATIONS } from '../../../../mocks/mock-registration.data';
import { AuthService } from '../../../core/service/auth';

const MOCK_CATEGORIES: EventCategory[] = [
  {
    id: 1,
    name: 'Team Building',
    description: 'Team building activities',
    eventCount: 0,
    icon: 'users',
  },
  {
    id: 2,
    name: 'Workshop',
    description: 'Educational workshops',
    eventCount: 0,
    icon: 'book',
  },
  {
    id: 3,
    name: 'Sports',
    description: 'Sports activities',
    eventCount: 0,
    icon: 'activity',
  },
  {
    id: 4,
    name: 'Happy Friday',
    description: 'Friday social events',
    eventCount: 0,
    icon: 'coffee',
  },
  {
    id: 5,
    name: 'Cultural',
    description: 'Cultural events',
    eventCount: 0,
    icon: 'globe',
  },
  {
    id: 6,
    name: 'Wellness',
    description: 'Wellness activities',
    eventCount: 0,
    icon: 'heart',
  },
];

const MOCK_LOCATIONS: string[] = [
  'Grand Conference Hall',
  'Training Room A',
  'Training Room B',
  'Recreation Lounge',
  'Virtual Meeting',
  'Off-site',
  'Main Cafeteria',
  'Sports Complex',
  'Wellness Center',
  'Central Park',
  'Tech Hub',
  'Fitness Center',
];

@Injectable({
  providedIn: 'root',
})
export class EventServiceMock {
  private readonly authService = inject(AuthService);

  private getCurrentUserId(): number {
    return this.authService.user()?.id || 1;
  }

  private mapToUserEvent(
    adminEvent: (typeof MOCK_ADMIN_EVENTS)[0]
  ): EventListItem {
    return {
      id: adminEvent.id,
      title: adminEvent.title,
      description: adminEvent.description,
      eventType: adminEvent.eventType,
      startDateTime: adminEvent.startDateTime,
      endDateTime: adminEvent.endDateTime,
      location: adminEvent.location,
      capacity: adminEvent.capacity,
      registeredCount: adminEvent.registeredCount,
      waitlistCount: adminEvent.waitlistCount,
      imageUrl: adminEvent.imageUrl,
      tags: adminEvent.tags,
      isFull: adminEvent.registeredCount >= adminEvent.capacity,
      isUserRegistered: this.checkIfUserRegistered(adminEvent.id),
    };
  }

  private checkIfUserRegistered(eventId: number): boolean {
    const userId = this.getCurrentUserId();
    const registrations = MOCK_REGISTRATIONS[eventId] || [];
    return registrations.some(
      (r) => r.participant.id === userId && r.status !== 'cancelled'
    );
  }

getEvents(filters: EventFilters): Observable<EventsResponse> {
  let filteredEvents = MOCK_ADMIN_EVENTS.filter(
    (e) => e.status === 'upcoming'
  ).map((e) => this.mapToUserEvent(e));

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
    );
  }

  if (filters.categories && filters.categories.length > 0) {
    filteredEvents = filteredEvents.filter((event) =>
      filters.categories!.includes(event.eventType.id)
    );
  }

  if (filters.locations && filters.locations.length > 0) {
    filteredEvents = filteredEvents.filter((event) =>
      filters.locations!.includes(event.location)
    );
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredEvents = filteredEvents.filter((event) =>
      new Date(event.startDateTime) >= fromDate
    );
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredEvents = filteredEvents.filter((event) =>
      new Date(event.startDateTime) <= toDate
    );
  }

  if (filters.capacityAvailability) {
    filteredEvents = filteredEvents.filter((event) => {
      const percentageFull = (event.registeredCount / event.capacity) * 100;

      switch (filters.capacityAvailability) {
        case 'available':
          return percentageFull < 50;
        case 'limited':
          return percentageFull >= 50 && percentageFull < 100;
        case 'full':
          return event.isFull;
        default:
          return true;
      }
    });
  }

  if (filters.myStatus) {
    if (filters.myStatus === 'registered') {
      filteredEvents = filteredEvents.filter((event) => event.isUserRegistered);
    } else if (filters.myStatus === 'not-registered') {
      filteredEvents = filteredEvents.filter((event) => !event.isUserRegistered);
    }
  }

  const total = filteredEvents.length;
  const start = (filters.page - 1) * filters.pageSize;
  const end = start + filters.pageSize;
  const paginatedEvents = filteredEvents.slice(start, end);

  return of({
    data: paginatedEvents,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
  }).pipe(delay(500));
}

  getEventById(id: number): Observable<EventDetail> {
    const adminEvent = MOCK_ADMIN_EVENTS.find((e) => e.id === id);
    if (!adminEvent) {
      throw new Error('Event not found');
    }

    const userEvent = this.mapToUserEvent(adminEvent);
    const userId = this.getCurrentUserId();
    const registrations = MOCK_REGISTRATIONS[id] || [];
    const userRegistration = registrations.find(
      (r) => r.participant.id === userId && r.status !== 'cancelled'
    );

    const eventDetail: EventDetail = {
      ...userEvent,
      organizer: {
        id: adminEvent.createdBy.id,
        name: adminEvent.createdBy.name,
        email: adminEvent.createdBy.email,
        phone: adminEvent.createdBy.phone,
      },
      agenda: [
        {
          time: '09:00 AM - 09:30 AM',
          title: 'Registration & Welcome',
          description: 'Check-in and networking',
        },
        {
          time: '09:30 AM - 11:00 AM',
          title: 'Main Session',
          description: 'Interactive workshop and activities',
        },
        {
          time: '11:00 AM - 12:00 PM',
          title: 'Q&A and Closing',
          description: 'Questions and wrap-up',
        },
      ],
      speakers: [],
      faqs: [
        {
          question: 'Can I cancel my registration?',
          answer: 'Yes, you can cancel up to 48 hours before the event starts.',
        },
        {
          question: 'Will food be provided?',
          answer:
            'Food availability depends on the event. Check the event tags for "free-food".',
        },
      ],
      userRegistrationStatus:
        userRegistration?.status === 'confirmed' ||
        userRegistration?.status === 'waitlisted'
          ? userRegistration.status
          : null,
    };

    return of(eventDetail).pipe(delay(300));
  }

  getCategories(): Observable<{ categories: EventCategory[] }> {
    const categoriesWithCount = MOCK_CATEGORIES.map((cat) => ({
      ...cat,
      eventCount: MOCK_ADMIN_EVENTS.filter(
        (e) => e.eventType.id === cat.id && e.status === 'upcoming'
      ).length,
    }));

    return of({ categories: categoriesWithCount }).pipe(delay(200));
  }

  getLocations(): Observable<{ locations: string[] }> {
    return of({ locations: MOCK_LOCATIONS }).pipe(delay(200));
  }

  registerForEvent(eventId: number): Observable<any> {
    const event = MOCK_ADMIN_EVENTS.find((e) => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const isFull = event.registeredCount >= event.capacity;
    const status = isFull ? 'waitlisted' : 'confirmed';

    if (!MOCK_REGISTRATIONS[eventId]) {
      MOCK_REGISTRATIONS[eventId] = [];
    }

    const newRegistration = {
      id: Math.floor(Math.random() * 10000),
      participant: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        department: currentUser.department
          ? `Department ${currentUser.department}`
          : 'Engineering',
        phone: currentUser.phone || '+995555123456',
        photo: null,
      },
      status: status as any,
      registeredAt: new Date().toISOString(),
      cancelledAt: null,
      waitlistPosition: isFull ? event.waitlistCount + 1 : undefined,
    };

    MOCK_REGISTRATIONS[eventId].push(newRegistration);

    if (isFull) {
      event.waitlistCount++;
    } else {
      event.registeredCount++;
    }

    localStorage.setItem(
      'mockRegistrations',
      JSON.stringify(MOCK_REGISTRATIONS)
    );
    localStorage.setItem('mockEvents', JSON.stringify(MOCK_ADMIN_EVENTS));

    return of({
      success: true,
      status,
      message: `Successfully ${status} for event`,
      registration: {
        id: newRegistration.id,
        eventId,
        userId: currentUser.id,
        status,
        registeredAt: newRegistration.registeredAt,
        waitlistPosition: newRegistration.waitlistPosition,
      },
    }).pipe(delay(500));
  }

  cancelRegistration(eventId: number): Observable<any> {
    const userId = this.getCurrentUserId();
    const registrations = MOCK_REGISTRATIONS[eventId] || [];
    const userRegistration = registrations.find(
      (r) => r.participant.id === userId && r.status !== 'cancelled'
    );

    if (userRegistration) {
      const wasConfirmed = userRegistration.status === 'confirmed';
      const wasWaitlisted = userRegistration.status === 'waitlisted';

      userRegistration.status = 'cancelled' as any;
      userRegistration.cancelledAt = new Date().toISOString();

      const event = MOCK_ADMIN_EVENTS.find((e) => e.id === eventId);
      if (event) {
        if (wasConfirmed) {
          event.registeredCount--;
        } else if (wasWaitlisted) {
          event.waitlistCount--;
        }
      }

      localStorage.setItem(
        'mockRegistrations',
        JSON.stringify(MOCK_REGISTRATIONS)
      );
      localStorage.setItem('mockEvents', JSON.stringify(MOCK_ADMIN_EVENTS));
    }

    return of({
      success: true,
      message: 'Registration cancelled successfully',
    }).pipe(delay(500));
  }
}
