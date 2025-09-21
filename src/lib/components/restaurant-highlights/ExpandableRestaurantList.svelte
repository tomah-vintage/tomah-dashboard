<script lang="ts">
  import type { SimpleRestaurant } from "$lib/types/restaurant-highlight";
  import RestaurantCard from "./RestaurantCard.svelte";

  export let restaurants: SimpleRestaurant[];
  export let highlightName: string;
  export let isVisible = false;

  $: restaurantCount = restaurants?.length || 0;
</script>

{#if isVisible && restaurants && restaurants.length > 0}
  <tr class="bg-gray-50">
    <td colspan="8" class="p-4">
      <div class="ml-8">
        <div class="text-sm font-medium text-gray-700 mb-2">
          Холбогдсон рестораны жагсаалт ({restaurantCount}):
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each restaurants as restaurant (restaurant.id)}
            <RestaurantCard {restaurant} size="md" />
          {/each}
        </div>
      </div>
    </td>
  </tr>
{/if}