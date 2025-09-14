<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { RefreshCw } from "@lucide/svelte";
  import { fetchOrders } from "$lib/utils/orders";
  import OrderFilters from "$lib/components/orders/OrderFilters.svelte";
  import OrderTable from "$lib/components/orders/OrderTable.svelte";

  export let data: PageData;

  // Filter state
  let searchTerm = $page.url.searchParams.get("search") || "";
  let selectedStatus = $page.url.searchParams.get("status") || "";
  let selectedOrderType = $page.url.searchParams.get("order_type") || "";
  let currentPage = parseInt($page.url.searchParams.get("page") || "1");

  // Data state
  let isLoading = false;
  let orders = data.orders.results;
  let totalCount = data.orders.count;
  let totalPages = Math.ceil(totalCount / 20);

  // Initialize with URL parameters on load
  let isInitialized = false;
  $: if ($page.url && !isInitialized) {
    const urlSearchTerm = $page.url.searchParams.get("search") || "";
    const urlSelectedStatus = $page.url.searchParams.get("status") || "";
    const urlSelectedOrderType = $page.url.searchParams.get("order_type") || "";
    const urlCurrentPage = parseInt($page.url.searchParams.get("page") || "1");

    searchTerm = urlSearchTerm;
    selectedStatus = urlSelectedStatus;
    selectedOrderType = urlSelectedOrderType;
    currentPage = urlCurrentPage;

    if (urlSearchTerm || urlSelectedStatus || urlSelectedOrderType || urlCurrentPage > 1) {
      handleFetchOrders();
    }
    isInitialized = true;
  }


  async function handleFetchOrders() {
    isLoading = true;
    try {
      const data = await fetchOrders({
        searchTerm,
        selectedStatus,
        selectedOrderType,
        currentPage,
      });
      orders = data.results || [];
      totalCount = data.count || 0;
      totalPages = Math.ceil(totalCount / 20);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedStatus) params.set("status", selectedStatus);
    if (selectedOrderType) params.set("order_type", selectedOrderType);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const url = `/orders${params.toString() ? "?" + params.toString() : ""}`;
    handleFetchOrders();
    goto(url, { noScroll: true });
  }

  function resetFilters() {
    searchTerm = "";
    selectedStatus = "";
    selectedOrderType = "";
    currentPage = 1;
    goto("/orders");
    handleFetchOrders();
  }

  function handlePageChange(page: number) {
    currentPage = page;
    applyFilters();
  }

  $: hasFilters = !!(searchTerm || selectedStatus || selectedOrderType);
</script>

<svelte:head>
  <title>Orders | Tomah Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p class="mt-1 text-sm text-gray-500">
            View and manage all restaurant orders
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Total orders: {totalCount}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            on:click={handleFetchOrders}
            disabled={isLoading}
          >
            <RefreshCw class="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Filters Section -->
  <OrderFilters
    bind:searchTerm
    bind:selectedStatus
    bind:selectedOrderType
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