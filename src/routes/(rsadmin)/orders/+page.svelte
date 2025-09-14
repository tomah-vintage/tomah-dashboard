<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { fetchOrders } from "$lib/utils/orders";
  import { calculateTotalPages } from "$lib/utils/pagination";
  import { 
    extractOrderFiltersFromUrl, 
    hasActiveFilters, 
    shouldFetchOnInit,
    type OrderFilterParams 
  } from "$lib/utils/url-params";
  import OrderFilters from "$lib/components/orders/OrderFilters.svelte";
  import OrderTable from "$lib/components/orders/OrderTable.svelte";
  import OrdersPageHeader from "$lib/components/orders/OrdersPageHeader.svelte";

  export let data: PageData;

  // Filter state
  let filterParams: OrderFilterParams = extractOrderFiltersFromUrl($page.url.searchParams);
  let { user, selectedStatus, selectedOrderType, selectedDateRange, currentPage } = filterParams;

  // Data state
  let isLoading = false;
  let orders = data.orders.results;
  let totalCount = data.orders.count;
  let totalPages = calculateTotalPages(totalCount);

  // Initialize with URL parameters on load
  let isInitialized = false;
  $: if ($page.url && !isInitialized) {
    filterParams = extractOrderFiltersFromUrl($page.url.searchParams);
    ({ user, selectedStatus, selectedOrderType, selectedDateRange, currentPage } = filterParams);
    
    if (shouldFetchOnInit(filterParams)) {
      handleFetchOrders();
    }
    isInitialized = true;
  }


  async function handleFetchOrders() {
    isLoading = true;
    try {
      const response = await fetchOrders({
        user,
        selectedStatus,
        selectedOrderType,
        selectedDateRange,
        currentPage,
      });
      orders = (response as any).results || [];
      totalCount = (response as any).count || 0;
      totalPages = calculateTotalPages(totalCount);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    // Just fetch with current filter state, don't change URL
    handleFetchOrders();
  }

  function resetFilters() {
    user = "";
    selectedStatus = "";
    selectedOrderType = "";
    selectedDateRange = "";
    currentPage = 1;
    handleFetchOrders();
  }

  function handlePageChange(page: number) {
    currentPage = page;
    applyFilters();
  }

  $: hasFilters = hasActiveFilters({ user, selectedStatus, selectedOrderType, selectedDateRange, currentPage });
</script>

<svelte:head>
  <title>Захиалга | Tomah Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <OrdersPageHeader
    {totalCount}
    {isLoading}
    onRefresh={handleFetchOrders}
  />

  <!-- Filters Section -->
  <OrderFilters
    bind:user
    bind:selectedStatus
    bind:selectedOrderType
    bind:selectedDateRange
    {isLoading}
    onApplyFilters={applyFilters}
    onResetFilters={resetFilters}
    onRefresh={handleFetchOrders}
  />

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <OrderTable
      {orders}
      {isLoading}
      {hasFilters}
      {totalCount}
      {totalPages}
      {currentPage}
      onPageChange={handlePageChange}
    />
  </div>
</div>