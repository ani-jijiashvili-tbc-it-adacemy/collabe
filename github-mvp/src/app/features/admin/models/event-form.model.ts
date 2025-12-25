import { FormControl, FormArray } from '@angular/forms';

export interface CreateEventRequest {
  title: string;
  description: string;
  eventTypeId: number;
  startDateTime: string;
  endDateTime: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  tags?: number[];
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  faqs?: FAQ[];
  notificationSettings: NotificationSettings;
}

export interface UpdateEventRequest extends CreateEventRequest {}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface Speaker {
  name: string;
  title: string;
  bio: string;
  photo?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface NotificationSettings {
  registrationConfirmation: boolean;
  reminder24h: boolean;
  reminder1h: boolean;
}

export interface EventFormGroup {
  title: FormControl<string>;
  description: FormControl<string>;
  eventTypeId: FormControl<number | null>;
  startDateTime: FormControl<string>;
  endDateTime: FormControl<string>;
  location: FormControl<string>;
  capacity: FormControl<number>;
  imageUrl: FormControl<string>;
  tags: FormControl<number[]>;
  agenda: FormArray<FormControl<AgendaItem>>;
  speakers: FormArray<FormControl<Speaker>>;
  faqs: FormArray<FormControl<FAQ>>;
  notificationSettings: FormControl<NotificationSettings>;
}

export type EventFormType = 'single' | 'recurring';

export type LocationType = 'in-person' | 'virtual' | 'hybrid';