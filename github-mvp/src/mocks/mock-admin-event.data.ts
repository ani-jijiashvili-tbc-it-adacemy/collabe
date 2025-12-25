import { AdminEventList, EventStatus } from '../app/features/admin/models/admin-event.model';

export const MOCK_ADMIN_EVENTS: AdminEventList[] = [
  {
    id: 1,
    title: 'Annual Team Building Summit',
    description: 'Full day of engaging activities and workshops designed to strengthen team bonds and improve collaboration across departments.',
    eventType: { id: 1, name: 'Team Building' },
    startDateTime: '2025-01-18T09:00:00Z',
    endDateTime: '2025-01-18T17:00:00Z',
    location: 'Grand Conference Hall',
    capacity: 150,
    registeredCount: 142,
    waitlistCount: 12,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event1/1200/630',
    tags: ['outdoor', 'networking', 'free-food'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 2,
    title: 'Leadership Workshop: Effective Communication',
    description: 'Interactive workshop focused on developing leadership skills through improved communication techniques and active listening.',
    eventType: { id: 2, name: 'Workshop' },
    startDateTime: '2025-01-20T14:00:00Z',
    endDateTime: '2025-01-20T17:30:00Z',
    location: 'Training Room B',
    capacity: 30,
    registeredCount: 28,
    waitlistCount: 2,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event2/1200/630',
    tags: ['learning', 'indoor'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-05T14:00:00Z'
  },
  {
    id: 3,
    title: 'Happy Friday: Game Night',
    description: 'Board games, video games, and refreshments to kick off the weekend. All skill levels welcome!',
    eventType: { id: 4, name: 'Happy Friday' },
    startDateTime: '2027-01-24T18:00:00Z',
    endDateTime: '2025-01-24T21:00:00Z',
    location: 'Recreation Lounge',
    capacity: 50,
    registeredCount: 50,
    waitlistCount: 8,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event3/1200/630',
    tags: ['indoor', 'free-food', 'networking'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-10T09:00:00Z'
  },
  {
    id: 4,
    title: 'Tech Talk: AI in Business Operations',
    description: 'Exploring AI technologies and applications. Discussion on practical implementation strategies.',
    eventType: { id: 2, name: 'Workshop' },
    startDateTime: '2025-01-26T11:00:00Z',
    endDateTime: '2025-01-26T12:30:00Z',
    location: 'Virtual Meeting',
    capacity: 100,
    registeredCount: 67,
    waitlistCount: 0,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event4/1200/630',
    tags: ['remote-friendly', 'learning'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-12T16:00:00Z'
  },
  {
    id: 5,
    title: 'Wellness Wednesday: Yoga Session',
    description: 'Relaxing yoga and meditation practice. Mats provided. All experience levels welcome.',
    eventType: { id: 6, name: 'Wellness' },
    startDateTime: '2025-01-29T12:00:00Z',
    endDateTime: '2025-01-29T13:00:00Z',
    location: 'Wellness Center',
    capacity: 25,
    registeredCount: 18,
    waitlistCount: 0,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event5/1200/630',
    tags: ['wellness', 'indoor'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-15T11:00:00Z'
  },
  {
    id: 6,
    title: 'Cultural Evening: International Food Festival',
    description: 'Celebrate diversity through cuisine. Sample dishes from around the world prepared by our talented team members.',
    eventType: { id: 5, name: 'Cultural' },
    startDateTime: '2025-02-02T17:00:00Z',
    endDateTime: '2025-02-02T20:00:00Z',
    location: 'Main Cafeteria',
    capacity: 120,
    registeredCount: 89,
    waitlistCount: 0,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event6/1200/630',
    tags: ['free-food', 'indoor', 'networking'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-18T13:00:00Z'
  },
  {
    id: 7,
    title: 'Inter-Department Basketball Tournament',
    description: 'Friendly competition between departments. Form your teams and compete for the championship trophy!',
    eventType: { id: 3, name: 'Sports' },
    startDateTime: '2025-02-08T16:00:00Z',
    endDateTime: '2025-02-08T19:00:00Z',
    location: 'Sports Complex',
    capacity: 40,
    registeredCount: 32,
    waitlistCount: 8,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event7/1200/630',
    tags: ['outdoor', 'networking'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 8,
    title: 'Innovation Hackathon 2025',
    description: '48-hour innovation challenge. Build prototypes, pitch ideas, and compete for prizes. All technical levels welcome.',
    eventType: { id: 2, name: 'Workshop' },
    startDateTime: '2025-03-10T09:00:00Z',
    endDateTime: '2025-03-12T17:00:00Z',
    location: 'Tech Hub',
    capacity: 200,
    registeredCount: 156,
    waitlistCount: 44,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event8/1200/630',
    tags: ['learning', 'networking', 'free-food'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-11-25T15:00:00Z'
  },
  {
    id: 9,
    title: 'Q4 Strategy Planning Workshop',
    description: 'Strategic planning session for Q4 objectives. Department heads and team leads required.',
    eventType: { id: 2, name: 'Workshop' },
    startDateTime: '2024-12-15T10:00:00Z',
    endDateTime: '2024-12-15T16:00:00Z',
    location: 'Conference Room A',
    capacity: 50,
    registeredCount: 45,
    waitlistCount: 0,
    status: 'past' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event9/1200/630',
    tags: ['indoor'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-11-01T12:00:00Z'
  },
  {
    id: 10,
    title: 'Holiday Celebration 2024',
    description: 'Annual holiday party and awards ceremony. Celebrate achievements and enjoy festive activities.',
    eventType: { id: 5, name: 'Cultural' },
    startDateTime: '2024-12-20T18:00:00Z',
    endDateTime: '2024-12-20T22:00:00Z',
    location: 'Grand Ballroom',
    capacity: 250,
    registeredCount: 245,
    waitlistCount: 0,
    status: 'past' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event10/1200/630',
    tags: ['indoor', 'free-food', 'networking', 'family-friendly'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-10-15T09:00:00Z'
  },
  {
    id: 11,
    title: 'Fitness Boot Camp Challenge',
    description: '4-week fitness challenge program. Weekly sessions with professional trainers.',
    eventType: { id: 6, name: 'Wellness' },
    startDateTime: '2025-02-15T07:00:00Z',
    endDateTime: '2025-02-15T08:00:00Z',
    location: 'Fitness Center',
    capacity: 35,
    registeredCount: 34,
    waitlistCount: 5,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event11/1200/630',
    tags: ['wellness', 'outdoor'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-12-22T14:00:00Z'
  },
  {
    id: 12,
    title: 'Annual Company Picnic',
    description: 'Outdoor family-friendly celebration with games, food, and activities for all ages.',
    eventType: { id: 1, name: 'Team Building' },
    startDateTime: '2025-02-15T11:00:00Z',
    endDateTime: '2025-02-15T16:00:00Z',
    location: 'Central Park',
    capacity: 250,
    registeredCount: 198,
    waitlistCount: 52,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event12/1200/630',
    tags: ['outdoor', 'free-food', 'family-friendly', 'networking'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-11-30T10:00:00Z'
  }, 
    {
    id: 13,
    title: 'Annual Company Picnic',
    description: 'Outdoor family-friendly celebration with games, food, and activities for all ages.',
    eventType: { id: 1, name: 'Team Building' },
    startDateTime: '2025-02-15T11:00:00Z',
    endDateTime: '2025-02-15T16:00:00Z',
    location: 'Central Park',
    capacity: 250,
    registeredCount: 198,
    waitlistCount: 52,
    status: 'upcoming' as EventStatus,
    imageUrl: 'https://picsum.photos/seed/event12/1200/630',
    tags: ['outdoor', 'free-food', 'family-friendly', 'networking'],
    createdBy: {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+995555123457'
    },
    createdAt: '2024-11-30T10:00:00Z'
  }

  
];

export function getNextEventId(): number {
  return Math.max(...MOCK_ADMIN_EVENTS.map(e => e.id)) + 1;
}

const savedEvents = localStorage.getItem('mockEvents');
if (savedEvents) {
  try {
    const parsed = JSON.parse(savedEvents);
    MOCK_ADMIN_EVENTS.length = 0;
    MOCK_ADMIN_EVENTS.push(...parsed);
  } catch (e) {
    console.error('Error loading events from localStorage');
  }
}