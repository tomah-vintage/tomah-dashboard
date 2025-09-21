<script lang="ts">
  import { createGetAllRestaurantsQuery, createSetHighlightRestaurantsMutation } from "$lib/queries/menu-queries";
  import type { RestaurantHighlight, SimpleRestaurant } from "$lib/types/restaurant-highlight";
  import { Button } from "$lib/components/ui/button";
  import SearchInput from "$lib/components/ui/SearchInput.svelte";
  import RestaurantCard from "./RestaurantCard.svelte";
  import { filterRestaurants } from "$lib/utils/restaurant-highlight";
  import { X } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";

  export let showModal = false;
  export let highlight: RestaurantHighlight | null = null;

  const dispatch = createEventDispatcher();
  const allRestaurantsQuery = createGetAllRestaurantsQuery();
  const setHighlightRestaurantsMutation = createSetHighlightRestaurantsMutation();

  $: allRestaurants = (() => {
    const data = $allRestaurantsQuery.data;
    console.log('Restaurants API response:', data); // Debug log
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn('Unexpected restaurants API response format:', data);
      return [];
    }
  })();
  $: attachedRestaurantIds = new Set(highlight?.restaurants?.map(r => r.id) || []);

  let searchValue = "";
  let selectedRestaurantIds = new Set<number>();

  $: filteredRestaurants = filterRestaurants(allRestaurants, searchValue);

  $: if (highlight && showModal) {
    selectedRestaurantIds = new Set(highlight.restaurants?.map(r => r.id) || []);
  }

  function closeModal() {
    showModal = false;
    selectedRestaurantIds = new Set();
    searchValue = "";
    dispatch('close');
  }

  function toggleRestaurant(restaurantId: number) {
    if (selectedRestaurantIds.has(restaurantId)) {
      selectedRestaurantIds.delete(restaurantId);
    } else {
      selectedRestaurantIds.add(restaurantId);
    }
    selectedRestaurantIds = new Set(selectedRestaurantIds);
  }

  function handleSave() {
    if (!highlight) return;

    $setHighlightRestaurantsMutation.mutate({
      highlightId: highlight.id,
      restaurantIds: Array.from(selectedRestaurantIds)
    });
  }

  $: if ($setHighlightRestaurantsMutation.isSuccess) {
    closeModal();
  }

  function handleOutsideClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  $: modalTitle = highlight ? `"${highlight.display_name}" ресторан холбох` : 'Ресторан холбох';
</script>

{#if showModal && highlight}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(55, 65, 81, 0.5);"
    on:click={handleOutsideClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 id="modal-title" class="text-xl font-bold">{modalTitle}</h2>
        <button
          on:click={closeModal}
          class="text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <SearchInput 
          placeholder="Ресторан хайх..."
          bind:value={searchValue}
          size="lg"
        />
      </div>

      <!-- Restaurant List -->
      <div class="space-y-2 mb-6 max-h-96 overflow-y-auto">
        {#if $allRestaurantsQuery.isLoading}
          <div class="text-gray-600">Ресторан уншиж байна...</div>
        {:else if $allRestaurantsQuery.isError}
          <div class="text-red-600">Алдаа: {$allRestaurantsQuery.error?.message}</div>
        {:else if filteredRestaurants.length === 0}
          <div class="text-gray-600">
            {searchValue.trim() ? 'Хайлтад тохирох ресторан олдсонгүй.' : 'Ресторан олдсонгүй.'}
          </div>
        {:else}
          {#each filteredRestaurants as restaurant (restaurant.id)}
            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRestaurantIds.has(restaurant.id)}
                on:change={() => toggleRestaurant(restaurant.id)}
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div class="ml-3 flex-1">
                <RestaurantCard {restaurant} size="sm" showImage={true} />
              </div>
              {#if attachedRestaurantIds.has(restaurant.id)}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Одоо холбогдсон
                </span>
              {/if}
            </label>
          {/each}
        {/if}
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          on:click={closeModal}
        >
          Болих
        </Button>
        <Button
          type="button"
          disabled={$setHighlightRestaurantsMutation.isPending}
          on:click={handleSave}
        >
          {#if $setHighlightRestaurantsMutation.isPending}
            Хадгалж байна...
          {:else}
            Хадгалах
          {/if}
        </Button>
      </div>
    </div>
  </div>
{/if}