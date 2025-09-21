<script lang="ts">
  import { createGetDefaultCategoriesQuery } from "$lib/queries/menu-queries";
  import DefaultCategoriesList from "./DefaultCategoriesList.svelte";
  import DefaultCategoryFormModal from "./DefaultCategoryFormModal.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Search } from "@lucide/svelte";

  const defaultCategoriesQuery = createGetDefaultCategoriesQuery();

  $: defaultCategories = $defaultCategoriesQuery.data || [];

  let searchValue = "";
  let showAddCategoryModal = false;
  let filteredCategories: typeof defaultCategories = [];

  $: {
    if (searchValue.trim()) {
      filteredCategories = defaultCategories.filter(category =>
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchValue.toLowerCase()))
      );
    } else {
      filteredCategories = defaultCategories;
    }
  }

  function openAddCategoryModal() {
    showAddCategoryModal = true;
  }
</script>

<div class="min-h-screen p-6 font-sans bg-gray-100">
  <div class="p-6 bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <span class="w-1 h-6 mr-3 bg-blue-600"></span>
        <h1 class="text-2xl font-bold">Үндсэн ангилал</h1>
      </div>
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

<DefaultCategoryFormModal bind:showModal={showAddCategoryModal} />