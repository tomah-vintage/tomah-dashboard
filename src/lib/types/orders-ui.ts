export interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  hasFilters: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface OrderFiltersProps {
  user: string;
  selectedStatus: string;
  selectedOrderType: string;
  selectedDateRange: string;
  isLoading: boolean;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onRefresh: () => void;
}