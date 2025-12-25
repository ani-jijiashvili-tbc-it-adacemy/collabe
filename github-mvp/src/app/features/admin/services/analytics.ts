import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { AnalyticsFilters, AnalyticsSummary } from '../models/analytics.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Analytics {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.BASE_URL;

  getAnalytics(filters: AnalyticsFilters): Observable<AnalyticsSummary> {
    let params = new HttpParams().set('dateRange', filters.dateRange);

    if (filters.category) {
      params = params.set('category', filters.category.toString());
    }

    if (filters.location) {
      params = params.set('location', filters.location);
    }

    return this.http.get<AnalyticsSummary>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.ANALYTICS}`,
      { params }
    );
  }
}