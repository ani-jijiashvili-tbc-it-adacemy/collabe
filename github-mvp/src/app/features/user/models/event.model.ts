export interface EventType {
  id: number;
  name: string;
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
  imageUrl: string | null;
  tags: string[];
  isFull: boolean;
  isUserRegistered: boolean;
}

export interface EventDetail extends EventListItem {
  organizer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  agenda: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  speakers: Array<{
    name: string;
    title: string;
    bio: string;
    photo: string | null;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  userRegistrationStatus: 'confirmed' | 'waitlisted' | null;
}

export interface EventsResponse {
  data: EventListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EventCategory {
  id: number;
  name: string;
  description: string | null;
  eventCount: number;
  icon: string;
}