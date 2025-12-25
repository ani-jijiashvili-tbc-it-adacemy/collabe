export type NotificationType = 
  | 'registration' 
  | 'reminder' 
  | 'update' 
  | 'cancellation' 
  | 'promotion';

export type NotificationFilter = 
  | 'all' 
  | 'unread' 
  | 'registrations' 
  | 'reminders';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  eventId: number | null;
  eventTitle: string | null;
  eventDate: string | null;
  isRead: boolean;
  timestamp: string;
}

export interface NotificationCounts {
  all: number;
  unread: number;
  registrations: number;
  reminders: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  counts: NotificationCounts;
}