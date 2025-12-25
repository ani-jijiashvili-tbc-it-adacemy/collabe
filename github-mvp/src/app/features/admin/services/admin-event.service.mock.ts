import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  MOCK_ADMIN_EVENTS,
  getNextEventId,
} from '../../../../mocks/mock-admin-event.data';
import {
  AdminEventList,
  EventsResponse,
  EventFilters,
  EventType,
} from '../models/admin-event.model';
import {
  CreateEventRequest,
  UpdateEventRequest,
} from '../models/event-form.model';

let globalMockEvents: AdminEventList[] = [...MOCK_ADMIN_EVENTS];

@Injectable({
  providedIn: 'root',
})
export class AdminEventMock {
  private get mockEvents(): AdminEventList[] {
    const stored = localStorage.getItem('mock_events');
    return stored ? JSON.parse(stored) : [...MOCK_ADMIN_EVENTS];
  }

  private set mockEvents(events: AdminEventList[]) {
    localStorage.setItem('mock_events', JSON.stringify(events));
    globalMockEvents = events;
  }

  // ✅ ADD THIS METHOD
  getCategories(): Observable<EventType[]> {
    const categories: EventType[] = [
      { id: 1, name: 'Team Building' },
      { id: 2, name: 'Workshop' },
      { id: 3, name: 'Sports' },
      { id: 4, name: 'Happy Friday' },
      { id: 5, name: 'Cultural' },
      { id: 6, name: 'Wellness' }
    ];
    
    return of(categories).pipe(delay(300));
  }

  getEvents(filters: EventFilters): Observable<EventsResponse> {
    let filteredEvents = [...this.mockEvents];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filteredEvents = filteredEvents.filter(
        (event) => event.status === filters.status
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        filters.categories!.includes(event.eventType.id)
      );
    }

    filteredEvents.sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() -
        new Date(a.startDateTime).getTime()
    );

    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    return of({
      events: paginatedEvents,
      total: filteredEvents.length,
    }).pipe(delay(500));
  }

  getEventById(id: number): Observable<AdminEventList> {
    const event = this.mockEvents.find((e) => e.id === id);

    if (event) {
      return of({ ...event }).pipe(delay(300));
    }

    return throwError(() => ({
      status: 404,
      error: { error: { message: 'Event not found' } },
    })).pipe(delay(300));
  }

  createEvent(request: CreateEventRequest): Observable<AdminEventList> {
    const eventType = MOCK_ADMIN_EVENTS.find(
      (e) => e.eventType.id === request.eventTypeId
    )?.eventType || {
      id: request.eventTypeId,
      name: 'Unknown',
    };

    const newEvent: AdminEventList = {
      id: getNextEventId(),
      title: request.title,
      description: request.description,
      eventType: eventType,
      startDateTime: request.startDateTime,
      endDateTime: request.endDateTime,
      location: request.location,
      capacity: request.capacity,
      registeredCount: 0,
      waitlistCount: 0,
      status: 'upcoming',
      imageUrl: request.imageUrl || null,
      tags: [],
      createdBy: {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        phone: '+995555123457',
      },
      createdAt: new Date().toISOString(),
      agenda: request.agenda || [],
      speakers: request.speakers || [],
      faqs: request.faqs || []
    };

    this.mockEvents = [...this.mockEvents, newEvent];

    return of(newEvent).pipe(delay(800));
  }

  updateEvent(
    id: number,
    request: UpdateEventRequest
  ): Observable<AdminEventList> {
    const index = this.mockEvents.findIndex((e) => e.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 404,
        error: { error: { message: 'Event not found' } },
      })).pipe(delay(300));
    }

    const updatedEvent: AdminEventList = {
      ...this.mockEvents[index],
      title: request.title,
      description: request.description,
      startDateTime: request.startDateTime,
      endDateTime: request.endDateTime,
      location: request.location,
      capacity: request.capacity,
      imageUrl: request.imageUrl || this.mockEvents[index].imageUrl,
      agenda: request.agenda || this.mockEvents[index].agenda || [],
      speakers: request.speakers || this.mockEvents[index].speakers || [],
      faqs: request.faqs || this.mockEvents[index].faqs || []
    };

    const newEvents = [...this.mockEvents];
    newEvents[index] = updatedEvent;
    this.mockEvents = newEvents;

    return of(updatedEvent).pipe(delay(800));
  }

  deleteEvent(id: number): Observable<{ success: boolean; message: string }> {
    const index = this.mockEvents.findIndex((e) => e.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 404,
        error: { error: { message: 'Event not found' } },
      })).pipe(delay(300));
    }

    this.mockEvents = this.mockEvents.filter((e) => e.id !== id);

    return of({
      success: true,
      message: 'Event deleted successfully',
    }).pipe(delay(500));
  }
}