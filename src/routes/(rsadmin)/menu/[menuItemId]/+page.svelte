<script lang="ts">
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { Search, Filter, Plus } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import FoodItemList from "$lib/components/food-detail/FoodItemList.svelte";
  import FoodEditForm from "$lib/components/food-detail/FoodEditForm.svelte";
  import { createGetMenuItemsQuery } from "$lib/queries/menu-queries";
  import type { MenuItem } from "$lib/types/menu";

  // Get menu item ID from URL parameter
  let menuItemId = $derived($page.params.menuItemId);

  // Fetch menu items from API
  let currentPage = 1;
  let page_size = 50; // Get more items to show in the list

  let menuItemsQuery = $derived(
    createGetMenuItemsQuery(currentPage, page_size)
  );
  let {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = $derived($menuItemsQuery);
  let foodItems = $derived(paginatedData?.results || []);

  let selectedFoodItem: MenuItem | null = $state(null);
  let searchQuery = $state("");

  // Set selected item based on menuItemId or first item as fallback
  $effect(() => {
    if (foodItems.length > 0) {
      const targetItem = foodItems.find(
        (item) => item.id.toString() === menuItemId
      );
      selectedFoodItem = targetItem || foodItems[0];
    }
  });

  function handleFoodItemSelect(item: MenuItem) {
    selectedFoodItem = item;
    // Update URL to reflect selected item
    history.replaceState(null, "", `/menu/${item.id}`);
  }

  function handleFoodItemUpdate(updatedItem: MenuItem) {
    const index = foodItems.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      foodItems[index] = updatedItem;
      selectedFoodItem = updatedItem;
    }
  }
</script>

<svelte:head>
  <title>Бүтээгдэхүүний дэлгэрэнгүй засах | Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <nav class="text-sm text-gray-500 space-x-2">
          <a href="{base}/menu" class="hover:text-gray-700">Хоолны цэс</a>
          <span>></span>
          <a href="{base}/menu" class="hover:text-gray-700">Хоолны жагсаалт</a>
          <span>></span>
          <span class="text-gray-900">Засах</span>
        </nav>
        <div class="ml-4">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            🔔
          </span>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <div class="relative">
          <Search
            class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Хайх..."
            bind:value={searchQuery}
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
        <Button variant="secondary">
          <Filter class="w-4 h-4 mr-2" />
          Шүүх
        </Button>
        <Button href="{base}/menu/new">
          <Plus class="w-4 h-4 mr-2" />
          Хоол нэмэх
        </Button>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex">
    <!-- Left Sidebar - Food Items List -->
    <div class="w-1/3 bg-white border-r border-gray-200 min-h-screen">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Бүтээгдэхүүний дэлгэрэнгүй засах
        </h2>

        {#if isLoading}
          <div class="text-center py-8">
            <p class="text-gray-500">Ачаалж байна...</p>
          </div>
        {:else if isError}
          <div class="text-center py-8">
            <p class="text-red-500">
              Алдаа: {error?.message || "Тодорхойгүй алдаа"}
            </p>
          </div>
        {:else if foodItems.length === 0}
          <div class="text-center py-8">
            <p class="text-gray-500">Хоолны цэс олдсонгүй</p>
          </div>
        {:else}
          <FoodItemList
            items={foodItems}
            {selectedFoodItem}
            {searchQuery}
            onSelect={handleFoodItemSelect}
          />
        {/if}
      </div>
    </div>

    <!-- Right Side - Food Edit Form -->
    <div class="w-2/3 bg-gray-50 min-h-screen">
      <div class="p-6">
        {#if isLoading}
          <div class="text-center py-12">
            <p class="text-gray-500">Ачаалж байна...</p>
          </div>
        {:else if selectedFoodItem}
          <FoodEditForm
            foodItem={selectedFoodItem}
            onUpdate={handleFoodItemUpdate}
          />
        {:else}
          <div class="text-center py-12">
            <p class="text-gray-500">Хоол сонгоно уу</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
