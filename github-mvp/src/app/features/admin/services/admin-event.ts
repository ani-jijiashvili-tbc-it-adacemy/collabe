import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  API_ENDPOINTS,
  API_CONFIG,
} from '../../../core/constants/api.constants';
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
import { EventApiResponse, CategoryApiResponse, EventApiItem, CreateEventApiRequest } from '../models/admin-event-api.model';
import { AdminEventAdapter } from './admin-event-adapter';

@Injectable({
  providedIn: 'root',
})
export class AdminEvent {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.BASE_URL;

  getEvents(filters: EventFilters): Observable<EventsResponse> {
    let params = new HttpParams()
      .set('Page', filters.page.toString())
      .set('PageSize', filters.pageSize.toString());

    if (filters.search) params = params.set('Search', filters.search);
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => 
        params = params.append('Categories', cat.toString())
      );
    }

    return this.http.get<EventApiResponse>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EVENTS}`,
      { params }
    ).pipe(
      map(response => AdminEventAdapter.toEventsResponse(response))
    );
  }

  getCategories(): Observable<EventType[]> {
    return this.http.get<CategoryApiResponse[]>(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.CATEGORIES}`
    ).pipe(
      map((categories: CategoryApiResponse[]) => 
        categories.map((cat: CategoryApiResponse): EventType => ({
          id: cat.id,
          name: cat.name
        }))
      )
    );
  }

  getEventById(id: number): Observable<AdminEventList> {
    return this.http.get<AdminEventList>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EVENT_BY_ID(id)}`
    );
  }

 createEvent(request: CreateEventRequest): Observable<AdminEventList> {
  const apiRequest: CreateEventApiRequest = {
    title: request.title,
    description: request.description,
    eventTypeId: request.eventTypeId,
    startDateTime: request.startDateTime,
    endDateTime: request.endDateTime,
    location: request.location,
    capacity: request.capacity,
    imageUrl: request.imageUrl,
    tags: request.tags?.map(String),
    agenda: request.agenda,
    speakers: request.speakers?.map(s => ({
      name: s.name,
      title: s.title,
      bio: s.bio,
      photoUrl: s.photo
    })),
    faqs: request.faqs
  };

  return this.http.post<EventApiItem>(
    `${this.baseUrl}${API_ENDPOINTS.ADMIN.EVENTS}`,
    apiRequest
  ).pipe(
    map(response => AdminEventAdapter.toAdminEventList(response))
  );
}

  updateEvent(
    id: number,
    request: UpdateEventRequest
  ): Observable<AdminEventList> {
    return this.http.put<AdminEventList>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EVENT_BY_ID(id)}`,
      request
    );
  }

  deleteEvent(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EVENT_BY_ID(id)}`
    );
  }
}