<script lang="ts">
  import { MapPin } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import type { AdminRestaurantDetail } from "$lib/types/restaurant";

  export let restaurant: AdminRestaurantDetail;
</script>

<div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <img
        src={restaurant.logo}
        alt={restaurant.name}
        class="w-12 h-12 rounded-lg object-cover"
        on:error={(e) => {
          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23f3f4f6"/><text x="24" y="28" text-anchor="middle" fill="%236b7280" font-size="10">No Image</text></svg>';
        }}
      />
      <div>
        <h1 class="text-xl font-bold text-gray-900">{restaurant.name}</h1>
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin class="w-3 h-3 text-gray-500" />
          <span class="truncate max-w-md">{restaurant.address}</span>
        </div>
      </div>
    </div>
    {#if restaurant.highlights && restaurant.highlights.length > 0}
      <div class="flex gap-1">
        {#each restaurant.highlights.slice(0, 2) as highlight}
          <Badge variant="outline" class="text-xs" style="color: {highlight.color}; border-color: {highlight.color};">
            {highlight.display_name}
          </Badge>
        {/each}
      </div>
    {/if}
  </div>
</div>
