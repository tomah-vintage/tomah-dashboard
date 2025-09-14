<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { RefreshCw } from "@lucide/svelte";
  import { fetchOrders } from "$lib/utils/orders";
  import OrderFilters from "$lib/components/orders/OrderFilters.svelte";
  import OrderTable from "$lib/components/orders/OrderTable.svelte";

  export let data: PageData;

  // Filter state
  let user = $page.url.searchParams.get("user") || "";
  let selectedStatus = $page.url.searchParams.get("order_status") || "";
  let selectedOrderType = $page.url.searchParams.get("order_type") || "";
  let selectedDateRange = $page.url.searchParams.get("date_range") || "";
  let currentPage = parseInt($page.url.searchParams.get("page") || "1");

  // Data state
  let isLoading = false;
  let orders = data.orders.results;
  let totalCount = data.orders.count;
  let totalPages = Math.ceil(totalCount / 20);

  // Initialize with URL parameters on load
  let isInitialized = false;
  $: if ($page.url && !isInitialized) {
    const urlUser = $page.url.searchParams.get("user") || "";
    const urlSelectedStatus = $page.url.searchParams.get("order_status") || "";
    const urlSelectedOrderType = $page.url.searchParams.get("order_type") || "";
    const urlSelectedDateRange = $page.url.searchParams.get("date_range") || "";
    const urlCurrentPage = parseInt($page.url.searchParams.get("page") || "1");

    user = urlUser;
    selectedStatus = urlSelectedStatus;
    selectedOrderType = urlSelectedOrderType;
    selectedDateRange = urlSelectedDateRange;
    currentPage = urlCurrentPage;

    if (urlUser || urlSelectedStatus || urlSelectedOrderType || urlSelectedDateRange || urlCurrentPage > 1) {
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
      totalPages = Math.ceil(totalCount / 20);
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

  $: hasFilters = !!(user || selectedStatus || selectedOrderType || selectedDateRange);
</script>

<svelte:head>
  <title>Захиалга | Tomah Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Захиалгын удирдлага</h1>
          <p class="mt-1 text-sm text-gray-500">
            Ресторанлын бүх захиалгыг харах, удирдах
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Нийт захиалга: {totalCount}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            on:click={handleFetchOrders}
            disabled={isLoading}
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            Шинэчлэх
          </Button>
        </div>
      </div>
    </div>
  </div>

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