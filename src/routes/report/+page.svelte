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
  <title>Тайлан | Tomah</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Захиалгын тайлан</h1>
        <p class="mt-1 text-sm text-gray-500">
          Захиалгын мэдээлэл, шүүлтүүр, болон экспорт хийх боломжтой
        </p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
      <OrderReportTable
        {orders}
        {isLoading}
        {totalCount}
        currentPage={filters.page || 1}
        pageSize={filters.page_size || 20}
        onPageChange={handlePageChange}
      />
    {/if}
  </div>
</div>
