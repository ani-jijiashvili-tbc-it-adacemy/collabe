import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { 
  FormControl, 
  FormGroup, 
  FormArray,
  ReactiveFormsModule, 
  Validators,
  AbstractControl
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { EventType } from '../../models/admin-event.model';
import { 
  CreateEventRequest, 
  LocationType, 
  UpdateEventRequest,
  AgendaItem,
  Speaker,
  FAQ
} from '../../models/event-form.model';
import { AdminEvent } from '../../services/admin-event';
import { environment } from '../../../../../environments/environment';
import { AdminEventMock } from '../../services/admin-event.service.mock';
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-create-event-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    LoadingSpinner
  ],
  templateUrl: './create-event-page.html',
  styleUrl: './create-event-page.scss',
})
export class CreateEventPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminEventService = environment.useMockApi 
    ? inject(AdminEventMock)
    : inject(AdminEvent);

  readonly isEditMode = signal(false);
  readonly eventId = signal<number | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  readonly eventTypes = signal<EventType[]>([
    { id: 1, name: 'Team Building' },
    { id: 2, name: 'Workshop' },
    { id: 3, name: 'Sports' },
    { id: 4, name: 'Happy Friday' },
    { id: 5, name: 'Cultural' },
    { id: 6, name: 'Wellness' }
  ]);

  readonly locationTypes: LocationType[] = ['in-person', 'virtual', 'hybrid'];
  readonly selectedLocationType = signal<LocationType>('in-person');

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)]
    }),
    eventTypeId: new FormControl<number | null>(null, {
      validators: [Validators.required]
    }),
    startDateTime: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    endDateTime: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)]
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    capacity: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(10000)]
    }),
    imageUrl: new FormControl('', {
      nonNullable: true
    }),
    registrationDeadline: new FormControl('', {
      nonNullable: true
    }),
    venueDetails: new FormControl('', {
      nonNullable: true
    }),
    roomNumber: new FormControl('', {
      nonNullable: true
    }),
    floor: new FormControl('', {
      nonNullable: true
    }),
    additionalNotes: new FormControl('', {
      nonNullable: true
    }),
    minimumParticipants: new FormControl(0, {
      nonNullable: true
    }),
    enableWaitlist: new FormControl(true, {
      nonNullable: true
    }),
    waitlistCapacity: new FormControl(0, {
      nonNullable: true
    }),
    autoPromoteWaitlist: new FormControl(true, {
      nonNullable: true
    }),
    registrationConfirmation: new FormControl(true, {
      nonNullable: true
    }),
    reminder24h: new FormControl(true, {
      nonNullable: true
    }),
    reminder1h: new FormControl(true, {
      nonNullable: true
    }),
    eventUpdates: new FormControl(false, {
      nonNullable: true
    }),
    waitlistUpdates: new FormControl(true, {
      nonNullable: true
    }),
    agenda: new FormArray<FormGroup>([]),
    speakers: new FormArray<FormGroup>([]),
    faqs: new FormArray<FormGroup>([])
  }, {
    validators: CustomValidators.dateRange('startDateTime', 'endDateTime')
  });

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Event' : 'Create New Event'
  );

  readonly pageSubtitle = computed(() =>
    this.isEditMode()
      ? 'Update event details and settings'
      : 'Fill in the details below to create a new company event'
  );

  readonly selectedEventTypeName = computed(() => {
    const typeId = this.form.get('eventTypeId')?.value;
    if (!typeId) return 'Not selected';
    return this.eventTypes().find(t => t.id === typeId)?.name || 'Not selected';
  });

  readonly formattedStartDate = computed(() => {
    const date = this.form.get('startDateTime')?.value;
    if (!date) return 'Date not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  });

  readonly hasDateRangeError = computed(() => 
    this.form.errors?.['dateRange'] && 
    (this.form.get('startDateTime')?.touched || this.form.get('endDateTime')?.touched)
  );

  get agendaItems(): FormArray {
    return this.form.get('agenda') as FormArray;
  }

  get speakersList(): FormArray {
    return this.form.get('speakers') as FormArray;
  }

  get faqsList(): FormArray {
    return this.form.get('faqs') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.eventId.set(parseInt(id, 10));
      this.loadEvent(parseInt(id, 10));
    }
  }

  loadEvent(id: number): void {
    this.isLoading.set(true);

    this.adminEventService.getEventById(id).subscribe({
      next: (event) => {
        this.form.patchValue({
          title: event.title,
          description: event.description,
          eventTypeId: event.eventType.id,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          location: event.location,
          capacity: event.capacity,
          imageUrl: event.imageUrl || ''
        });

        if (event.agenda) {
          event.agenda.forEach(item => this.addAgendaItem(item));
        }

        if (event.speakers) {
          event.speakers.forEach(speaker => this.addSpeaker(speaker));
        }

        if (event.faqs) {
          event.faqs.forEach(faq => this.addFAQ(faq));
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load event details.');
        this.isLoading.set(false);
      }
    });
  }

  
 addAgendaItem(item?: AgendaItem): void {
  const agendaGroup = new FormGroup({
    time: new FormControl(item?.time || '', { nonNullable: true }),
    title: new FormControl(item?.title || '', { nonNullable: true }), 
    description: new FormControl(item?.description || '', { nonNullable: true })
  });

  this.agendaItems.push(agendaGroup);
}

  removeAgendaItem(index: number): void {
    this.agendaItems.removeAt(index);
  }

  addSpeaker(speaker?: Speaker): void {
  const speakerGroup = new FormGroup({
    name: new FormControl(speaker?.name || '', { nonNullable: true }),
    title: new FormControl(speaker?.title || '', { nonNullable: true }),
    bio: new FormControl(speaker?.bio || '', { nonNullable: true }),
    photo: new FormControl(speaker?.photo || '', { nonNullable: true })
  });

  this.speakersList.push(speakerGroup);
}


  removeSpeaker(index: number): void {
    this.speakersList.removeAt(index);
  }

 addFAQ(faq?: FAQ): void {
  const faqGroup = new FormGroup({
    question: new FormControl(faq?.question || '', { nonNullable: true }),
    answer: new FormControl(faq?.answer || '', { nonNullable: true })
  });

  this.faqsList.push(faqGroup);
}

  removeFAQ(index: number): void {
    this.faqsList.removeAt(index);
  }

  onLocationTypeChange(type: LocationType): void {
    this.selectedLocationType.set(type);
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.form.patchValue({ imageUrl: base64 });
      };
      
      reader.readAsDataURL(file);
    }
  }
