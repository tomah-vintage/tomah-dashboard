<script lang="ts">
  import { Package } from "@lucide/svelte";
  import OrderItem from "./OrderItem.svelte";
  import OrdersLoadingState from "./OrdersLoadingState.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import Pagination from "$lib/components/ui/Pagination.svelte";
  import type { Order } from "$lib/types/order";

  export let orders: Order[];
  export let isLoading: boolean = false;
  export let hasFilters: boolean = false;
  export let totalCount: number = 0;
  export let totalPages: number = 1;
  export let currentPage: number = 1;
  export let hasNext: boolean = false;
  export let hasPrevious: boolean = false;
  export let onPageChange: (page: number) => void;
</script>

{#if isLoading && orders.length === 0}
  <OrdersLoadingState />
{:else if orders.length === 0}
  <EmptyState
    icon={Package}
    title="Захиалга олдсонгүй"
    description={hasFilters
      ? "Хайлтын нөхцөлийг өөрчилнө үү"
      : "Хэрэглэгчид захиалга өгсний дараа энд харагдах болно"}
  />
{:else}
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Захиалгын дэлгэрэнгүй
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Хэрэглэгч
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Төлөв
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Төрөл ба ширээ
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Нийт дүн
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Огноо
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

    {#if totalPages > 1 || hasNext || hasPrevious}
      <Pagination
        {currentPage}
        {totalPages}
        {totalCount}
        {hasNext}
        {hasPrevious}
        {onPageChange}
      />
    {/if}
  </div>
{/if}