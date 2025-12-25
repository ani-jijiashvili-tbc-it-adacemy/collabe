import { RegistrationList, RegistrationStatus } from '../app/features/admin/models/registration.model';
import { MOCK_ADMIN_EVENTS } from './mock-admin-event.data';

export const MOCK_REGISTRATIONS: Record<number, RegistrationList[]> = {
  1: [ 
    {
      id: 1,
      participant: {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Engineering',
        phone: '+995555123456',
        photo: null
      },
      status: 'confirmed' as RegistrationStatus,
      registeredAt: '2024-12-10T10:30:00Z',
      cancelledAt: null
    },
    {
      id: 2,
      participant: {
        id: 3,
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        department: 'Marketing',
        phone: '+995555123458',
        photo: null
      },
      status: 'confirmed' as RegistrationStatus,
      registeredAt: '2024-12-10T11:00:00Z',
      cancelledAt: null
    },
    {
      id: 3,
      participant: {
        id: 4,
        name: 'James Brown',
        email: 'james.brown@company.com',
        department: 'Sales',
        phone: '+995555123459',
        photo: null
      },
      status: 'confirmed' as RegistrationStatus,
      registeredAt: '2024-12-11T09:15:00Z',
      cancelledAt: null
    },
    {
      id: 4,
      participant: {
        id: 5,
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        department: 'HR',
        phone: '+995555123460',
        photo: null
      },
      status: 'waitlisted' as RegistrationStatus,
      registeredAt: '2024-12-15T14:20:00Z',
      cancelledAt: null,
      waitlistPosition: 1
    },
    {
      id: 5,
      participant: {
        id: 6,
        name: 'Robert Taylor',
        email: 'robert.taylor@company.com',
        department: 'Finance',
        phone: '+995555123461',
        photo: null
      },
      status: 'waitlisted' as RegistrationStatus,
      registeredAt: '2024-12-15T15:00:00Z',
      cancelledAt: null,
      waitlistPosition: 2
    },
    {
      id: 6,
      participant: {
        id: 7,
        name: 'Maria Garcia',
        email: 'maria.garcia@company.com',
        department: 'Operations',
        phone: '+995555123462',
        photo: null
      },
      status: 'cancelled' as RegistrationStatus,
      registeredAt: '2024-12-12T10:00:00Z',
      cancelledAt: '2024-12-18T16:30:00Z'
    }
  ],

  3: [
    {
      id: 9,
      participant: {
        id: 3,
        name: 'Emma Wilson',
        email: 'emma.wilson@company.com',
        department: 'Marketing',
        phone: '+995555123458',
        photo: null
      },
      status: 'confirmed' as RegistrationStatus,
      registeredAt: '2024-12-14T09:00:00Z',
      cancelledAt: null
    }
  ]
};

export function getRegistrationsByEventId(eventId: number): RegistrationList[] {
  return MOCK_REGISTRATIONS[eventId] || [];
}

export function getNextRegistrationId(): number {
  const allRegistrations = Object.values(MOCK_REGISTRATIONS).flat();
  return allRegistrations.length > 0 
    ? Math.max(...allRegistrations.map(r => r.id)) + 1 
    : 1;
}

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
    if (MOCK_REGISTRATIONS[event.id] && MOCK_REGISTRATIONS[event.id].length > 0) {
      return;
    }

    if (!MOCK_REGISTRATIONS[event.id]) {
      MOCK_REGISTRATIONS[event.id] = [];
    }

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

const savedRegistrations = localStorage.getItem('mockRegistrations');
if (savedRegistrations) {
  try {
    const parsed = JSON.parse(savedRegistrations);
    Object.keys(MOCK_REGISTRATIONS).forEach(key => delete MOCK_REGISTRATIONS[Number(key)]);
    Object.assign(MOCK_REGISTRATIONS, parsed);
  } catch (e) {
    console.error('Error loading registrations from localStorage');
  }
} else {
  autoGenerateRegistrations();
}
