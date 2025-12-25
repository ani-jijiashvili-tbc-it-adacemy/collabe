import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { Analytics } from '../../services/analytics';
import { AnalyticsMock } from '../../services/analytics.service.mock';
import { 
  AnalyticsSummary, 
  AnalyticsFilters,
  DateRange 
} from '../../models/analytics.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-analytics-page',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    ChartModule,
    LoadingSpinner,
    KpiCard
  ],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.scss',
})
export class AnalyticsPage implements OnInit {
  private readonly analyticsService = environment.useMockApi
    ? inject(AnalyticsMock)
    : inject(Analytics);

  readonly analytics = signal<AnalyticsSummary | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedDateRange = signal<DateRange>('last_30_days');
  readonly selectedCategory = signal<number | null>(null);
  readonly selectedLocation = signal<string | null>(null);
  readonly selectedEventStatus = signal<string>('all');
  readonly registrationTrendView = signal<'week' | 'month' | 'year'>('month');

  readonly kpis = computed(() => this.analytics()?.kpis || null);
  readonly topEvents = computed(() => this.analytics()?.topEvents || []);
  readonly departmentParticipation = computed(() => this.analytics()?.departmentParticipation || []);
  readonly categoryDistribution = computed(() => this.analytics()?.categoryDistribution || []);

  readonly dateRangeOptions = [
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Last 90 Days', value: 'last_90_days' }
  ];

  readonly categoryOptions = signal([
    { id: null, name: 'All Categories' },
    { id: 1, name: 'Team Building' },
    { id: 2, name: 'Workshop' },
    { id: 3, name: 'Sports' },
    { id: 4, name: 'Happy Friday' },
    { id: 5, name: 'Cultural' },
    { id: 6, name: 'Wellness' }
  ]);

  readonly locationOptions = signal([
    { value: null, label: 'All Locations' },
    { value: 'Grand Conference Hall', label: 'Grand Conference Hall' },
    { value: 'Training Room B', label: 'Training Room B' },
    { value: 'Virtual Meeting', label: 'Virtual Meeting' }
  ]);

  readonly eventStatusOptions = [
    { label: 'All Events', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' }
  ];

  readonly chartColors = ['#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];

  readonly data = computed(() => {
    const trend = this.analytics()?.registrationTrend;
    if (!trend) return null;

    return {
      labels: trend.labels,
      datasets: [
        {
          label: 'Current Period',
          data: trend.currentPeriod,
          backgroundColor: '#000000',
          borderColor: '#000000',
          borderWidth: 2
        },
        {
          label: 'Previous Period',
          data: trend.previousPeriod,
          backgroundColor: '#d1d5db',
          borderColor: '#d1d5db',
          borderWidth: 2
        }
      ]
    };
  });

  readonly options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  readonly dataDestribution = computed(() => {
    const distribution = this.analytics()?.categoryDistribution;
    if (!distribution || distribution.length === 0) return null;

    return {
      labels: distribution.map(d => d.category),
      datasets: [
        {
          data: distribution.map(d => d.percentage),
          backgroundColor: this.chartColors
        }
      ]
    };
  });

  readonly optionsDestribution = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const filters: AnalyticsFilters = {
      dateRange: this.selectedDateRange(),
      category: this.selectedCategory() || undefined,
      location: this.selectedLocation() || undefined
    };

    this.analyticsService.getAnalytics(filters).subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load analytics data');
        this.isLoading.set(false);
      }
    });
  }

 onDateRangeChange(value: DateRange): void {
  this.selectedDateRange.set(value);
  this.loadAnalytics(); 
 }

  onCategoryChange(value: number | null): void {
    this.selectedCategory.set(value);
    this.loadAnalytics(); 
  }

  onLocationChange(value: string | null): void {
    this.selectedLocation.set(value);
    this.loadAnalytics();
  }

  onEventStatusChange(value: string): void {
    this.selectedEventStatus.set(value);
     this.loadAnalytics();
  }

  onApplyFilters(): void {
    this.loadAnalytics();
  }

  onTrendViewChange(view: 'week' | 'month' | 'year'): void {
    this.registrationTrendView.set(view);
  }

  onExportReport(): void {
    const csv = this.generateReportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  formatPercentage(value: number): string {
    return `${value}%`;
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  getCategoryColor(index: number): string {
    return this.chartColors[index] || '#000000';
  }

  getTrendClass(trend: string): string {
    if (trend.startsWith('+')) return 'trend-up';
    if (trend.startsWith('-')) return 'trend-down';
    return 'trend-neutral';
  }

  private generateReportCSV(): string {
    const headers = 'Metric,Value\n';
    const kpis = this.kpis();
    if (!kpis) return headers;

    const rows = [
      `Total Registrations,${kpis.totalRegistrations.value}`,
      `Active Participants,${kpis.activeParticipants.value}`,
      `Cancellation Rate,${kpis.cancellationRate.value}%`
    ].join('\n');

    return headers + rows;
  }
}