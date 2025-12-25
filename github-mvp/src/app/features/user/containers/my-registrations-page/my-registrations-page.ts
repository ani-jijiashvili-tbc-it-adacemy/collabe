import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { RegistrationServiceMock } from '../../services/registration.service.mock';
import { EventService } from '../../services/event.service';
import { EventServiceMock } from '../../services/event.service.mock';
import { environment } from '../../../../../environments/environment';
import { Registration } from '../../models/registration.model';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { RegistrationCardComponent } from '../../components/registration-card/registration-card';

@Component({
  selector: 'app-my-registrations-page',
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinner,
    RegistrationCardComponent,
  ],
  templateUrl: './my-registrations-page.html',
  styleUrl: './my-registrations-page.scss',
})
export class MyRegistrationsPageComponent implements OnInit {
  private readonly registrationService = environment.useMockApi
    ? inject(RegistrationServiceMock)
    : inject(RegistrationService);

  private readonly eventService = environment.useMockApi
    ? inject(EventServiceMock)
    : inject(EventService);

  readonly upcomingRegistrations = signal<Registration[]>([]);
  readonly pastRegistrations = signal<Registration[]>([]);
  readonly loading = signal(true);
  readonly activeTab = signal<'upcoming' | 'past'>('upcoming');

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.loading.set(true);
    this.registrationService.getMyRegistrations().subscribe({
      next: (response) => {
        this.upcomingRegistrations.set(response.upcoming);
        this.pastRegistrations.set(response.past);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
        this.loading.set(false);
      },
    });
  }

onCancelRegistration(eventId: number): void {
  this.eventService.cancelRegistration(eventId).subscribe({
    next: () => {
      this.loadRegistrations();
    },
    error: (error) => {
      console.error('Error cancelling registration:', error);
    },
  });
}

  setActiveTab(tab: 'upcoming' | 'past'): void {
    this.activeTab.set(tab);
  }
}