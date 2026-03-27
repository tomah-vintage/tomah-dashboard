<script lang="ts">
  import { CheckCircle, XCircle, Clock, Ban, ChevronLeft, ChevronRight, RotateCcw, Undo2 } from "@lucide/svelte";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import type { VatReceipt, VatReceiptsResponse } from "$lib/types/restaurant";
  import { toast } from "svelte-french-toast";

  export let data: VatReceiptsResponse | undefined = undefined;
  export let isLoading: boolean = false;
  export let statusFilter: string = "";
  export let restaurantFilter: string = "";
  export let currentPage: number = 1;
  export let retryMutation: any = undefined;
  export let returnMutation: any = undefined;
  export let onPageChange: (page: number) => void = () => {};
  export let onStatusFilterChange: (v: string) => void = () => {};
  export let onRestaurantFilterChange: (v: string) => void = () => {};

  const PAGE_SIZE = 50;

  $: receipts = data?.results ?? [];
  $: totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;
  $: retrying = $retryMutation?.isPending ?? false;
  $: returning = $returnMutation?.isPending ?? false;
  let retryingId: number | null = null;
  let returningId: number | null = null;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(amount: string): string {
    return parseFloat(amount).toLocaleString() + "₮";
  }

  function getStatusInfo(status: string) {
    switch (status.toLowerCase()) {
      case "created":
        return { color: "bg-green-50 text-green-700 border border-green-200", icon: CheckCircle, label: "Үүссэн" };
      case "failed":
        return { color: "bg-red-50 text-red-700 border border-red-200", icon: XCircle, label: "Алдаатай" };
      case "pending":
        return { color: "bg-amber-50 text-amber-700 border border-amber-200", icon: Clock, label: "Хүлээгдэж байна" };
      case "cancelled":
        return { color: "bg-gray-50 text-gray-700 border border-gray-200", icon: Ban, label: "Цуцлагдсан" };
      default:
        return { color: "bg-slate-50 text-slate-700 border border-slate-200", icon: Clock, label: status };
    }
  }

  function handleRetry(receipt: VatReceipt) {
    if (!retryMutation) return;
    retryingId = receipt.id;
    $retryMutation.mutate(receipt.id, {
      onSuccess: () => {
        toast.success(`${receipt.restaurant_name} — баримт амжилттай илгээгдлээ`);
        retryingId = null;
      },
      onError: (err: Error) => {
        toast.error(`Алдаа: ${err.message}`);
        retryingId = null;
      },
    });
  }

  function handleReturn(receipt: VatReceipt) {
    if (!returnMutation) return;
    returningId = receipt.id;
    $returnMutation.mutate(receipt.id, {
      onSuccess: () => {
        toast.success(`${receipt.restaurant_name} — буцаалт баримт амжилттай үүслээ`);
        returningId = null;
      },
      onError: (err: Error) => {
        toast.error(`Алдаа: ${err.message}`);
        returningId = null;
      },
    });
  }
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
  <!-- Filters -->
  <div class="border-b border-gray-200 px-6 py-4 flex flex-wrap gap-3 items-center">
    <h2 class="text-lg font-semibold text-gray-900 flex-1">Баримтуудын жагсаалт</h2>

    <input
      type="text"
      placeholder="Ресторан нэрээр хайх..."
      value={restaurantFilter}
      on:input={(e) => onRestaurantFilterChange(e.currentTarget.value)}
      class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
    />

    <select
      value={statusFilter}
      on:change={(e) => onStatusFilterChange(e.currentTarget.value)}
      class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Бүх төлөв</option>
      <option value="created">Үүссэн</option>
      <option value="failed">Алдаатай</option>
      <option value="pending">Хүлээгдэж байна</option>
      <option value="cancelled">Цуцлагдсан</option>
    </select>
  </div>

  <!-- Table -->
  {#if isLoading}
    <div class="flex justify-center items-center py-16">
      <CircularLoader size="md" color="indigo" />
    </div>
  {:else if receipts.length === 0}
    <div class="text-center py-16 text-gray-500">
      <p class="text-base">Баримт олдсонгүй</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ресторан</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Захиалга</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Баримт ID</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Төлөв</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Төрөл</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дүн</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Огноо</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each receipts as receipt (receipt.id)}
            {@const statusInfo = getStatusInfo(receipt.status)}
            {@const isRetrying = retryingId === receipt.id}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
                {receipt.restaurant_name}
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="text-gray-900">{receipt.order_code || `#${receipt.order_id}`}</div>
                {#if receipt.order_code}
                  <div class="text-xs text-gray-400">#{receipt.order_id}</div>
                {/if}
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="text-gray-900">{receipt.receipt_id || "—"}</div>
                {#if receipt.bill_id}
                  <div class="text-xs text-gray-400">Bill: {receipt.bill_id}</div>
                {/if}
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium {statusInfo.color}">
                  <svelte:component this={statusInfo.icon} class="w-3 h-3" />
                  {statusInfo.label}
                </span>
                {#if receipt.status.toLowerCase() === "failed" && receipt.error_message}
                  <div class="text-xs text-red-500 mt-1 max-w-xs truncate" title={receipt.error_message}>
                    {receipt.error_message}
                  </div>
                {/if}
              </td>
              <td class="px-5 py-3 whitespace-nowrap text-gray-700">{receipt.receipt_type}</td>
              <td class="px-5 py-3 whitespace-nowrap font-medium text-gray-900">
                {formatCurrency(receipt.order_total)}
              </td>
              <td class="px-5 py-3 whitespace-nowrap text-gray-600">
                {formatDate(receipt.created_at)}
              </td>
              <td class="px-5 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  {#if (receipt.status.toLowerCase() === "failed" || receipt.status.toLowerCase() === "pending") && retryMutation}
                    <button
                      on:click={() => handleRetry(receipt)}
                      disabled={isRetrying || retrying}
                      title="Серверт дахин илгээх"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {#if isRetrying}
                        <CircularLoader size="xs" color="white" />
                        Илгээж байна...
                      {:else}
                        <RotateCcw class="w-3 h-3" />
                        Илгээх
                      {/if}
                    </button>
                  {/if}
                  {#if receipt.status.toLowerCase() === "created" && !receipt.return_receipt_id && returnMutation}
                    {@const isReturning = returningId === receipt.id}
                    <button
                      on:click={() => handleReturn(receipt)}
                      disabled={isReturning || returning}
                      title="Буцаалт баримт үүсгэх"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {#if isReturning}
                        <CircularLoader size="xs" color="white" />
                        Буцааж байна...
                      {:else}
                        <Undo2 class="w-3 h-3" />
                        Буцаалт
                      {/if}
                    </button>
                  {/if}
                  {#if receipt.return_receipt_id}
                    <span class="text-xs text-amber-600 font-medium">Буцаагдсан</span>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="border-t border-gray-200 px-5 py-3 flex items-center justify-between text-sm text-gray-600">
        <span>{data?.count ?? 0} нийт баримт</span>
        <div class="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            on:click={() => onPageChange(currentPage - 1)}
            class="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            on:click={() => onPageChange(currentPage + 1)}
            class="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
