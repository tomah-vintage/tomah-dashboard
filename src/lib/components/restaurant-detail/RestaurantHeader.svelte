<script lang="ts">
  import { MapPin } from "@lucide/svelte";
  import type { Restaurant } from "$lib/types/restaurant";
  import RestaurantRating from "./RestaurantRating.svelte";

  export let restaurant: Restaurant & { average_rating?: number };
</script>

<div class="bg-white rounded-lg shadow p-6 mb-8">
  <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
    <img
      src={restaurant.logo || restaurant.logo_url}
      alt="{restaurant.name} logo"
      class="w-20 h-20 rounded-lg object-cover shadow-md"
    />
    <div class="flex-1">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {restaurant.name}
      </h1>
      <div class="space-y-2">
        <div class="flex items-center text-gray-600">
          <MapPin class="w-5 h-5 mr-2" />
          <span>{restaurant.address}</span>
        </div>
        <div class="flex items-center text-gray-600">
          <MapPin class="w-5 h-5 mr-2" />
          <span>Координат: {restaurant.latitude}, {restaurant.longitude}</span>
        </div>
      </div>
    </div>
    <RestaurantRating rating={restaurant.average_rating} />
  </div>
</div>