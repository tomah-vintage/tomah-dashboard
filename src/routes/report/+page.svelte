<script lang="ts">
  import { 
    OrderReportFilters, 
    OrderReportTable, 
    OrderSummaryCards 
  } from "$lib/components/report";
  import { 
    LoadingState, 
    ErrorState
  } from "$lib/components/ui";
  import { createGetOrdersQuery } from "$lib/queries/order-queries";
  import { 
    calculateTotalRevenue,
    calculateAverageOrderValue,
    calculateTotalItems,
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
      <OrderReportTable 
        {orders} 
        {isLoading}
        {totalCount}
        currentPage={filters.page || 1}
        pageSize={filters.page_size || 20}
        onPageChange={handlePageChange}
      />
    </div>
  {/if}
</div>
