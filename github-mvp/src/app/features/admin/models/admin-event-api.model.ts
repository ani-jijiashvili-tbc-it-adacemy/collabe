import { AgendaItem, FAQ } from "./event-form.model";

export interface EventApiResponse {
  items: EventApiItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface EventApiItem {
  id: number;
  title: string;
  description: string;
  eventType: EventTypeApi;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  imageUrl: string;
  tags: string[];
  isFull: boolean;
  isUserRegistered: boolean;
}

export interface EventTypeApi {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  eventCount: number;
}

export interface CategoryApiResponse {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  eventCount: number;
}

export interface CreateEventApiRequest {
  title: string;
  description: string;
  eventTypeId: number;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  tags?: string[];
  agenda?: AgendaItem[];
  speakers?: SpeakerApi[];
  faqs?: FAQ[];
}

export interface SpeakerApi {
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
}