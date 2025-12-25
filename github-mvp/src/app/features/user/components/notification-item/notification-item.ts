import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-item',
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-item.html',
  styleUrl: './notification-item.scss',
})
export class NotificationItemComponent {
  readonly notification = input.required<Notification>();
  readonly markAsReadClick = output<number>();

  onMarkAsRead(id: number): void {
    this.markAsReadClick.emit(id);
  }

  getNotificationIcon(): string {
    const type = this.notification().type;
    switch (type) {
      case 'registration':
        return 'pi-calendar-plus';
      case 'reminder':
        return 'pi-bell';
      case 'update':
        return 'pi-info-circle';
      case 'cancellation':
        return 'pi-times-circle';
      case 'promotion':
        return 'pi-arrow-up';
      default:
        return 'pi-bell';
    }
  }

  getNotificationClass(): string {
    const type = this.notification().type;
    switch (type) {
      case 'registration':
        return 'notification-registration';
      case 'reminder':
        return 'notification-reminder';
      case 'update':
        return 'notification-update';
      case 'cancellation':
        return 'notification-cancellation';
      case 'promotion':
        return 'notification-promotion';
      default:
        return '';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  formatEventDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}