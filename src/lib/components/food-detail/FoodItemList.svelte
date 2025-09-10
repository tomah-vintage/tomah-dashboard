<script lang="ts">
  import { Heart } from '@lucide/svelte';
  import type { MenuItem } from '$lib/types/menu';

  let { 
    items = [], 
    selectedFoodItem = null, 
    searchQuery = '', 
    onSelect 
  }: {
    items: MenuItem[];
    selectedFoodItem: MenuItem | null;
    searchQuery: string;
    onSelect: (item: MenuItem) => void;
  } = $props();

  // Filter items based on search query
  let filteredItems = $derived(items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  function handleItemClick(item: MenuItem) {
    onSelect(item);
  }

  function formatPrice(price: string | number): string {
    if (typeof price === 'number') {
      return `${price.toLocaleString()}₮`;
    }
    return price;
  }
</script>

<div class="space-y-2">
  {#each filteredItems as item (item.id)}
    <div 
      class="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md {
        selectedFoodItem?.id === item.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }"
      on:click={() => handleItemClick(item)}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && handleItemClick(item)}
    >
      <div class="flex gap-4">
        <!-- Food Image -->
        <div class="flex-shrink-0">
          <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            {#if item.img_urls && item.img_urls.length > 0}
              <img 
                src={item.img_urls[0]} 
                alt={item.name}
                class="w-full h-full object-cover"
              />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                <Heart class="w-8 h-8" />
              </div>
            {/if}
          </div>
        </div>

        <!-- Food Info -->
        <div class="flex-grow min-w-0">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-gray-900 text-base leading-tight">
              {item.name}
            </h3>
            <div class="flex-shrink-0 ml-3">
              <span class="text-lg font-bold text-gray-900">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.description}
          </p>

          <!-- Variants Info -->
          {#if item.meta_data?.has_variants && item.meta_data?.variants && item.meta_data.variants.length > 0}
            <div class="flex flex-wrap gap-1 mb-2">
              {#each item.meta_data.variants as variant (variant.name)}
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium {
                  variant.is_default 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-700'
                }">
                  {variant.name} - {variant.price.toLocaleString()}₮
                  {#if variant.is_default}
                    <span class="ml-1">⭐</span>
                  {/if}
                </span>
              {/each}
            </div>
          {/if}

          <!-- Availability Status -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              {#if item.meta_data?.calories}
                <span class="text-xs text-gray-500">
                  {item.meta_data.calories} cal
                </span>
              {/if}
            </div>
            
            <div class="flex items-center">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full {
                  item.is_available ? 'bg-green-500' : 'bg-red-500'
                } mr-2"></div>
                <span class="text-xs text-gray-600">
                  {item.is_available ? 'Боломжтой' : 'Боломжгүй'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}

  {#if filteredItems.length === 0}
    <div class="text-center py-8">
      <p class="text-gray-500">Хайлтын үр дүн олдсонгүй</p>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>