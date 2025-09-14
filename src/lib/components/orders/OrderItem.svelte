<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { formatPrice } from "$lib/utils/formatters";
  import { formatDate } from "$lib/utils/date";
  import { getStatusColor, getStatusIcon, getStatusLabel, getOrderTypeLabel } from "$lib/utils/orders";
  import type { Order } from "$lib/types/order";

  export let order: Order;
</script>

<tr class="hover:bg-gray-50">
  <td class="px-6 py-4">
    <div class="flex flex-col space-y-1">
      <div class="text-sm font-medium text-gray-900">
        Захиалга #{String(order.id)}
      </div>
      <div class="text-xs text-gray-500">
        {order.items.length} зүйл
      </div>
      {#each order.items as item}
        <div class="text-xs text-gray-700 bg-gray-50 p-2 rounded">
          <div class="font-medium">{item.menu_item.name}</div>
          <div class="text-gray-500">
            Тоо: {item.quantity} × {formatPrice(parseFloat(item.unit_price))}
          </div>
          {#if item.menu_item.meta_data?.ingredients}
            <div class="text-gray-400 text-xs mt-1">
              {item.menu_item.meta_data.ingredients.join(", ")}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </td>
  
  <td class="px-6 py-4 whitespace-nowrap">
    <div class="flex flex-col">
      <div class="text-sm font-medium text-gray-900">
        {typeof order.user === "object" && order.user.first_name
          ? `${order.user.first_name} ${order.user.last_name}`
          : `Хэрэглэгч ID: ${order.user}`}
      </div>
      {#if typeof order.user === "object" && order.user.email}
        <div class="text-xs text-gray-500">
          {order.user.email}
        </div>
      {/if}
    </div>
  </td>
  
  <td class="px-6 py-4 whitespace-nowrap">
    <Badge class_={getStatusColor(order.order_status)}>
      <svelte:component
        this={getStatusIcon(order.order_status)}
        class="w-3 h-3 mr-1"
      />
      {getStatusLabel(order.order_status)}
    </Badge>
  </td>
  
  <td class="px-6 py-4 whitespace-nowrap">
    <div class="flex flex-col">
      <div class="text-sm text-gray-900">
        {getOrderTypeLabel(order.order_type)}
      </div>
      {#if order.table}
        <div class="text-xs text-gray-500">
          Ширээ {order.table.table_number}
        </div>
      {/if}
      {#if order.box}
        <div class="text-xs text-gray-500">
          Хайрцаг {order.box.box_number}
        </div>
      {/if}
    </div>
  </td>
  
  <td class="px-6 py-4 whitespace-nowrap">
    <div class="text-sm font-medium text-gray-900">
      {formatPrice(parseFloat(order.total_price))}
    </div>
  </td>
  
  <td class="px-6 py-4 whitespace-nowrap">
    <div class="flex flex-col">
      <div class="text-sm text-gray-900">
        {order.created_at ? formatDate(order.created_at) : "Байхгүй"}
      </div>
      <div class="text-xs text-gray-500">
        {order.created_at
          ? new Date(order.created_at).toLocaleTimeString()
          : "Огноо байхгүй"}
      </div>
    </div>
  </td>
</tr>