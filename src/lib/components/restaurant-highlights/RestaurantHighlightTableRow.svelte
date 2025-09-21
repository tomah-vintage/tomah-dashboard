<script lang="ts">
  import type { RestaurantHighlight } from "$lib/types/restaurant-highlight";
  import { ChevronDown, ChevronRight } from "@lucide/svelte";
  import { 
    getHighlightTypeLabel, 
    getHighlightTypeColor, 
    getStatusBadgeClass, 
    getStatusLabel 
  } from "$lib/utils/restaurant-highlight";
  import { formatDate } from "$lib/utils/date";
  import { createEventDispatcher } from "svelte";
  import ExpandableRestaurantList from "./ExpandableRestaurantList.svelte";
  import HighlightRowActions from "./HighlightRowActions.svelte";

  export let highlight: RestaurantHighlight;
  export let isDeleting = false;

  let showRestaurants = false;

  const dispatch = createEventDispatcher<{
    edit: RestaurantHighlight;
    delete: number;
    manageRestaurants: RestaurantHighlight;
  }>();

  function toggleRestaurants() {
    showRestaurants = !showRestaurants;
  }

  function handleEdit(event: CustomEvent<RestaurantHighlight>) {
    dispatch('edit', event.detail);
  }

  function handleDelete(event: CustomEvent<number>) {
    dispatch('delete', event.detail);
  }

  function handleManageRestaurants(event: CustomEvent<RestaurantHighlight>) {
    dispatch('manageRestaurants', event.detail);
  }

  $: hasRestaurants = highlight.restaurants && highlight.restaurants.length > 0;
</script>

<!-- Main row -->
<tr 
  class="border-b border-gray-100 hover:bg-gray-50 {hasRestaurants ? 'cursor-pointer' : ''}"
  on:click={hasRestaurants ? toggleRestaurants : undefined}
>
  <td class="p-4">
    <div class="flex items-center">
      {#if hasRestaurants}
        <div class="mr-2 flex items-center justify-center w-6">
          {#if showRestaurants}
            <ChevronDown class="w-4 h-4 text-gray-500" />
          {:else}
            <ChevronRight class="w-4 h-4 text-gray-500" />
          {/if}
        </div>
      {:else}
        <div class="w-6 mr-2"></div>
      {/if}
      <div class="flex items-center">
        <div class="font-medium text-gray-900">{highlight.name}</div>
        {#if hasRestaurants}
          <span class="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
            {highlight.restaurants.length}
          </span>
        {/if}
      </div>
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-900">
      {highlight.display_name}
    </div>
  </td>
  <td class="p-4">
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getHighlightTypeColor(highlight.highlight_type)}">
      {getHighlightTypeLabel(highlight.highlight_type)}
    </span>
  </td>
  <td class="p-4">
    <div class="flex items-center space-x-2">
      <div 
        class="w-6 h-6 rounded border border-gray-300" 
        style="background-color: {highlight.color}"
      ></div>
      <span class="text-sm text-gray-600">{highlight.color}</span>
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {highlight.icon || 'Дүрс тэмдэг байхгүй'}
    </div>
  </td>
  <td class="p-4">
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClass(highlight.is_active)}">
      {getStatusLabel(highlight.is_active)}
    </span>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {highlight.order_index}
    </div>
  </td>
  <HighlightRowActions 
    {highlight} 
    {isDeleting}
    on:edit={handleEdit}
    on:delete={handleDelete}
    on:manageRestaurants={handleManageRestaurants}
  />
</tr>

<ExpandableRestaurantList 
  restaurants={highlight.restaurants || []}
  highlightName={highlight.display_name}
  isVisible={showRestaurants}
/>