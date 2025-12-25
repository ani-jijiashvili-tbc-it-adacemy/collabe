import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  AnalyticsSummary,
  AnalyticsFilters,
  CategoryDistribution,
  TopEvent,
  DepartmentParticipation,
} from '../models/analytics.model';
import { MOCK_ADMIN_EVENTS } from '../../../../mocks/mock-admin-event.data';
import { MOCK_REGISTRATIONS } from '../../../../mocks/mock-registration.data';
import { AdminEventList } from '../models/admin-event.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsMock {
  getAnalytics(filters: AnalyticsFilters): Observable<AnalyticsSummary> {
    const storedEvents = localStorage.getItem('mock_events');
    let events: AdminEventList[] = storedEvents
      ? JSON.parse(storedEvents)
      : [...MOCK_ADMIN_EVENTS];

    // FILTER BY CATEGORY
    if (filters.category) {
      events = events.filter((e) => e.eventType.id === filters.category);
    }

    // FILTER BY LOCATION
    if (filters.location) {
      events = events.filter((e) => e.location.includes(filters.location!));
    }

    // SKIP DATE FILTERING - mock events have future dates

    // NOW CALCULATE WITH FILTERED EVENTS
    const totalReg = events.reduce((sum, e) => sum + e.registeredCount, 0);

    const filteredRegIds = events.map((e) => e.id);
    const allRegs = Object.entries(MOCK_REGISTRATIONS)
      .filter(([eventId]) => filteredRegIds.includes(Number(eventId)))
      .flatMap(([, regs]) => regs);

    const uniqueParticipants = new Set(
      allRegs
        .filter((r) => r.status === 'confirmed')
        .map((r) => r.participant.id)
    ).size;

    const cancelledCount = allRegs.filter(
      (r) => r.status === 'cancelled'
    ).length;
    const cancelRate =
      totalReg > 0 ? Math.round((cancelledCount / totalReg) * 100) : 0;

    const catMap = new Map<string, number>();
    events.forEach((e) => {
      const curr = catMap.get(e.eventType.name) || 0;
      catMap.set(e.eventType.name, curr + e.registeredCount);
    });

    const catDist: CategoryDistribution[] = [];
    catMap.forEach((count, cat) => {
      catDist.push({
        category: cat,
        count: count,
        percentage: totalReg > 0 ? Math.round((count / totalReg) * 100) : 0,
      });
    });

    const topEvs: TopEvent[] = events
      .slice()
      .sort(
        (a, b) =>
          b.registeredCount / b.capacity - a.registeredCount / a.capacity
      )
      .slice(0, 7)
      .map((e, i) => ({
        rank: i + 1,
        eventId: e.id,
        eventName: e.title,
        category: e.eventType.name,
        startDateTime: e.startDateTime,
        registrations: e.registeredCount,
        capacity: e.capacity,
        utilization: Math.round((e.registeredCount / e.capacity) * 100),
        waitlist: e.waitlistCount,
      }));

    const depts = [
      'Engineering',
      'Marketing',
      'Sales',
      'HR',
      'Finance',
      'Operations',
      'Product',
      'Customer Success',
    ];
    const deptSizes: Record<string, number> = {
      Engineering: 120,
      Marketing: 85,
      Sales: 85,
      HR: 32,
      Finance: 45,
      Operations: 78,
      Product: 65,
      'Customer Success': 75,
    };

    const deptPart: DepartmentParticipation[] = depts.map((dept) => {
      const deptRegs = allRegs.filter((r) => r.participant.department === dept);
      const active = new Set(deptRegs.map((r) => r.participant.id)).size;
      const total = deptSizes[dept] || 50;

      return {
        department: dept,
        totalEmployees: total,
        activeParticipants: active,
        participationRate: total > 0 ? Math.round((active / total) * 100) : 0,
        totalRegistrations: deptRegs.length,
        avgEventsPerEmployee:
          active > 0 ? parseFloat((deptRegs.length / active).toFixed(1)) : 0,
        trend: ['+8%', '+12%', '+6%', '+3%'][Math.floor(Math.random() * 4)],
      };
    });

    const monthData = new Array(12).fill(0);
    events.forEach((e) => {
      const month = new Date(e.startDateTime).getMonth();
      monthData[month] += e.registeredCount;
    });

    const analytics: AnalyticsSummary = {
      kpis: {
        totalRegistrations: { value: totalReg, change: 12.5 },
        activeParticipants: { value: uniqueParticipants, change: 8.3 },
        cancellationRate: { value: cancelRate, change: -3.2 },
      },
      registrationTrend: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        currentPeriod: monthData,
        previousPeriod: monthData.map((v) => Math.max(0, v - 10)),
      },
      categoryDistribution: catDist,
      topEvents: topEvs,
      departmentParticipation: deptPart,
    };

    return of(analytics).pipe(delay(600));
  }

  private getDepartmentSize(dept: string): number {
    const sizes: Record<string, number> = {
      Engineering: 120,
      Marketing: 85,
      Sales: 85,
      HR: 32,
      Finance: 45,
      Operations: 78,
      Product: 65,
      'Customer Success': 75,
      IT: 50,
      Support: 40,
    };
    return sizes[dept] || 50;
  }

  private generateTrend(): string {
    const trends = ['+8%', '+12%', '+6%', '+3%', '+4%', '+7%', '-2%'];
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private calculateRegistrationTrend(events: AdminEventList[]) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentMonth = new Date().getMonth();
    const monthlyData: number[] = new Array(12).fill(0);

    events.forEach((event: AdminEventList) => {
      const eventMonth = new Date(event.startDateTime).getMonth();
      monthlyData[eventMonth] += event.registeredCount;
    });

    const previousData = monthlyData.map((val) =>
      Math.max(0, val - Math.floor(Math.random() * 20))
    );

    return {
      labels: months,
      currentPeriod: monthlyData,
      previousPeriod: previousData,
    };
  }
}
