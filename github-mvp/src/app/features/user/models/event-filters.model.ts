export interface EventFilters {
  search?: string;
  categories?: number[];
  locations?: string[];
  dateFrom?: string;
  dateTo?: string;
  capacityAvailability?: 'available' | 'limited' | 'full';
  page: number;
  pageSize: number;
}

export const DEFAULT_EVENT_FILTERS: EventFilters = {
  page: 1,
  pageSize: 20,
};
export interface EventFilters {
  search?: string;
  categories?: number[];
  locations?: string[];
  dateFrom?: string;
  dateTo?: string;
  capacityAvailability?: 'available' | 'limited' | 'full';
  myStatus?: 'registered' | 'not-registered';
  page: number;
  pageSize: number;
}

