<script lang="ts">
  import type { OrderItem } from "$lib/types/dashboard";
  import { ArrowRight } from "@lucide/svelte";

  export let orders: OrderItem[];
  export let onShowAll: (() => void) | undefined = undefined;
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-800">Захиалгын тоо</h2>
    <button
      type="button"
      class="text-primary-blue flex items-center text-sm font-medium hover:underline"
      on:click={onShowAll}
      disabled={!onShowAll}
    >
      Бүгдийг харах <ArrowRight class="w-4 h-4 ml-1" />
    </button>
  </div>
  <div class="space-y-4">
    {#each orders as order (order.id)}
      <div class="flex items-center space-x-4">
        <img
          src={order.imageUrl}
          alt={order.name}
          class="w-12 h-12 rounded-md object-cover"
        />
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800">{order.name}</h3>
          <p class="text-gray-500 text-sm">{order.restaurant}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-800">{order.orderCount}</p>
          <p class="text-gray-500 text-sm">Захиалга</p>
        </div>
      </div>
    {/each}
  </div>
</div>
