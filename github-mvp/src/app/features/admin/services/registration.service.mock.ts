import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { 
  MOCK_REGISTRATIONS, 
  getRegistrationsByEventId,
  getNextRegistrationId 
} from '../../../../mocks/mock-registration.data';
import { 
  RegistrationsResponse, 
  RegistrationFilters,
  RegistrationList
} from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationMock {
  private mockRegistrations = { ...MOCK_REGISTRATIONS };

  getRegistrations(
    eventId: number, 
    filters: RegistrationFilters
  ): Observable<RegistrationsResponse> {
    let registrations = getRegistrationsByEventId(eventId);

    registrations = registrations.filter(reg => {
      if (filters.tab === 'registered') return reg.status === 'confirmed';
      if (filters.tab === 'waitlist') return reg.status === 'waitlisted';
      if (filters.tab === 'cancelled') return reg.status === 'cancelled';
      return true;
    });

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      registrations = registrations.filter(reg =>
        reg.participant.name.toLowerCase().includes(searchLower) ||
        reg.participant.email.toLowerCase().includes(searchLower) ||
        reg.participant.department.toLowerCase().includes(searchLower)
      );
    }

    registrations.sort((a, b) => 
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );

    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    const paginatedRegistrations = registrations.slice(startIndex, endIndex);

    const allRegistrations = getRegistrationsByEventId(eventId);
    const counts = {
      registered: allRegistrations.filter(r => r.status === 'confirmed').length,
      waitlist: allRegistrations.filter(r => r.status === 'waitlisted').length,
      cancelled: allRegistrations.filter(r => r.status === 'cancelled').length
    };

    return of({
      event: {
        id: eventId,
        title: 'Mock Event',
        startDateTime: '2025-01-18T09:00:00Z',
        capacity: 150,
        registeredCount: counts.registered,
        waitlistCount: counts.waitlist
      },
      registrations: paginatedRegistrations,
      counts,
      total: registrations.length
    }).pipe(delay(400));
  }

  promoteFromWaitlist(
    eventId: number, 
    registrationId: number
  ): Observable<{ success: boolean; message: string }> {
    const registrations = this.mockRegistrations[eventId];
    
    if (!registrations) {
      return throwError(() => ({
        status: 404,
        error: { error: { message: 'Event not found' } }
      })).pipe(delay(300));
    }

    const registration = registrations.find(r => r.id === registrationId);

    if (!registration) {
      return throwError(() => ({
        status: 404,
        error: { error: { message: 'Registration not found' } }
      })).pipe(delay(300));
    }

    if (registration.status !== 'waitlisted') {
      return throwError(() => ({
        status: 400,
        error: { error: { message: 'Registration is not on waitlist' } }
      })).pipe(delay(300));
    }

    registration.status = 'confirmed';
    delete registration.waitlistPosition;

    return of({
      success: true,
      message: 'Participant promoted successfully'
    }).pipe(delay(600));
  }

  exportRegistrations(eventId: number): Observable<Blob> {
    const registrations = getRegistrationsByEventId(eventId);
    
    const headers = 'ID,Name,Email,Department,Phone,Status,Registered At\n';
    const rows = registrations.map(r =>
      `${r.id},${r.participant.name},${r.participant.email},${r.participant.department},${r.participant.phone},${r.status},${r.registeredAt}`
    ).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });

    return of(blob).pipe(delay(500));
  }
  
  deleteRegistration(
    eventId: number, 
    registrationId: number
  ): Observable<{ success: boolean; message: string }> {
    const registrations = MOCK_REGISTRATIONS[eventId];
    
    if (!registrations) {
      return throwError(() => ({ status: 404 }));
    }

    const index = registrations.findIndex(r => r.id === registrationId);
    
    if (index === -1) {
      return throwError(() => ({ status: 404 }));
    }

    registrations.splice(index, 1);
    
    localStorage.setItem('mockRegistrations', JSON.stringify(MOCK_REGISTRATIONS));

    return of({ 
      success: true, 
      message: 'Registration deleted successfully' 
    }).pipe(delay(500));
  }
}