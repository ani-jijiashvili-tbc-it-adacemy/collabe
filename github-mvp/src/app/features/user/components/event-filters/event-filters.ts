import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { EventCategory } from '../../models/event.model';
import { EventFilters } from '../../models/event-filters.model';

@Component({
  selector: 'app-event-filters',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
  ],
  templateUrl: './event-filters.html',
  styleUrl: './event-filters.scss',
})
export class EventFiltersComponent {
  readonly categories = input<EventCategory[]>([]);
  readonly locations = input<string[]>([]);

  readonly filtersChange = output<EventFilters>();

  readonly searchText = signal<string>('');
  readonly selectedCategories = signal<number[]>([]);
  readonly selectedLocations = signal<string[]>([]);
  readonly selectedCapacity = signal<string | undefined>(undefined);
  readonly selectedMyStatus = signal<string | undefined>(undefined);
  readonly dateFrom = signal<string>('');
  readonly dateTo = signal<string>('');

  readonly categoryOptions = computed(() =>
    this.categories().map((cat) => ({
      label: cat.name,
      value: cat.id,
    }))
  );

  readonly locationOptions = computed(() =>
    this.locations().map((loc) => ({
      label: loc,
      value: loc,
    }))
  );

  readonly capacityOptions = [
    { label: 'Available Spots', value: 'available' },
    { label: 'Limited Spots', value: 'limited' },
    { label: 'Full (Waitlist)', value: 'full' },
  ];

  readonly myStatusOptions = [
    { label: 'Registered', value: 'registered' },
    { label: 'Not Registered', value: 'not-registered' },
  ];

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
    this.emitFilters();
  }

  onCategoryChange(categories: number[]): void {
    this.selectedCategories.set(categories);
    this.emitFilters();
  }

  onLocationChange(locations: string[]): void {
    this.selectedLocations.set(locations);
    this.emitFilters();
  }

  onCapacityClick(value: string): void {
    this.selectedCapacity.set(value);
    this.emitFilters();
  }

  onMyStatusClick(value: string): void {
    this.selectedMyStatus.set(value);
    this.emitFilters();
  }

  onDateFromChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dateFrom.set(input.value);
    this.emitFilters();
  }

  onDateToChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dateTo.set(input.value);
    this.emitFilters();
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCategories.set([]);
    this.selectedLocations.set([]);
    this.selectedCapacity.set(undefined);
    this.selectedMyStatus.set(undefined);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.emitFilters();
  }

  private emitFilters(): void {
    const filters: EventFilters = {
      search: this.searchText() || undefined,
      categories:
        this.selectedCategories().length > 0
          ? this.selectedCategories()
          : undefined,
      locations:
        this.selectedLocations().length > 0
          ? this.selectedLocations()
          : undefined,
      capacityAvailability: this.selectedCapacity() as any,
      myStatus: this.selectedMyStatus() as any,
      dateFrom: this.dateFrom()
        ? new Date(this.dateFrom()).toISOString()
        : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()).toISOString() : undefined,
      page: 1,
      pageSize: 20,
    };

    this.filtersChange.emit(filters);
  }
}
