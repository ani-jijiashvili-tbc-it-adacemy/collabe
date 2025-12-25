import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import {
  NotificationsResponse,
  NotificationFilter,
} from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getNotifications(
    filter: NotificationFilter = 'all',
    page: number = 1,
    pageSize: number = 20
  ): Observable<NotificationsResponse> {
    let params = new HttpParams()
      .set('filter', filter)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<NotificationsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.LIST}`,
      { params }
    );
  }

  markAsRead(notificationId: number): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)}`,
      {}
    );
  }
}