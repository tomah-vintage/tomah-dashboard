<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Search, X } from "@lucide/svelte";

  export let hideRestaurantFilter = false;

  const dispatch = createEventDispatcher<{
    filtersChange: {
      search: string;
      reviewType: string;
      rating: string;
      restaurant: string;
    };
  }>();

  let searchTerm = "";
  let reviewTypeFilter = "";
  let ratingFilter = "";
  let restaurantFilter = "";

  function applyFilters() {
    dispatch("filtersChange", {
      search: searchTerm,
      reviewType: reviewTypeFilter,
      rating: ratingFilter,
      restaurant: restaurantFilter,
    });
  }

  function clearFilters() {
    searchTerm = "";
    reviewTypeFilter = "";
    ratingFilter = "";
    restaurantFilter = "";
    applyFilters();
  }

  function handleReviewTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    reviewTypeFilter = target.value;
    applyFilters();
  }

  function handleRatingChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    ratingFilter = target.value;
    applyFilters();
  }

  function handleRestaurantChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    restaurantFilter = target.value;
    applyFilters();
  }

  $: hasActiveFilters =
    searchTerm || reviewTypeFilter || ratingFilter || restaurantFilter;
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <!-- Search Section -->
  <div class="flex-1">
    <label class="block text-sm font-medium text-gray-700 mb-2"
      >Search Reviews</label
    >
    <div class="relative">
      <Search
        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
      />
      <Input
        bind:value={searchTerm}
        placeholder="Search by comment, customer name, or restaurant..."
        class="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        on:input={applyFilters}
      />
    </div>
  </div>

  <!-- Filters Section -->
  <div class="flex flex-col sm:flex-row gap-4 pt-2">
    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-2"
        >Review Type</label
      >
      <select
        bind:value={reviewTypeFilter}
        on:change={handleReviewTypeChange}
        class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      >
        <option value="">All Types</option>
        <option value="SERVICE">🛎️ Service</option>
        <option value="TASTE">🍽️ Taste</option>
        <option value="ENVIRONMENT">🏪 Environment</option>
      </select>
    </div>

    <div class="flex-1">
      <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
      <select
        bind:value={ratingFilter}
        on:change={handleRatingChange}
        class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      >
        <option value="">All Ratings</option>
        <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
        <option value="4">⭐⭐⭐⭐ 4 Stars</option>
        <option value="3">⭐⭐⭐ 3 Stars</option>
        <option value="2">⭐⭐ 2 Stars</option>
        <option value="1">⭐ 1 Star</option>
      </select>
    </div>

    {#if !hideRestaurantFilter}
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Restaurant</label
        >
        <select
          bind:value={restaurantFilter}
          on:change={handleRestaurantChange}
          class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          <option value="">All Restaurants</option>
          <!-- Restaurant options would be loaded dynamically -->
        </select>
      </div>
    {/if}

    {#if hasActiveFilters}
      <div class="flex items-end">
        <Button
          variant="secondary"
          on:click={clearFilters}
          class="h-12 px-6 flex items-center gap-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
        >
          <X class="w-4 h-4" />
          Clear Filters
        </Button>
      </div>
    {/if}
  </div>
</div>