onSubmit(): void {
  if (this.form.invalid) {
    this.markFormGroupTouched(this.form);
    this.error.set('Please fill in all required fields correctly.');
    return;
  }

  this.isSaving.set(true);
  this.error.set(null);

  const formValue = this.form.getRawValue();

  const request: CreateEventRequest = {
    title: formValue.title,
    description: formValue.description,
    eventTypeId: formValue.eventTypeId!,
    startDateTime: this.formatDateTime(formValue.startDateTime),
    endDateTime: this.formatDateTime(formValue.endDateTime),
    location: `${formValue.location}, ${formValue.city}`,
    capacity: formValue.capacity,
    imageUrl: formValue.imageUrl || undefined,
    agenda: formValue.agenda.length > 0 
      ? formValue.agenda.map(item => ({
          time: item['time'],
          title: item['title'],
          description: item['description']
        } as AgendaItem))
      : undefined,
    speakers: formValue.speakers.length > 0 
      ? formValue.speakers.map(speaker => ({
          name: speaker['name'],
          title: speaker['title'],
          bio: speaker['bio'],
          photo: speaker['photo']
        } as Speaker))
      : undefined,
    faqs: formValue.faqs.length > 0 
      ? formValue.faqs.map(faq => ({
          question: faq['question'],
          answer: faq['answer']
        } as FAQ))
      : undefined,
    notificationSettings: {
      registrationConfirmation: formValue.registrationConfirmation,
      reminder24h: formValue.reminder24h,
      reminder1h: formValue.reminder1h
    }
  };

  if (this.isEditMode() && this.eventId()) {
    this.updateEvent(this.eventId()!, request);
  } else {
    this.createEvent(request);
  }
}


  createEvent(request: CreateEventRequest): void {
    this.adminEventService.createEvent(request).subscribe({
      next: (event) => {
        this.isSaving.set(false);
        this.router.navigate(['/admin/events', event.id]);
      },
      error: () => {
        this.error.set('Failed to create event. Please try again.');
        this.isSaving.set(false);
      }
    });
  }

  updateEvent(id: number, request: UpdateEventRequest): void {
    this.adminEventService.updateEvent(id, request).subscribe({
      next: (event) => {
        this.isSaving.set(false);
        this.router.navigate(['/admin/events', event.id]);
      },
      error: () => {
        this.error.set('Failed to update event. Please try again.');
        this.isSaving.set(false);
      }
    });
  }

  onCancel(): void {
    if (this.form.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.navigateBack();
      }
    } else {
      this.navigateBack();
    }
  }

  onPreview(): void {
    alert('Preview functionality will be implemented');
  }

  navigateBack(): void {
    if (this.isEditMode() && this.eventId()) {
      this.router.navigate(['/admin/events', this.eventId()]);
    } else {
      this.router.navigate(['/admin/events']);
    }
  }

  private formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toISOString();
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;

    return 'Invalid value';
  }
}