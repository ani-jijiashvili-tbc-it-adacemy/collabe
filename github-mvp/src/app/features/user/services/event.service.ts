import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import {
  EventsResponse,
  EventDetail,
  EventCategory,
} from '../models/event.model';
import { EventFilters } from '../models/event-filters.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getEvents(filters: EventFilters): Observable<EventsResponse> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.categories && filters.categories.length > 0) {
      params = params.set('categories', filters.categories.join(','));
    }
    if (filters.locations && filters.locations.length > 0) {
      params = params.set('locations', filters.locations.join(','));
    }
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }
    if (filters.capacityAvailability) {
      params = params.set('capacityAvailability', filters.capacityAvailability);
    }

    return this.http.get<EventsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.LIST}`,
      { params }
    );
  }

  getEventById(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.BY_ID(id)}`
    );
  }

  getCategories(): Observable<{ categories: EventCategory[] }> {
    return this.http.get<{ categories: EventCategory[] }>(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.CATEGORIES}`
    );
  }

  getLocations(): Observable<{ locations: string[] }> {
    return this.http.get<{ locations: string[] }>(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.LOCATIONS}`
    );
  }

  registerForEvent(eventId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.REGISTER(eventId)}`,
      {}
    );
  }

  cancelRegistration(eventId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.EVENTS.CANCEL_REGISTRATION(eventId)}`
    );
  }
}