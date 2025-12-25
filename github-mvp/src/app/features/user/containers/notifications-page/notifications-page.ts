import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationServiceMock } from '../../services/notification.service.mock';
import { environment } from '../../../../../environments/environment';
import { Notification, NotificationFilter } from '../../models/notification.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { NotificationItemComponent } from '../../components/notification-item/notification-item';

@Component({
  selector: 'app-notifications-page',
  imports: [
    CommonModule,
    LoadingSpinner,
    NotificationItemComponent,
  ],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.scss',
})
export class NotificationsPageComponent implements OnInit {
  private readonly notificationService = environment.useMockApi
    ? inject(NotificationServiceMock)
    : inject(NotificationService);

  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal(true);
  readonly activeFilter = signal<NotificationFilter>('all');
  readonly counts = signal({
    all: 0,
    unread: 0,
    registrations: 0,
    reminders: 0,
  });

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getNotifications(this.activeFilter()).subscribe({
      next: (response) => {
        this.notifications.set(response.notifications);
        this.counts.set(response.counts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading.set(false);
      },
    });
  }

  setFilter(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
    this.loadNotifications();
  }

  onMarkAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      },
    });
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications().filter(n => !n.isRead);
    
    unreadNotifications.forEach(notification => {
      this.notificationService.markAsRead(notification.id).subscribe();
    });

    setTimeout(() => {
      this.loadNotifications();
    }, 500);
  }
}