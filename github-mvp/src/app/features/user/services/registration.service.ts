import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { MyRegistrationsResponse } from '../models/registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMyRegistrations(): Observable<MyRegistrationsResponse> {
    return this.http.get<MyRegistrationsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.REGISTRATIONS.MY_REGISTRATIONS}`
    );
  }
}