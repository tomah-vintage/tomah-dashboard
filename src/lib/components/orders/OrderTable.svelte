<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { RefreshCw, Package } from "@lucide/svelte";
  import OrderItem from "./OrderItem.svelte";
  import type { Order } from "$lib/types/order";

  export let orders: Order[];
  export let isLoading: boolean = false;
  export let hasFilters: boolean = false;
  export let totalCount: number = 0;
  export let totalPages: number = 1;
  export let currentPage: number = 1;
  export let onPageChange: (page: number) => void;
</script>

{#if isLoading && orders.length === 0}
  <div class="flex justify-center items-center py-12">
    <RefreshCw class="w-6 h-6 animate-spin mr-2" />
    <span>Loading orders...</span>
  </div>
{:else if orders.length === 0}
  <div class="text-center py-12">
    <Package class="w-16 h-16 mx-auto text-gray-300 mb-4" />
    <h3 class="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
    <p class="text-gray-500">
      {hasFilters
        ? "Try adjusting your filters"
        : "Orders will appear here once customers start placing them"}
    </p>
  </div>
{:else}
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type & Table
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each orders as order (order.id)}
            <OrderItem {order} />
          {/each}
        </tbody>
      </table>
    </div>

    {#if totalPages > 1}
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalCount} total orders)
          </div>
          <div class="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              on:click={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>
            {#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.max(1, currentPage - 2) + i).filter((p) => p <= totalPages) as pageNum}
              <Button
                variant={pageNum === currentPage ? "primary" : "secondary"}
                size="sm"
                on:click={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            {/each}
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              on:click={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}