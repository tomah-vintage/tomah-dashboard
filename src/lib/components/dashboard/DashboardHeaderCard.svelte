<script lang="ts">
  import type { DashboardHeaderCardData } from "$lib/types/dashboard";
  import { Box, History, Users } from "@lucide/svelte";
  import { formatCurrency } from "$lib/utils/menu-management";

  export let data: DashboardHeaderCardData;

  let IconComponent;
  switch (data.icon) {
    case "Box":
      IconComponent = Box;
      break;
    case "History":
      IconComponent = History;
      break;
    case "Users":
      IconComponent = Users;
      break;
    default:
      IconComponent = Box; // Default icon
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
  <div
    class="p-3 rounded-full"
    class:bg-green-100={data.isPositive}
    class:text-green-600={data.isPositive}
    class:bg-red-100={!data.isPositive}
    class:text-red-600={!data.isPositive}
  >
    <svelte:component this={IconComponent} class="w-6 h-6" />
  </div>
  <div>
    <p class="text-gray-500 text-sm">{data.title}</p>
    <h3 class="text-2xl font-bold text-gray-800 mt-1">
      {#if data.title.includes('Борлуулалт')}
        {formatCurrency(data.value)}
      {:else}
        {data.value.toLocaleString()}
      {/if}
    </h3>
  </div>
  <div
    class="ml-auto flex items-center text-sm font-semibold"
    class:text-green-600={data.isPositive}
    class:text-red-600={!data.isPositive}
  >
    {data.isPositive ? '+' : '-'}{data.percentageChange}%
    {#if data.isPositive}
      ↑
    {:else}
      ↓
    {/if}
  </div>
</div>
