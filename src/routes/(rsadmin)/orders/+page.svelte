<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { fetchOrders } from "$lib/utils/orders";
  import { calculateTotalPages } from "$lib/utils/pagination";
  import {
    extractOrderFiltersFromUrl,
    hasActiveFilters,
    shouldFetchOnInit,
    type OrderFilterParams,
  } from "$lib/utils/url-params";
  import OrderFilters from "$lib/components/orders/OrderFilters.svelte";
  import OrderTable from "$lib/components/orders/OrderTable.svelte";
  import OrdersPageHeader from "$lib/components/orders/OrdersPageHeader.svelte";

  export let data: PageData;

  // Filter state
  let filterParams: OrderFilterParams = extractOrderFiltersFromUrl(
    $page.url.searchParams,
  );
  let {
    user,
    selectedStatus,
    selectedOrderType,
    selectedDateRange,
    currentPage,
  } = filterParams;

  // Data state
  let isLoading = false;
  let orders = data.orders.results;
  let totalCount = data.orders.count;

  // API pagination state
  let hasNext = !!data.orders.next;
  let hasPrevious = !!data.orders.previous;

  // Dynamically detect page size from initial data
  let pageSize = 10; // Default fallback
  const initialResultsLength = orders.length;

  if (initialResultsLength > 0 && (hasNext || hasPrevious)) {
    pageSize = initialResultsLength;
  } else if (initialResultsLength > 0) {
    pageSize = Math.max(initialResultsLength, totalCount);
  }

  let totalPages = calculateTotalPages(totalCount, pageSize);

  // Initialize with URL parameters on load
  let isInitialized = false;
  $: if ($page.url && !isInitialized) {
    filterParams = extractOrderFiltersFromUrl($page.url.searchParams);
    ({
      user,
      selectedStatus,
      selectedOrderType,
      selectedDateRange,
      currentPage,
    } = filterParams);

    if (shouldFetchOnInit(filterParams)) {
      handleFetchOrders();
    }
    isInitialized = true;
  }

  async function handleFetchOrders() {
    isLoading = true;
    try {
      console.log("Захиалгуудыг шүүлтүүрээр авч байна:", {
        user,
        selectedStatus,
        selectedOrderType,
        selectedDateRange,
        currentPage,
      });

      const response = await fetchOrders({
        user,
        selectedStatus,
        selectedOrderType,
        selectedDateRange,
        currentPage,
      });
      orders = (response as any).results || [];
      totalCount = (response as any).count || 0;

      // Update API pagination state
      hasNext = !!(response as any).next;
      hasPrevious = !!(response as any).previous;

      // Dynamically detect page size from API response
      const resultsLength = orders.length;

      // If we have results and there's a next page, use the current results length as page size
      // If no next page and we're on page 1, it means all data fits in one page
      if (resultsLength > 0 && (hasNext || hasPrevious)) {
        pageSize = resultsLength;
      } else if (resultsLength > 0 && currentPage === 1) {
        // All data is on first page, so page size is at least the total count
        pageSize = Math.max(resultsLength, totalCount);
      }

      totalPages = calculateTotalPages(totalCount, pageSize);
    } catch (error) {
      console.error("Захиалга авахад алдаа гарлаа:", error);
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    // Reset to page 1 when applying filters
    currentPage = 1;
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

  $: hasFilters = hasActiveFilters({
    user,
    selectedStatus,
    selectedOrderType,
    selectedDateRange,
    currentPage,
  });

  // Auto-apply filters when filter values change (debounced)
  let filterTimeout: NodeJS.Timeout;
  $: {
    if (isInitialized) {
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(() => {
        console.log(
          "Шүүлтүүрийн утгууд өөрчлөгдсөн, шүүлтүүрийг автоматаар ашиглаж байна...",
        );
        applyFilters();
      }, 500);
    }
  }
</script>

<svelte:head>
  <title>Захиалга | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <OrdersPageHeader {totalCount} {isLoading} onRefresh={handleFetchOrders} />

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
      {hasNext}
      {hasPrevious}
      onPageChange={handlePageChange}
    />
  </div>
</div>
