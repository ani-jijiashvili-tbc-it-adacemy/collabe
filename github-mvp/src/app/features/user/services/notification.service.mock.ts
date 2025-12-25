import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  NotificationsResponse,
  NotificationFilter,
  Notification,
} from '../models/notification.model';

const INITIAL_MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'registration',
    title: 'Registration Confirmed',
    message: 'You have successfully registered for Annual Team Building Summit scheduled for January 18, 2025 at 09:00 AM.',
    eventId: 1,
    eventTitle: 'Annual Team Building Summit',
    eventDate: '2025-01-18T09:00:00Z',
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Event Reminder - 24 Hours',
    message: 'Reminder: Leadership Workshop: Effective Communication starts tomorrow at 2:00 PM. Please arrive 15 minutes early for check-in.',
    eventId: 2,
    eventTitle: 'Leadership Workshop: Effective Communication',
    eventDate: '2025-01-20T14:00:00Z',
    isRead: false,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'promotion',
    title: 'Promoted from Waitlist',
    message: 'Great news! A spot has opened up and you have been promoted from the waitlist to confirmed for Happy Friday: Game Night.',
    eventId: 3,
    eventTitle: 'Happy Friday: Game Night',
    eventDate: '2025-01-24T18:00:00Z',
    isRead: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'update',
    title: 'Event Location Changed',
    message: 'The location for Tech Talk: AI in Business Operations has been updated. Please check the event details for the new venue.',
    eventId: 4,
    eventTitle: 'Tech Talk: AI in Business Operations',
    eventDate: '2025-01-26T11:00:00Z',
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Event Starting Soon',
    message: 'Your event Wellness Wednesday: Yoga Session starts in 1 hour. Don\'t forget to bring comfortable clothing!',
    eventId: 5,
    eventTitle: 'Wellness Wednesday: Yoga Session',
    eventDate: '2025-01-29T12:00:00Z',
    isRead: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class NotificationServiceMock {
  private notifications: Notification[] = [];

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('mockNotifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading notifications from localStorage');
        this.notifications = [...INITIAL_MOCK_NOTIFICATIONS];
        this.saveNotifications();
      }
    } else {
      this.notifications = [...INITIAL_MOCK_NOTIFICATIONS];
      this.saveNotifications();
    }
  }

  private saveNotifications(): void {
    localStorage.setItem('mockNotifications', JSON.stringify(this.notifications));
  }

  getNotifications(
    filter: NotificationFilter = 'all',
    page: number = 1,
    pageSize: number = 20
  ): Observable<NotificationsResponse> {
    let filteredNotifications = [...this.notifications];

    if (filter === 'unread') {
      filteredNotifications = filteredNotifications.filter((n) => !n.isRead);
    } else if (filter === 'registrations') {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === 'registration'
      );
    } else if (filter === 'reminders') {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === 'reminder'
      );
    }

    const counts = {
      all: this.notifications.length,
      unread: this.notifications.filter((n) => !n.isRead).length,
      registrations: this.notifications.filter((n) => n.type === 'registration').length,
      reminders: this.notifications.filter((n) => n.type === 'reminder').length,
    };

    return of({
      notifications: filteredNotifications,
      counts,
    }).pipe(delay(400));
  }

  markAsRead(notificationId: number): Observable<{ success: boolean }> {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
    }
    return of({ success: true }).pipe(delay(200));
  }
}