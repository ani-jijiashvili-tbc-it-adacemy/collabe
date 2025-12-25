import { AgendaItem, FAQ, Speaker } from "./event-form.model";

export interface AdminEventList {
  id: number;
  title: string;
  description: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  status: EventStatus;
  imageUrl: string | null;
  tags: string[];
  createdBy: EventOrganizer;
  createdAt: string;
   agenda?: AgendaItem[];  
  speakers?: Speaker[];  
  faqs?: FAQ[];
}

export interface EventType {
  id: number;
  name: string;
}

export interface EventOrganizer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface EventListItem {
  id: number;
  title: string;
  description: string;
  eventType: EventType;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  status: EventStatus;
  imageUrl: string | null;
  createdBy: EventOrganizer;
  createdAt: string;
  utilizationPercentage: number;
  spotsLeft: number;
}

export type EventStatus = 'upcoming' | 'past' | 'cancelled';

export interface EventFilters {
  search?: string;
  status?: EventStatus;
  categories?: number[];
    sortOrder?: 'newest' | 'oldest'; 

  page: number;
  pageSize: number;
}

export interface EventsResponse {
  events: AdminEventList[];
  total: number;
}

export const SORT_ORDER_OPTIONS = [
  { label: 'Newest First', value: 'newest' as const },
  { label: 'Oldest First', value: 'oldest' as const }
];

export const STATUS_OPTIONS = [
  { label: 'All Status', value: 'all' as const },
  { label: 'Upcoming', value: 'upcoming' as const },
  { label: 'Past', value: 'past' as const },
  { label: 'Cancelled', value: 'cancelled' as const }
];

// export const CATEGORY_OPTIONS = [
//   { id: null, name: 'All Categories' },
//   { id: 1, name: 'Team Building' },
//   { id: 2, name: 'Workshop' },
//   { id: 3, name: 'Sports' },
//   { id: 4, name: 'Happy Friday' },
//   { id: 5, name: 'Cultural' },
//   { id: 6, name: 'Wellness' }
// ];