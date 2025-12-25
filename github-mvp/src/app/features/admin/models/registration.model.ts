export interface RegistrationList {
  id: number;
  participant: Participant;
  status: RegistrationStatus;
  registeredAt: string;
  cancelledAt: string | null;
  waitlistPosition?: number;
}

export interface Participant {
  id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
  photo: string | null;
}

export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled';

export type RegistrationTab = 'registered' | 'waitlist' | 'cancelled';

export interface RegistrationsResponse {
  event: {
    id: number;
    title: string;
    startDateTime: string;
    capacity: number;
    registeredCount: number;
    waitlistCount: number;
  };
  registrations: RegistrationList[];
  counts: {
    registered: number;
    waitlist: number;
    cancelled: number;
  };
  total: number;
}

export interface RegistrationFilters {
  tab: RegistrationTab;
  search?: string;
  page: number;
  pageSize: number;
}

export type WaitlistPriority = 'high' | 'medium' | 'normal';
