<script lang="ts">
  import { Sparkles, Star } from '@lucide/svelte';
  import type { MenuItem } from '$lib/types/menu';
  import { Button } from '$lib/components/ui/button';

  let { 
    menuItems, 
    selectedItems, 
    handleItemToggle 
  } = $props<{ 
    menuItems: MenuItem[];
    selectedItems: Set<number>;
    handleItemToggle: (itemId: number, isEmphasized: boolean) => void;
  }>();

  function toggleItemHighlight(item: MenuItem) {
    const isCurrentlySelected = selectedItems.has(item.id);
    handleItemToggle(item.id, !isCurrentlySelected);
  }
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#each menuItems as item (item.id)}
    {@const isHighlighted = selectedItems.has(item.id)}
    <div class="relative bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <!-- Highlight indicator -->
      {#if isHighlighted}
        <div class="absolute top-2 right-2 z-10">
          <div class="flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
            <Star class="w-3 h-3 mr-1 fill-current" />
            Онцлох
          </div>
        </div>
      {/if}

      <!-- Image -->
      <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
        {#if item.img_urls && item.img_urls.length > 0}
          <img 
            src={item.img_urls[0]} 
            alt={item.name}
            class="w-full h-48 object-cover"
          />
        {:else}
          <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span class="text-gray-400 text-sm">Зураггүй</span>
          </div>
        {/if}
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        {#if item.description}
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        {/if}

        <!-- Price and status -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-lg font-bold text-gray-900">
            ₮{item.price}
          </span>
          <span class="text-xs px-2 py-1 rounded-full {item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            {item.is_available ? 'Идэвхтэй' : 'Идэвхгүй'}
          </span>
        </div>

        <!-- Categories -->
        {#if item.categories && item.categories.length > 0}
          <div class="mb-3">
            <div class="flex flex-wrap gap-1">
              {#each item.categories.slice(0, 2) as category, index (index)}
                <span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {category}
                </span>
              {/each}
              {#if item.categories.length > 2}
                <span class="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
                  +{item.categories.length - 2}
                </span>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Toggle button -->
        <Button
          variant={isHighlighted ? "primary" : "secondary"}
          class="w-full"
          onclick={() => toggleItemHighlight(item)}
          disabled={!item.is_available}
        >
          {#if isHighlighted}
            <Star class="w-4 h-4 mr-2 fill-current" />
            Онцлохоос хасах
          {:else}
            <Sparkles class="w-4 h-4 mr-2" />
            Онцлох болгох
          {/if}
        </Button>
      </div>
    </div>
  {/each}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .aspect-w-16 {
    position: relative;
  }
  
  .aspect-w-16::before {
    content: "";
    display: block;
    padding-top: calc(9 / 16 * 100%);
  }
  
  .aspect-h-9 > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>