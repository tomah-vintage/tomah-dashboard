<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import OrderReportTableRow from "./OrderReportTableRow.svelte";
  import type { Order } from "$lib/types/order";
  import type { OrderStatus } from "$lib/types/order";

  export let status: OrderStatus;
  export let orders: Order[];
  export let statusConfig: any;

  $: config = statusConfig[status];
</script>

<!-- Status Section Header (src/lib/components/report/OrderReportTable.svelte:213-237) -->
<tr
  class="{config.bgClass} border-t-2 {config.borderClass.replace(
    'border-l-',
    'border-t-',
  )}"
>
  <td colspan="7" class="px-6 py-4">
    <div class="flex items-center gap-3">
      <svelte:component this={config.icon} class="h-5 w-5 {config.iconClass}" />
      <h4 class="font-semibold {config.textClass}">
        {config.label}
      </h4>
      <Badge variant="outline" class_="ml-auto {config.badgeClass}">
        {orders.length} захиалга
      </Badge>
    </div>
  </td>
</tr>

<!-- Orders in this status (src/lib/components/report/OrderReportTable.svelte:239-389) -->
{#each orders as order (order.id)}
  <OrderReportTableRow {order} {statusConfig} />
{/each}
