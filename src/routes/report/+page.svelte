<script lang="ts">
  import { 
    OrderReportFilters, 
    OrderReportTable, 
    OrderSummaryCards 
  } from "$lib/components/report";
  import { 
    LoadingState, 
    ErrorState, 
    PaginationInfo 
  } from "$lib/components/ui";
  import { Pagination } from "$lib/components/ui/pagination";
  import { createGetOrdersQuery } from "$lib/queries/order-queries";
  import { 
    calculateTotalRevenue,
    calculateAverageOrderValue,
    calculateTotalItems,
    calculatePaginationInfo,
    DEFAULT_ORDER_FILTERS,
    resetOrderFilters,
    applyOrderFilters
  } from "$lib/utils/order-utils";
  import { exportOrdersToCSV } from "$lib/utils/csv-export";
  import type { OrderFilters } from "$lib/types/order";

  // State management
  let filters: OrderFilters = DEFAULT_ORDER_FILTERS;

  // Reactive query based on filters
  $: ordersQuery = createGetOrdersQuery(filters);
  $: orders = $ordersQuery.data?.results || [];
  $: totalCount = $ordersQuery.data?.count || 0;
  $: isLoading = $ordersQuery.isLoading;
  $: error = $ordersQuery.error;

  // Calculated statistics using utilities
  $: totalRevenue = calculateTotalRevenue(orders);
  $: averageOrderValue = calculateAverageOrderValue(orders);
  $: totalItems = calculateTotalItems(orders);

  // Pagination calculations
  $: totalPages = Math.ceil(totalCount / (filters.page_size || 20));
  $: paginationInfo = calculatePaginationInfo(
    totalCount, 
    filters.page || 1, 
    filters.page_size || 20
  );

  // Event handlers using utilities
  function handleApplyFilters(newFilters: OrderFilters) {
    filters = applyOrderFilters(newFilters);
  }

  function handleResetFilters() {
    filters = resetOrderFilters();
  }

  function handlePageChange(page: number) {
    filters = { ...filters, page };
  }
  
  function handleExport() {
    exportOrdersToCSV(orders);
  }
</script>

<svelte:head>
  <title>Тайлан | Qpick</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
  <!-- Page Header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">Захиалгын тайлан</h1>
    <p class="text-gray-600">
      Захиалгын мэдээлэл, шүүлтүүр, болон экспорт хийх боломжтой
    </p>
  </div>

  <!-- Summary Cards -->
  <OrderSummaryCards
    {orders}
    {totalCount}
    {totalRevenue}
    {averageOrderValue}
    {totalItems}
    loading={isLoading}
  />

  <!-- Filters -->
  <div class="mb-6">
    <OrderReportFilters
      bind:filters
      onApplyFilters={handleApplyFilters}
      onExport={handleExport}
      onReset={handleResetFilters}
    />
  </div>

  <!-- Content States -->
  {#if isLoading}
    <LoadingState message="Тайлан ачааллаж байна..." />
  {:else if error}
    <ErrorState message={error.message} />
  {:else}
    <!-- Orders Table -->
    <div class="mb-6">
      <OrderReportTable {orders} {isLoading} />
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <PaginationInfo {paginationInfo} />
          
          <Pagination
            currentPage={filters.page || 1}
            {totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
            page_size={filters.page_size || 20}
          />
        </div>
      </div>
    {/if}
  {/if}
</div>
