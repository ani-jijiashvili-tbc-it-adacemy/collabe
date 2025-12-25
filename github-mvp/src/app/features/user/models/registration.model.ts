export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled';

export interface Registration {
  id: number;
  eventId: number;
  eventTitle: string;
  eventType: string;
  startDateTime: string;
  location: string;
  status: RegistrationStatus;
  registeredAt: string;
  waitlistPosition?: number;
}

export interface MyRegistrationsResponse {
  upcoming: Registration[];
  past: Registration[];
}

export interface RegistrationResponse {
  success: boolean;
  status: 'confirmed' | 'waitlisted';
  message: string;
  registration: {
    id: number;
    eventId: number;
    userId: number;
    status: RegistrationStatus;
    registeredAt: string;
    waitlistPosition?: number;
  };
}

export interface CancelRegistrationResponse {
  success: boolean;
  message: string;
}