<script lang="ts">
  import type { SimpleRestaurant } from "$lib/types/restaurant-highlight";

  export let restaurant: SimpleRestaurant;
  export let showRating = true;
  export let showImage = true;
  export let size: 'sm' | 'md' | 'lg' = 'md';

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-2',
      image: 'w-8 h-8',
      name: 'text-xs',
      rating: 'text-xs'
    },
    md: {
      container: 'p-3',
      image: 'w-10 h-10',
      name: 'text-sm',
      rating: 'text-xs'
    },
    lg: {
      container: 'p-4',
      image: 'w-12 h-12',
      name: 'text-base',
      rating: 'text-sm'
    }
  };

  $: config = sizeConfig[size];
</script>

<div class="flex items-center {config.container} bg-white rounded-lg border border-gray-200">
  {#if showImage}
    {#if restaurant.restaurant_img_urls?.length > 0}
      <img 
        src={restaurant.restaurant_img_urls[0]} 
        alt={restaurant.name}
        class="{config.image} rounded-lg mr-3 object-cover"
      />
    {:else}
      <div class="{config.image} rounded-lg mr-3 bg-gray-200 flex items-center justify-center">
        <span class="text-xs text-gray-500">Зураг байхгүй</span>
      </div>
    {/if}
  {/if}
  
  <div class="flex-1">
    <div class="font-medium text-gray-900 {config.name}">{restaurant.name}</div>
    {#if showRating && restaurant.average_rating}
      <div class="text-gray-500 {config.rating}">
        Үнэлгээ: {restaurant.average_rating.toFixed(1)}
      </div>
    {/if}
  </div>
</div>