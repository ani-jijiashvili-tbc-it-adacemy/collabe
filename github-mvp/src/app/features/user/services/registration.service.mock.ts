import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MyRegistrationsResponse, Registration } from '../models/registration.model';
import { MOCK_REGISTRATIONS } from '../../../../mocks/mock-registration.data';
import { MOCK_ADMIN_EVENTS } from '../../../../mocks/mock-admin-event.data';
import { AuthService } from '../../../core/service/auth';

@Injectable({
  providedIn: 'root',
})
export class RegistrationServiceMock {
  private readonly authService = inject(AuthService);

  getMyRegistrations(): Observable<MyRegistrationsResponse> {
    const userId = this.authService.user()?.id || 1;
    const now = new Date();

    const userRegistrations: Registration[] = [];

    Object.entries(MOCK_REGISTRATIONS).forEach(([eventIdStr, registrations]) => {
      const eventId = Number(eventIdStr);
      const event = MOCK_ADMIN_EVENTS.find(e => e.id === eventId);
      
      if (!event) return;

      const userReg = registrations.find(
        r => r.participant.id === userId && r.status !== 'cancelled'
      );

      if (userReg) {
        userRegistrations.push({
          id: userReg.id,
          eventId: event.id,
          eventTitle: event.title,
          eventType: event.eventType.name,
          startDateTime: event.startDateTime,
          location: event.location,
          status: userReg.status,
          registeredAt: userReg.registeredAt,
          waitlistPosition: userReg.waitlistPosition,
        });
      }
    });

    const upcoming = userRegistrations.filter(
      r => new Date(r.startDateTime) >= now
    );

    const past = userRegistrations.filter(
      r => new Date(r.startDateTime) < now
    );

    return of({
      upcoming,
      past,
    }).pipe(delay(400));
  }
}