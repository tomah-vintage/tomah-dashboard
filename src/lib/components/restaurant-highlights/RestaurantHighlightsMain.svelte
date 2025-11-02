<script lang="ts">
  import { createGetRestaurantHighlightsQuery } from "$lib/queries/menu-queries";
  import RestaurantHighlightsList from "./RestaurantHighlightsList.svelte";
  import RestaurantHighlightFormModal from "./RestaurantHighlightFormModal.svelte";
  import RestaurantAttachmentModal from "./RestaurantAttachmentModal.svelte";
  import SearchInput from "$lib/components/ui/SearchInput.svelte";
  import { filterHighlights } from "$lib/utils/restaurant-highlight";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "@lucide/svelte";
  import type { RestaurantHighlight } from "$lib/types/restaurant-highlight";

  const restaurantHighlightsQuery = createGetRestaurantHighlightsQuery();

  $: restaurantHighlights = $restaurantHighlightsQuery.data || [];

  let searchValue = "";
  let showAddHighlightModal = false;
  let showRestaurantAttachmentModal = false;
  let selectedHighlight: RestaurantHighlight | null = null;

  $: filteredHighlights = filterHighlights(restaurantHighlights, searchValue);

  function openAddHighlightModal() {
    showAddHighlightModal = true;
  }

  function handleManageRestaurants(event: CustomEvent<RestaurantHighlight>) {
    selectedHighlight = event.detail;
    showRestaurantAttachmentModal = true;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Онцлох ресторан</h1>
        <p class="mt-1 text-sm text-gray-500">Платформ дээр онцлох ресторанууд удирдах</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Онцлох жагсаалт</h2>
        <div class="flex items-center space-x-2">
          <SearchInput
            placeholder="Онцлох хайх..."
            bind:value={searchValue}
            size="md"
          />
          <Button on:click={openAddHighlightModal}>
            <Plus class="w-4 h-4 mr-1" />
            Онцлох нэмэх
          </Button>
        </div>
      </div>

      <!-- Restaurant Highlights List -->
      {#if $restaurantHighlightsQuery.isLoading}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">Онцлох ресторан уншиж байна...</div>
        </div>
      {:else if $restaurantHighlightsQuery.isError}
        <div class="flex items-center justify-center py-8">
          <div class="text-red-600">Алдаа: {$restaurantHighlightsQuery.error?.message}</div>
        </div>
      {:else if filteredHighlights.length === 0}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">
            {searchValue.trim() ? 'Хайлтад тохирох онцлох олдсонгүй.' : 'Онцлох ресторан олдсонгүй.'}
          </div>
        </div>
      {:else}
        <RestaurantHighlightsList highlights={filteredHighlights} on:manageRestaurants={handleManageRestaurants} />
      {/if}
    </div>
  </div>
</div>

<RestaurantHighlightFormModal bind:showModal={showAddHighlightModal} />
<RestaurantAttachmentModal 
  bind:showModal={showRestaurantAttachmentModal} 
  highlight={selectedHighlight}
  on:close={() => { selectedHighlight = null; }}
/>