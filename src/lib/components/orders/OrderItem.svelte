<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { formatPrice } from "$lib/utils/formatters";
  import { formatDate } from "$lib/utils/date";
  import {
    getStatusColor,
    getStatusIcon,
    getStatusLabel,
    getOrderTypeLabel,
  } from "$lib/utils/orders";
  import type { Order, OrderUser } from "$lib/types/order";

  export let order: Order;

  $: userObj = typeof order.user === "object" ? (order.user as OrderUser) : null;

  function cabinetLabel(n: number | null | undefined): string {
    if (n == null) return "";
    return n === 1 ? "A" : n === 2 ? "B" : `${n}`;
  }
</script>

<tr class="hover:bg-gray-50">
  <td class="px-6 py-4">
    <div class="flex flex-col space-y-1">
      <div class="text-sm font-medium text-gray-900">
        Захиалга #{String(order.id)}
        {#if order.daily_order_code != null}
          <span class="text-xs text-gray-400 ml-1">· #{order.daily_order_code}</span>
        {/if}
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
    <div class="flex flex-col space-y-0.5">
      <div class="text-sm font-medium text-gray-900">
        {userObj && (userObj.first_name || userObj.last_name)
          ? `${userObj.first_name} ${userObj.last_name}`.trim()
          : `Хэрэглэгч ID: ${typeof order.user === "number" ? order.user : userObj?.id}`}
      </div>
      {#if userObj?.phone}
        <div class="text-xs font-mono text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded w-fit">
          {userObj.phone}
        </div>
      {/if}
      {#if userObj?.email}
        <div class="text-xs text-gray-400">{userObj.email}</div>
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
        <div class="text-xs text-gray-500">Ширээ {order.table.table_number}</div>
      {/if}
      {#if order.box}
        <div class="text-xs text-gray-500">Хайрцаг {order.box.box_number}</div>
      {/if}
    </div>
  </td>

  <td class="px-6 py-4 whitespace-nowrap">
    <div class="flex flex-col space-y-1">
      {#if order.container_fee && parseFloat(order.container_fee) > 0}
        <div class="text-xs text-gray-500">
          Бараа: {formatPrice(
            parseFloat(order.total_price) - parseFloat(order.container_fee),
          )}
        </div>
        <div class="text-xs text-gray-600 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Савны төлбөр: {formatPrice(parseFloat(order.container_fee))}
        </div>
      {/if}
      <div class="text-sm font-semibold text-gray-900">
        {#if order.container_fee && parseFloat(order.container_fee) > 0}
          Нийт: {formatPrice(parseFloat(order.total_price))}
        {:else}
          {formatPrice(parseFloat(order.total_price))}
        {/if}
      </div>
    </div>
  </td>

  <td class="px-6 py-4 whitespace-nowrap">
    {#if order.cabinet_no != null && order.compartment_no != null}
      <div class="flex flex-col space-y-1">
        <div class="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-md px-2 py-1 w-fit">
          <svg class="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span class="text-xs font-semibold text-purple-700">
            {cabinetLabel(order.cabinet_no)}-{order.compartment_no}
          </span>
        </div>
        {#if order.boxed_at}
          <div class="text-xs text-gray-400">
            {formatDate(order.boxed_at)}
          </div>
          <div class="text-xs text-gray-400">
            {new Date(order.boxed_at).toLocaleTimeString()}
          </div>
        {/if}
      </div>
    {:else}
      <span class="text-xs text-gray-300">—</span>
    {/if}
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
