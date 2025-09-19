<script lang="ts">
  import type { ComponentType } from "svelte";

  export let title: string;
  export let value: string | number;
  export let icon: ComponentType;
  export let iconColor: string = 'blue';
  export let loading: boolean = false;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  $: iconClass = colorClasses[iconColor as keyof typeof colorClasses] || colorClasses.blue;
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4">
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <p class="text-sm font-medium text-gray-600">{title}</p>
      {#if loading}
        <div class="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
      {:else}
        <p class="text-2xl font-bold text-gray-900">{value}</p>
      {/if}
    </div>
    <div class="h-12 w-12 {iconClass} rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
      {#if loading}
        <div class="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
      {:else}
        <svelte:component this={icon} class="h-6 w-6" />
      {/if}
    </div>
  </div>
</div>