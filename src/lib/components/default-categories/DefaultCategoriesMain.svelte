<script lang="ts">
  import { createGetDefaultCategoriesQuery } from "$lib/queries/menu-queries";
  import DefaultCategoriesList from "./DefaultCategoriesList.svelte";
  import DefaultCategoryFormModal from "./DefaultCategoryFormModal.svelte";
  import { filterCategories } from "$lib/utils/default-category";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Search } from "@lucide/svelte";

  const defaultCategoriesQuery = createGetDefaultCategoriesQuery();

  $: defaultCategories = $defaultCategoriesQuery.data || [];

  let searchValue = "";
  let showAddCategoryModal = false;

  $: filteredCategories = filterCategories(defaultCategories, searchValue);

  function openAddCategoryModal() {
    showAddCategoryModal = true;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Үндсэн ангилал</h1>
        <p class="mt-1 text-sm text-gray-500">Системд ашиглагдах үндсэн ангиллуудыг удирдах</p>
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
              placeholder="Ангилал хайх..."
              class="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              bind:value={searchValue}
            />
          </div>
          <Button on:click={openAddCategoryModal}>
            <Plus class="w-4 h-4 mr-1" />
            Ангилал нэмэх
          </Button>
        </div>
      </div>

      <!-- Default Categories List -->
      {#if $defaultCategoriesQuery.isLoading}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">Үндсэн ангиллуудыг уншиж байна...</div>
        </div>
      {:else if $defaultCategoriesQuery.isError}
        <div class="flex items-center justify-center py-8">
          <div class="text-red-600">Алдаа: {$defaultCategoriesQuery.error?.message}</div>
        </div>
      {:else if filteredCategories.length === 0}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">
            {searchValue.trim() ? 'Хайлтад тохирох ангилал олдсонгүй.' : 'Үндсэн ангилал олдсонгүй.'}
          </div>
        </div>
      {:else}
        <DefaultCategoriesList categories={filteredCategories} />
      {/if}
    </div>
  </div>
</div>

<DefaultCategoryFormModal bind:showModal={showAddCategoryModal} />