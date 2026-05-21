export interface OrderFilterParams {
  user: string;
  phone: string;
  selectedStatus: string;
  selectedOrderType: string;
  selectedDateRange: string;
  currentPage: number;
}

export function extractOrderFiltersFromUrl(searchParams: URLSearchParams): OrderFilterParams {
  return {
    user: searchParams.get("user") || "",
    phone: searchParams.get("phone") || "",
    selectedStatus: searchParams.get("order_status") || "",
    selectedOrderType: searchParams.get("order_type") || "",
    selectedDateRange: searchParams.get("date_range") || "",
    currentPage: parseInt(searchParams.get("page") || "1"),
  };
}

export function hasActiveFilters(params: OrderFilterParams): boolean {
  return !!(params.user || params.phone || params.selectedStatus || params.selectedOrderType || params.selectedDateRange);
}

export function shouldFetchOnInit(params: OrderFilterParams): boolean {
  return hasActiveFilters(params) || params.currentPage > 1;
}