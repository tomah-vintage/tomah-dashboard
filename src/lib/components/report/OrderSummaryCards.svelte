<script lang="ts">
  import { BarChart3, DollarSign, TrendingUp, Package } from '@lucide/svelte';
  import SummaryCard from '$lib/components/ui/SummaryCard.svelte';
  import { formatPrice } from '$lib/utils/order-utils';
  import type { Order } from '$lib/types/order';

  export let orders: Order[];
  export let totalCount: number;
  export let totalRevenue: number;
  export let averageOrderValue: number;
  export let totalItems: number;
  export let loading: boolean = false;

  $: showCards = !loading && orders.length > 0;
</script>

{#if showCards}
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <SummaryCard
      title="Нийт захиалга"
      value={totalCount}
      icon={BarChart3}
      iconColor="blue"
      {loading}
    />

    <SummaryCard
      title="Нийт орлого"
      value={formatPrice(totalRevenue)}
      icon={DollarSign}
      iconColor="green"
      {loading}
    />

    <SummaryCard
      title="Дундаж захиалга"
      value={formatPrice(averageOrderValue)}
      icon={TrendingUp}
      iconColor="purple"
      {loading}
    />

    <SummaryCard
      title="Нийт зүйл"
      value={totalItems}
      icon={Package}
      iconColor="orange"
      {loading}
    />
  </div>
{/if}