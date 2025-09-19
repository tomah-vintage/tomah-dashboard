import { writable, derived } from 'svelte/store';
import { createGetOrdersQuery } from '$lib/queries/order-queries';
import {
  calculateTotalRevenue,
  calculateAverageOrderValue,
  calculateTotalItems,
  calculatePaginationInfo,
  DEFAULT_ORDER_FILTERS,
  resetOrderFilters,
  applyOrderFilters
} from '$lib/utils/order-utils';
import type { OrderFilters } from '$lib/types/order';

// Create filters store
export const orderFiltersStore = writable<OrderFilters>(DEFAULT_ORDER_FILTERS);

// Create derived query store
export const orderQueryStore = derived(orderFiltersStore, ($filters) => 
  createGetOrdersQuery($filters)
);

// Create derived data stores
export const ordersDataStore = derived(orderQueryStore, ($query) => ({
  orders: $query.data?.results || [],
  totalCount: $query.data?.count || 0,
  isLoading: $query.isLoading,
  error: $query.error
}));

// Create derived statistics stores
export const orderStatsStore = derived(ordersDataStore, ($data) => ({
  totalRevenue: calculateTotalRevenue($data.orders),
  averageOrderValue: calculateAverageOrderValue($data.orders),
  totalItems: calculateTotalItems($data.orders)
}));

// Create derived pagination store
export const orderPaginationStore = derived(
  [ordersDataStore, orderFiltersStore],
  ([$data, $filters]) => {
    const totalPages = Math.ceil($data.totalCount / ($filters.page_size || 20));
    const paginationInfo = calculatePaginationInfo(
      $data.totalCount,
      $filters.page || 1,
      $filters.page_size || 20
    );
    
    return {
      totalPages,
      paginationInfo
    };
  }
);

// Actions
export const orderReportActions = {
  updateFilters: (newFilters: OrderFilters) => {
    orderFiltersStore.set(applyOrderFilters(newFilters));
  },
  
  resetFilters: () => {
    orderFiltersStore.set(resetOrderFilters());
  },
  
  setPage: (page: number) => {
    orderFiltersStore.update(filters => ({ ...filters, page }));
  }
};