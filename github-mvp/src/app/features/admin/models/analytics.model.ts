export interface AnalyticsSummary {
  kpis: AnalyticsKPIs;
  registrationTrend: RegistrationTrend;
  categoryDistribution: CategoryDistribution[];
  topEvents: TopEvent[];
  departmentParticipation: DepartmentParticipation[];
}

export interface AnalyticsKPIs {
  totalRegistrations: KPIValue;
  activeParticipants: KPIValue;
  cancellationRate: KPIValue;
}

export interface KPIValue {
  value: number;
  change: number;
}

export interface RegistrationTrend {
  labels: string[];
  currentPeriod: number[];
  previousPeriod: number[];
}

export interface CategoryDistribution {
  category: string;
  percentage: number;
  count: number;
}

export interface TopEvent {
  rank: number;
  eventId: number;
  eventName: string;
  category: string;
  startDateTime: string;
  registrations: number;
  capacity: number;
  utilization: number;
  waitlist: number;
}

export interface DepartmentParticipation {
  department: string;
  totalEmployees: number;
  activeParticipants: number;
  participationRate: number;
  totalRegistrations: number;
  avgEventsPerEmployee: number;
  trend: string;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  category?: number;
  location?: string;
}

export type DateRange = 'last_7_days' | 'last_30_days' | 'last_90_days';