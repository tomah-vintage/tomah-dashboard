<script lang="ts">
  import { Search, Filter, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import type { Category } from "$lib/types/menu";

  let {
    searchTerm = $bindable(""),
    showFilters = $bindable(false),
    selectedCategories = $bindable([]),
    availabilityFilter = $bindable("all"),
    categories = [],
    hasActiveFilters = false,
    onToggleCategory,
    onClearFilters
  } = $props<{
    searchTerm: string;
    showFilters: boolean;
    selectedCategories: string[];
    availabilityFilter: string;
    categories: Category[];
    hasActiveFilters: boolean;
    onToggleCategory: (category: string) => void;
    onClearFilters: () => void;
  }>();
</script>

<div class="flex-1 flex flex-col gap-3 relative">
  <!-- Search + Filter button row -->
  <div class="flex items-center gap-2">
    <div class="relative flex-grow">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search class="w-5 h-5 text-gray-400" />
      </span>
      <input
        type="text"
        placeholder="Хайх..."
        bind:value={searchTerm}
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
    <Button
      variant="secondary"
      onclick={() => (showFilters = !showFilters)}
      class_={showFilters ? "bg-primary-blue text-white" : ""}
    >
      <Filter class="w-4 h-4" />
      <span>Шүүх</span>
      {#if hasActiveFilters}
        <Badge variant="destructive" class_="ml-1 h-4 w-4 p-0 text-xs">!</Badge>
      {/if}
    </Button>
  </div>

  <!-- Filter Panel -->
  {#if showFilters}
    <div class="absolute top-full left-0 right-0 mt-1 z-50 p-4 bg-white rounded-lg border border-gray-200 shadow-lg">
      <div class="flex flex-wrap gap-4">
        <!-- Category Filter -->
        <div class="flex-1 min-w-0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Ангилал</label>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              <Badge
                variant={selectedCategories.includes(category.name) ? "default" : "secondary"}
                class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
                onclick={() => onToggleCategory(category.name)}
              >
                {category.name}
              </Badge>
            {/each}
          </div>
        </div>

        <!-- Availability Filter -->
        <div class="flex-1 min-w-0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Статус</label>
          <div class="flex gap-2">
            <Badge
              variant={availabilityFilter === "all" ? "default" : "secondary"}
              class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
              onclick={() => (availabilityFilter = "all")}
            >
              Бүгд
            </Badge>
            <Badge
              variant={availabilityFilter === "available" ? "default" : "secondary"}
              class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
              onclick={() => (availabilityFilter = "available")}
            >
              Идэвхтэй
            </Badge>
            <Badge
              variant={availabilityFilter === "unavailable" ? "default" : "secondary"}
              class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
              onclick={() => (availabilityFilter = "unavailable")}
            >
              Идэвхгүй
            </Badge>
          </div>
        </div>

        <!-- Clear Filters -->
        {#if hasActiveFilters}
          <div class="flex items-end">
            <Button variant="tertiary" onclick={onClearFilters} class_="flex items-center gap-2">
              <X class="w-4 h-4" />
              Арилгах
            </Button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
