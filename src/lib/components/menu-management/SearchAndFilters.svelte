<script lang="ts">
  import { Search, Filter, X } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Badge } from "$lib/components/ui/badge";
  import type { Category } from "$lib/types/menu";

  let { 
    searchTerm = $bindable(""),
    showFilters = $bindable(false),
    selectedCategories = $bindable([]),
    availabilityFilter = $bindable("all"),
    categories = [],
    hasActiveFilters = false,
    onSearchInput,
    onToggleFilter,
    onToggleCategory,
    onClearFilters
  } = $props<{
    searchTerm: string;
    showFilters: boolean;
    selectedCategories: string[];
    availabilityFilter: string;
    categories: Category[];
    hasActiveFilters: boolean;
    onSearchInput: (event: Event) => void;
    onToggleFilter: () => void;
    onToggleCategory: (category: string) => void;
    onClearFilters: () => void;
  }>();
</script>

<div class="flex-1">
  <h1 class="mb-4 text-xl font-bold text-gray-800">
    Хоолны жагсаалт
  </h1>
  <div class="flex items-center space-x-2">
    <div class="relative flex-grow">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search class="w-5 h-5" />
      </span>
      <Input
        type="text"
        placeholder="Хайх..."
        class="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
        oninput={onSearchInput}
        value={searchTerm}
      />
    </div>
    <Button 
      variant="secondary" 
      onclick={onToggleFilter} 
      class_={showFilters ? "bg-primary-blue text-white" : ""}
    >
      <Filter class="w-4 h-4" />
      <span>Шүүх</span>
      {#if hasActiveFilters}
        <Badge variant="destructive" class_="ml-1 h-4 w-4 p-0 text-xs">!</Badge>
      {/if}
    </Button>
  </div>
</div>

<!-- Filter Panel -->
{#if showFilters}
  <div class="mb-4 p-4 bg-gray-50 rounded-lg border">
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
            onclick={() => availabilityFilter = "all"}
          >
            Бүгд
          </Badge>
          <Badge 
            variant={availabilityFilter === "available" ? "default" : "secondary"}
            class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
            onclick={() => availabilityFilter = "available"}
          >
            Идэвхтэй
          </Badge>
          <Badge 
            variant={availabilityFilter === "unavailable" ? "default" : "secondary"}
            class_="cursor-pointer hover:bg-primary-blue hover:text-white transition-colors"
            onclick={() => availabilityFilter = "unavailable"}
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