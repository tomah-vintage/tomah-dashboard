<script lang="ts">
  import { Package, User, CreditCard, Utensils, ShoppingBag } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import type { Order } from "$lib/types/order";
  import { OrderStatus, OrderType } from "$lib/types/order";

  export let order: Order;
  export let statusConfig: any;

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

  function getItemsCount(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  $: config = statusConfig[order.order_status];
</script>

<tr
  class="hover:{config.bgClass} transition-colors border-l-4 {config.borderClass} {config.bgClass} bg-opacity-30"
>
  <!-- Order Info (src/lib/components/report/OrderReportTable.svelte:244-263) -->
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

  <!-- Customer (src/lib/components/report/OrderReportTable.svelte:265-284) -->
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

  <!-- Status (src/lib/components/report/OrderReportTable.svelte:286-295) -->
  <td class="px-6 py-4 whitespace-nowrap">
    <Badge
      variant={config.variant}
      class_="flex items-center gap-1 w-fit {config.badgeClass}"
    >
      <svelte:component this={config.icon} class="h-3 w-3" />
      {config.label}
    </Badge>
  </td>

  <!-- Type (src/lib/components/report/OrderReportTable.svelte:297-320) -->
  <td class="px-6 py-4 whitespace-nowrap">
    {#if typeConfig[order.order_type]}
      {@const typeConf = typeConfig[order.order_type]}
      <div class="flex items-center gap-2 text-sm text-gray-700">
        <svelte:component this={typeConf.icon} class="h-4 w-4" />
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

  <!-- Items Count (src/lib/components/report/OrderReportTable.svelte:322-328) -->
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    <div class="flex items-center gap-1">
      <Package class="h-4 w-4 text-gray-400" />
      {getItemsCount(order)} зүйл
    </div>
  </td>

  <!-- Total Amount (src/lib/components/report/OrderReportTable.svelte:330-382) -->
  <td class="px-6 py-4 whitespace-nowrap">
    <div class="flex flex-col space-y-1">
      {#if order.container_fee && parseFloat(order.container_fee) > 0}
        <!-- Subtotal -->
        <div class="text-xs text-gray-500">
          Бараа: {formatPrice(
            (
              parseFloat(order.total_price) - parseFloat(order.container_fee)
            ).toString(),
          )}
        </div>
        <!-- Container fee -->
        <div class="text-xs text-gray-600 flex items-center gap-1">
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          Савны төлбөр: {formatPrice(order.container_fee)}
        </div>
      {/if}
      <!-- Total -->
      <div class="text-sm font-medium text-gray-900">
        {#if order.container_fee && parseFloat(order.container_fee) > 0}
          Нийт: {formatPrice(order.total_price)}
        {:else}
          {formatPrice(order.total_price)}
        {/if}
      </div>
      {#if order.payments && order.payments.length > 0}
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <CreditCard class="h-3 w-3" />
          {order.payments[0].status === "COMPLETED" ? "Төлөгдсөн" : "Төлөгдөөгүй"}
        </div>
      {/if}
    </div>
  </td>

  <!-- Date (src/lib/components/report/OrderReportTable.svelte:384-387) -->
  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {formatDate(order.created_at)}
  </td>
</tr>
