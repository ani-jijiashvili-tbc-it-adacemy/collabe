import { MOCK_ADMIN_EVENTS } from './mock-admin-event.data';
import { MOCK_REGISTRATIONS, getNextRegistrationId } from './mock-registration.data';
import { RegistrationList, RegistrationStatus } from '../app/features/admin/models/registration.model';

export function autoGenerateRegistrations() {
  let currentId = getNextRegistrationId();

  const departments = [
    'Engineering','HR','Finance','Marketing',
    'Sales','Operations','Support','IT','Product'
  ];

  const sampleNames = [
    'Nika Beridze','Ana Gelashvili','Giorgi Mchedlidze','Luka Maisuradze',
    'Mariam Kapanadze','Emma Wilson','Sarah Johnson',
    'James Brown','Maria Garcia','Kevin Davis'
  ];

  function pick<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  MOCK_ADMIN_EVENTS.forEach(event => {
    if (MOCK_REGISTRATIONS[event.id]?.length) return;

    const list: RegistrationList[] = [];

    const confirmed = event.registeredCount;
    const waitlisted = event.waitlistCount;

    for (let i = 0; i < confirmed; i++) {
      const name = pick(sampleNames);
      list.push({
        id: currentId++,
        participant: {
          id: currentId,
          name,
          email: name.toLowerCase().replace(/[^a-z]/g,'.') + '@company.com',
          department: pick(departments),
          phone: '+995555' + Math.floor(Math.random() * 900000 + 100000),
          photo: null
        },
        status: 'confirmed' as RegistrationStatus,
        registeredAt: '2024-12-12T10:00:00Z',
        cancelledAt: null
      });
    }

    for (let i = 0; i < waitlisted; i++) {
      const name = pick(sampleNames);
      list.push({
        id: currentId++,
        participant: {
          id: currentId,
          name,
          email: name.toLowerCase().replace(/[^a-z]/g,'.') + '@company.com',
          department: pick(departments),
          phone: '+995555' + Math.floor(Math.random() * 900000 + 100000),
          photo: null
        },
        status: 'waitlisted' as RegistrationStatus,
        registeredAt: '2024-12-15T12:00:00Z',
        cancelledAt: null,
        waitlistPosition: i + 1
      });
    }

    MOCK_REGISTRATIONS[event.id] = list;
  });
}

autoGenerateRegistrations();