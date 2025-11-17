<script lang="ts">
  import {
    Check,
    X,
    Clock,
    Package,
    Utensils,
    ShoppingBag,
    CreditCard,
    User,
  } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Pagination } from "$lib/components/ui/pagination";
  import { PaginationInfo } from "$lib/components/ui";
  import CircularLoader from "$lib/components/ui/CircularLoader.svelte";
  import type { Order } from "$lib/types/order";
  import { OrderStatus, OrderType } from "$lib/types/order";

  export let orders: Order[];
  export let isLoading: boolean = false;

  // Pagination props
  export let totalCount: number = 0;
  export let currentPage: number = 1;
  export let pageSize: number = 20;
  export let onPageChange: (page: number) => void = () => {};

  // Status display configuration with enhanced colors
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

  // Order type display configuration
  const typeConfig = {
    [OrderType.DINE_IN]: { label: "Газар дээр нь", icon: Utensils },
    [OrderType.TAKE_OUT]: { label: "Авч явах", icon: ShoppingBag },
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(price: string): string {
    return new Intl.NumberFormat("mn-MN").format(parseFloat(price)) + "₮";
  }

  function getOrderTotal(order: Order): number {
    return order.items.reduce(
      (sum, item) => sum + parseFloat(item.unit_price) * item.quantity,
      0,
    );
  }

  function getItemsCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Group orders by status and maintain their original order within each group
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

  // Status display order for better UX
  const statusDisplayOrder = [
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.IN_BOX,
    OrderStatus.DONE,
    OrderStatus.CANCELLED,
  ];

  // Pagination calculations
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
  <!-- Table Header -->
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-3">
    <h3 class="text-lg font-semibold text-gray-800">Захиалгын тайлан</h3>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <CircularLoader size="md" color="primary" />
      <span class="ml-3 text-gray-600">Ачааллаж байна...</span>
    </div>
  {:else if orders.length === 0}
    <div class="text-center py-12">
      <Package class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 text-lg">Захиалга олдсонгүй</p>
      <p class="text-gray-400 text-sm">Шүүлтүүрийг өөрчилж дахин оролдоно уу</p>
    </div>
  {:else}
    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Захиалга
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Үйлчлүүлэгч
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Төлөв
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Төрөл
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Зүйлийн тоо
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Нийт дүн
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Огноо
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          {#each statusDisplayOrder as status}
            {#if ordersByStatus[status]}
              {@const config = statusConfig[status]}
              <!-- Status Section Header -->
              <tr
                class="{config.bgClass} border-t-2 {config.borderClass.replace(
                  'border-l-',
                  'border-t-',
                )}"
              >
                <td colspan="7" class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <svelte:component
                      this={config.icon}
                      class="h-5 w-5 {config.iconClass}"
                    />
                    <h4 class="font-semibold {config.textClass}">
                      {config.label}
                    </h4>
                    <Badge
                      variant="outline"
                      class_="ml-auto {config.badgeClass}"
                    >
                      {ordersByStatus[status].length} захиалга
                    </Badge>
                  </div>
                </td>
              </tr>

              <!-- Orders in this status -->
              {#each ordersByStatus[status] as order (order.id)}
                <tr
                  class="hover:{config.bgClass} transition-colors border-l-4 {config.borderClass} {config.bgClass} bg-opacity-30"
                >
                  <!-- Order Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div
                          class="h-10 w-10 rounded-full bg-primary-blue/10 flex items-center justify-center"
                        >
                          <Package class="h-5 w-5 text-primary-blue" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div class="text-sm text-gray-500">
                          Ресторан #{order.restaurant}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Customer -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <User class="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          Хэрэглэгч #{order.user}
                        </div>
                        <div class="text-sm text-gray-500">
                          ID: {order.user}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={config.variant}
                      class_="flex items-center gap-1 w-fit {config.badgeClass}"
                    >
                      <svelte:component this={config.icon} class="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </td>

                  <!-- Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if typeConfig[order.order_type]}
                      {@const typeConf = typeConfig[order.order_type]}
                      <div
                        class="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <svelte:component
                          this={typeConf.icon}
                          class="h-4 w-4"
                        />
                        {typeConf.label}
                      </div>
                    {/if}
                    {#if order.table}
                      <div class="text-xs text-gray-500">
                        Ширээ #{order.table.table_number}
                      </div>
                    {:else if order.box}
                      <div class="text-xs text-gray-500">
                        Савлах #{order.box.box_number}
                      </div>
                    {/if}
                  </td>

                  <!-- Items Count -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center gap-1">
                      <Package class="h-4 w-4 text-gray-400" />
                      {getItemsCount(order)} зүйл
                    </div>
                  </td>

                  <!-- Total Amount -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {formatPrice(order.total_price)}
                    </div>
                    {#if order.payments && order.payments.length > 0}
                      <div
                        class="flex items-center gap-1 text-xs text-gray-500"
                      >
                        <CreditCard class="h-3 w-3" />
                        {order.payments[0].status === "COMPLETED"
                          ? "Төлөгдсөн"
                          : "Төлөгдөөгүй"}
                      </div>
                    {/if}
                  </td>

                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              {/each}
            {/if}
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
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
