<script lang="ts">
  import { createGetCategoriesQuery } from "$lib/queries/menu-queries";
  import CategoryList from "./CategoryList.svelte";
  import CategoryFormModal from "./CategoryFormModal.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Upload, Search } from "@lucide/svelte";

  export let restaurantId: number;

  const categoriesQuery = createGetCategoriesQuery();

  $: categories = $categoriesQuery.data || [];

  let searchValue = "";
  let showAddCategoryModal = false;

  function openAddCategoryModal() {
    showAddCategoryModal = true;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Цэсний ангилал</h1>
        <p class="mt-1 text-sm text-gray-500">Рестораны цэсний ангиллыг удирдах хэсэг</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Ангиллын жагсаалт</h2>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <Search
              class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />
            <input
              type="text"
              placeholder="Ангиллын нэрээр хайх..."
              class="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              bind:value={searchValue}
            />
          </div>
          <Button on:click={openAddCategoryModal}>
            <Plus class="w-4 h-4 mr-1" />
            Шинэ ангилал
          </Button>
          <Button variant="secondary">
            <Upload class="w-4 h-4 mr-1" />
            Экспортлох
          </Button>
        </div>
      </div>

      <!-- Category List -->
      {#if $categoriesQuery.isLoading}
        <div class="text-center py-8 text-gray-600">Ачаалж байна...</div>
      {:else if $categoriesQuery.isError}
        <div class="text-center py-8 text-red-600">Алдаа гарлаа: {$categoriesQuery.error?.message}</div>
      {:else if categories.length === 0}
        <div class="text-center py-8 text-gray-500">Одоогоор ангилал байхгүй байна.</div>
      {:else}
        <CategoryList {categories} />
      {/if}
    </div>
  </div>
</div>

<CategoryFormModal bind:showModal={showAddCategoryModal} {restaurantId} />
