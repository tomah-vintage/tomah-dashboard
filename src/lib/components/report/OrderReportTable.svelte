<script lang="ts">
  import { Check, X, Clock, Package, Utensils } from "@lucide/svelte";
  import { Pagination } from "$lib/components/ui/pagination";
  import { PaginationInfo } from "$lib/components/ui";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import OrderReportTableHeader from "./OrderReportTableHeader.svelte";
  import OrderReportTableRow from "./OrderReportTableRow.svelte";
  import OrderReportStatusSection from "./OrderReportStatusSection.svelte";
  import OrderReportEmpty from "./OrderReportEmpty.svelte";
  import type { Order } from "$lib/types/order";
  import { OrderStatus } from "$lib/types/order";

  export let orders: Order[];
  export let isLoading: boolean = false;

  // Pagination props
  export let totalCount: number = 0;
  export let currentPage: number = 1;
  export let pageSize: number = 20;
  export let onPageChange: (page: number) => void = () => {};

  // Status display configuration (src/lib/components/report/OrderReportTable.svelte:28-80)
  const statusConfig = {
    [OrderStatus.PENDING]: {
      label: "Хүлээж байна",
      variant: "outline" as const,
      icon: Clock,
      bgClass: "bg-yellow-50",
      borderClass: "border-l-yellow-400",
      textClass: "text-yellow-800",
      iconClass: "text-yellow-600",
      badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    [OrderStatus.PREPARING]: {
      label: "Бэлтгэж байна",
      variant: "default" as const,
      icon: Utensils,
      bgClass: "bg-blue-50",
      borderClass: "border-l-blue-400",
      textClass: "text-blue-800",
      iconClass: "text-blue-600",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    },
    [OrderStatus.READY]: {
      label: "Хайрцагт хийгдэж байна",
      variant: "secondary" as const,
      icon: Package,
      bgClass: "bg-orange-50",
      borderClass: "border-l-orange-400",
      textClass: "text-orange-800",
      iconClass: "text-orange-600",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
    },
    [OrderStatus.IN_BOX]: {
      label: "Хайрцагласан",
      variant: "secondary" as const,
      icon: Package,
      bgClass: "bg-purple-50",
      borderClass: "border-l-purple-400",
      textClass: "text-purple-800",
      iconClass: "text-purple-600",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
    },
    [OrderStatus.DONE]: {
      label: "Дууссан",
      variant: "outline" as const,
      icon: Check,
      bgClass: "bg-green-50",
      borderClass: "border-l-green-400",
      textClass: "text-green-800",
      iconClass: "text-green-600",
      badgeClass: "bg-green-100 text-green-800 border-green-300",
    },
    [OrderStatus.CANCELLED]: {
      label: "Цуцлагдсан",
      variant: "destructive" as const,
      icon: X,
      bgClass: "bg-red-50",
      borderClass: "border-l-red-400",
      textClass: "text-red-800",
      iconClass: "text-red-600",
      badgeClass: "bg-red-100 text-red-800 border-red-300",
    },
  };

  // Group orders by status (src/lib/components/report/OrderReportTable.svelte:114-126)
  $: ordersByStatus = Object.values(OrderStatus).reduce(
    (acc, status) => {
      const statusOrders = orders.filter(
        (order) => order.order_status === status,
      );
      if (statusOrders.length > 0) {
        acc[status] = statusOrders;
      }
      return acc;
    },
    {} as Record<OrderStatus, Order[]>,
  );

  // Status display order (src/lib/components/report/OrderReportTable.svelte:128-135)
  const statusDisplayOrder = [
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.IN_BOX,
    OrderStatus.DONE,
    OrderStatus.CANCELLED,
  ];

  // Pagination calculations (src/lib/components/report/OrderReportTable.svelte:137-146)
  $: totalPages = Math.ceil(totalCount / pageSize);
  $: paginationInfo = {
    currentPage,
    totalPages,
    totalItems: totalCount,
    pageSize,
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalCount),
  };
</script>

<div class="bg-white rounded-lg border border-gray-200">
  <!-- Table Header (src/lib/components/report/OrderReportTable.svelte:150-153) -->
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-3">
    <h3 class="text-lg font-semibold text-gray-800">Захиалгын тайлан</h3>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <CircularLoader size="md" color="primary" />
      <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
    </div>
  {:else if orders.length === 0}
    <OrderReportEmpty />
  {:else}
    <!-- Table Content (src/lib/components/report/OrderReportTable.svelte:167-394) -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <OrderReportTableHeader />
        <tbody class="bg-white">
          {#each statusDisplayOrder as status}
            {#if ordersByStatus[status]}
              <OrderReportStatusSection
                {status}
                orders={ordersByStatus[status]}
                {statusConfig}
              />
            {/if}
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination (src/lib/components/report/OrderReportTable.svelte:396-411) -->
    {#if totalPages > 1}
      <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div class="flex items-center justify-between">
          <PaginationInfo {paginationInfo} />

          <Pagination
            {currentPage}
            {totalPages}
            {onPageChange}
            totalItems={totalCount}
            page_size={pageSize}
          />
        </div>
      </div>
    {/if}
  {/if}
</div>
