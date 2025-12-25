import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { RegistrationFilters, RegistrationsResponse } from '../models/registration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Registration {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.BASE_URL;

  getRegistrations(
    eventId: number, 
    filters: RegistrationFilters
  ): Observable<RegistrationsResponse> {
    let params = new HttpParams()
      .set('tab', filters.tab)
      .set('page', filters.page.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<RegistrationsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.REGISTRATIONS(eventId)}`,
      { params }
    );
  }

  promoteFromWaitlist(
    eventId: number, 
    registrationId: number
  ): Observable<{
    success: boolean;
    message: string;
    registration: Registration;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      registration: Registration;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.PROMOTE_WAITLIST(eventId, registrationId)}`,
      {}
    );
  }

  exportRegistrations(eventId: number): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.EXPORT_REGISTRATIONS(eventId)}`,
      { 
        responseType: 'blob',
        observe: 'body'
      }
    );
  }
  deleteRegistration(eventId: number, registrationId: number): Observable<{ success: boolean; message: string }> {
  return this.http.delete<{ success: boolean; message: string }>(
    `${this.baseUrl}/api/admin/events/${eventId}/registrations/${registrationId}`
  );
}
  
}
