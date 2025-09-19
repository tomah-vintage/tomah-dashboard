import type { Order, OrderFilters } from '$lib/types/order';

/**
 * Formats a price number to Mongolian locale with currency symbol
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮';
}

/**
 * Formats a date string to Mongolian locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculates total revenue from an array of orders
 */
export function calculateTotalRevenue(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
}

/**
 * Calculates average order value from an array of orders
 */
export function calculateAverageOrderValue(orders: Order[]): number {
  if (orders.length === 0) return 0;
  const totalRevenue = calculateTotalRevenue(orders);
  return totalRevenue / orders.length;
}

/**
 * Calculates total number of items across all orders
 */
export function calculateTotalItems(orders: Order[]): number {
  return orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
}

/**
 * Calculates the number of items in a single order
 */
export function getOrderItemsCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculates the total value of a single order
 */
export function getOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0);
}

/**
 * Creates pagination info object
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
}

export function calculatePaginationInfo(
  totalCount: number,
  currentPage: number,
  pageSize: number
): PaginationInfo {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return {
    currentPage,
    totalPages,
    totalItems: totalCount,
    itemsPerPage: pageSize,
    startItem,
    endItem
  };
}

/**
 * Default filter values for order reports
 */
export const DEFAULT_ORDER_FILTERS: OrderFilters = {
  page: 1,
  page_size: 20
};

/**
 * Resets filters to default values
 */
export function resetOrderFilters(): OrderFilters {
  return { ...DEFAULT_ORDER_FILTERS };
}

/**
 * Applies new filters while preserving pagination defaults
 */
export function applyOrderFilters(newFilters: OrderFilters): OrderFilters {
  return { ...newFilters, page: 1 }; // Reset to first page when filters change
}