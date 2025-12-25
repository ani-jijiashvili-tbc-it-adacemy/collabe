import { AnalyticsSummary } from '../app/features/admin/models/analytics.model';

export const MOCK_ANALYTICS: AnalyticsSummary = {
  kpis: {
    totalRegistrations: {
      value: 847,
      change: 12.5
    },
    activeParticipants: {
      value: 342,
      change: 8.3
    },
    cancellationRate: {
      value: 12,
      change: -3.2
    }
  },
  registrationTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    currentPeriod: [45, 52, 61, 58, 72, 68, 89, 76, 85, 92, 78, 85],
    previousPeriod: [38, 45, 52, 48, 65, 58, 72, 68, 75, 82, 70, 76]
  },
  categoryDistribution: [
    { category: 'Team Building', percentage: 30, count: 254 },
    { category: 'Workshops', percentage: 20, count: 169 },
    { category: 'Sports', percentage: 15, count: 127 },
    { category: 'Happy Friday', percentage: 12.5, count: 106 },
    { category: 'Cultural', percentage: 10, count: 85 },
    { category: 'Wellness', percentage: 12.5, count: 106 }
  ],
  topEvents: [
    {
      rank: 1,
      eventId: 1,
      eventName: 'Annual Team Building Summit',
      category: 'Team Building',
      startDateTime: '2025-01-18T09:00:00Z',
      registrations: 142,
      capacity: 150,
      utilization: 95,
      waitlist: 24
    },
    {
      rank: 2,
      eventId: 8,
      eventName: 'Innovation Hackathon 2025',
      category: 'Workshop',
      startDateTime: '2025-03-10T09:00:00Z',
      registrations: 156,
      capacity: 180,
      utilization: 87,
      waitlist: 18
    },
    {
      rank: 3,
      eventId: 5,
      eventName: 'Wellness Wednesday: Yoga Session',
      category: 'Wellness',
      startDateTime: '2025-01-29T12:00:00Z',
      registrations: 87,
      capacity: 100,
      utilization: 87,
      waitlist: 15
    },
    {
      rank: 4,
      eventId: 3,
      eventName: 'Happy Friday: Game Night',
      category: 'Happy Friday',
      startDateTime: '2025-01-24T18:00:00Z',
      registrations: 50,
      capacity: 50,
      utilization: 100,
      waitlist: 12
    },
    {
      rank: 5,
      eventId: 12,
      eventName: 'Annual Company Picnic',
      category: 'Team Building',
      startDateTime: '2025-02-15T11:00:00Z',
      registrations: 198,
      capacity: 250,
      utilization: 79,
      waitlist: 8
    },
    {
      rank: 6,
      eventId: 4,
      eventName: 'Tech Talk: AI in Business Operations',
      category: 'Workshop',
      startDateTime: '2025-01-26T11:00:00Z',
      registrations: 67,
      capacity: 100,
      utilization: 67,
      waitlist: 3
    },
    {
      rank: 7,
      eventId: 2,
      eventName: 'Leadership Workshop: Effective Communication',
      category: 'Workshop',
      startDateTime: '2025-01-20T14:00:00Z',
      registrations: 28,
      capacity: 30,
      utilization: 93,
      waitlist: 5
    }
  ],
  departmentParticipation: [
    {
      department: 'Engineering',
      totalEmployees: 120,
      activeParticipants: 89,
      participationRate: 74,
      totalRegistrations: 234,
      avgEventsPerEmployee: 2.6,
      trend: '+8%'
    },
    {
      department: 'Sales & Marketing',
      totalEmployees: 85,
      activeParticipants: 67,
      participationRate: 79,
      totalRegistrations: 186,
      avgEventsPerEmployee: 2.8,
      trend: '+12%'
    },
    {
      department: 'Human Resources',
      totalEmployees: 32,
      activeParticipants: 26,
      participationRate: 81,
      totalRegistrations: 84,
      avgEventsPerEmployee: 3.4,
      trend: '+6%'
    },
    {
      department: 'Finance',
      totalEmployees: 45,
      activeParticipants: 28,
      participationRate: 62,
      totalRegistrations: 67,
      avgEventsPerEmployee: 2.4,
      trend: '+3%'
    },
    {
      department: 'Operations',
      totalEmployees: 78,
      activeParticipants: 52,
      participationRate: 67,
      totalRegistrations: 134,
      avgEventsPerEmployee: 2.6,
      trend: '+4%'
    },
    {
      department: 'Product',
      totalEmployees: 65,
      activeParticipants: 43,
      participationRate: 66,
      totalRegistrations: 108,
      avgEventsPerEmployee: 2.5,
      trend: '+7%'
    },
    {
      department: 'Customer Success',
      totalEmployees: 75,
      activeParticipants: 35,
      participationRate: 47,
      totalRegistrations: 84,
      avgEventsPerEmployee: 1.8,
      trend: '-2%'
    }
  ]
};