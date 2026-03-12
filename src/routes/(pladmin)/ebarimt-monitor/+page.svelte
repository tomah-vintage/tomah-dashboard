<script lang="ts">
  import { Receipt, RefreshCw } from "@lucide/svelte";
  import {
    createGetVatReceiptsQuery,
    createGetVatReceiptsSummaryQuery,
    createRetryVatReceiptMutation,
  } from "$lib/queries/restaurant-queries";
  import PlatformEbarimtSummary from "$lib/components/platform-ebarimt/PlatformEbarimtSummary.svelte";
  import PlatformEbarimtTable from "$lib/components/platform-ebarimt/PlatformEbarimtTable.svelte";
  import PlatformEbarimtSendReport from "$lib/components/platform-ebarimt/PlatformEbarimtSendReport.svelte";
  import { useQueryClient } from "@tanstack/svelte-query";

  const queryClient = useQueryClient();
  const retryMutation = createRetryVatReceiptMutation();

  let currentPage = 1;
  let statusFilter = "";
  let restaurantFilter = "";

  $: vatQuery = createGetVatReceiptsQuery({
    page: currentPage,
    page_size: 50,
  });

  $: summaryQuery = createGetVatReceiptsSummaryQuery();

  // For "send info" — collect all receipts to export
  $: allReceiptsQuery = createGetVatReceiptsQuery({ page: 1, page_size: 200 });

  $: receiptsData = $vatQuery.data;
  $: summary = $summaryQuery.data;
  $: isLoading = $vatQuery.isLoading;

  // Client-side filtering by status and restaurant name
  $: filteredData = (() => {
    let results = receiptsData?.results ?? [];
    if (statusFilter)
      results = results.filter((r) => r.status === statusFilter);
    if (restaurantFilter)
      results = results.filter((r) =>
        r.restaurant_name
          .toLowerCase()
          .includes(restaurantFilter.toLowerCase()),
      );
    return receiptsData
      ? { ...receiptsData, results, count: results.length }
      : undefined;
  })();

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["vat-receipts"] });
    queryClient.invalidateQueries({ queryKey: ["vat-receipts-summary"] });
  }

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function handleStatusFilterChange(v: string) {
    statusFilter = v;
    currentPage = 1;
  }

  function handleRestaurantFilterChange(v: string) {
    restaurantFilter = v;
  }
</script>

<svelte:head>
  <title>E-barimt хяналт | Qpick Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-indigo-50 rounded-lg">
            <Receipt class="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">E-barimt хяналт</h1>
            <p class="text-sm text-gray-500 mt-0.5">
              Бүх ресторануудын VAT баримтын мэдээлэл
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <PlatformEbarimtSendReport
            {summary}
            receipts={$allReceiptsQuery.data?.results ?? []}
          />
          <button
            on:click={handleRefresh}
            class="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Шинэчлэх"
          >
            <RefreshCw class="w-4 h-4" />
            Шинэчлэх
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Summary Cards -->
    <PlatformEbarimtSummary {summary} isLoading={$summaryQuery.isLoading} />

    <!-- Receipts Table -->
    <PlatformEbarimtTable
      data={filteredData}
      {isLoading}
      {statusFilter}
      {restaurantFilter}
      {currentPage}
      {retryMutation}
      onPageChange={handlePageChange}
      onStatusFilterChange={handleStatusFilterChange}
      onRestaurantFilterChange={handleRestaurantFilterChange}
    />
  </div>
</div>
