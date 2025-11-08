<script lang="ts">
  import { createGetDefaultCategoriesQuery } from "$lib/queries/menu-queries";
  import DefaultCategoriesList from "./DefaultCategoriesList.svelte";
  import DefaultCategoryFormModal from "./DefaultCategoryFormModal.svelte";
  import SearchInput from "$lib/components/ui/SearchInput.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "@lucide/svelte";
  import type { DefaultCategory } from "$lib/types/category";

  const defaultCategoriesQuery = createGetDefaultCategoriesQuery();

  $: defaultCategories = $defaultCategoriesQuery.data || [];

  let searchValue = "";
  let showAddCategoryModal = false;
  let selectedCategory: DefaultCategory | null = null;

  // Filter categories by name
  $: filteredCategories = searchValue.trim() 
    ? defaultCategories.filter(category => 
        category.name.toLowerCase().includes(searchValue.toLowerCase().trim())
      )
    : defaultCategories;

  function openAddCategoryModal() {
    selectedCategory = null;
    showAddCategoryModal = true;
  }

  function handleEdit(event: CustomEvent<DefaultCategory>) {
    selectedCategory = event.detail;
    showAddCategoryModal = true;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Үндсэн ангилал</h1>
        <p class="mt-1 text-sm text-gray-500">Системийн үндсэн ангиллыг удирдах хэсэг</p>
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
          <SearchInput
            placeholder="Ангиллын нэрээр хайх..."
            bind:value={searchValue}
            size="md"
          />
          <Button on:click={openAddCategoryModal}>
            <Plus class="w-4 h-4 mr-1" />
            Шинэ ангилал
          </Button>
        </div>
      </div>

      <!-- Categories List -->
      {#if $defaultCategoriesQuery.isLoading}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">Ачаалж байна...</div>
        </div>
      {:else if $defaultCategoriesQuery.isError}
        <div class="flex items-center justify-center py-8">
          <div class="text-red-600">Алдаа гарлаа: {$defaultCategoriesQuery.error?.message}</div>
        </div>
      {:else if filteredCategories.length === 0}
        <div class="flex items-center justify-center py-8">
          <div class="text-gray-600">
            {searchValue.trim() ? 'Хайлтад тохирох ангилал олдсонгүй.' : 'Одоогоор ангилал байхгүй байна.'}
          </div>
        </div>
      {:else}
        <DefaultCategoriesList categories={filteredCategories} on:edit={handleEdit} />
      {/if}
    </div>
  </div>
</div>

<DefaultCategoryFormModal 
  bind:showModal={showAddCategoryModal} 
  category={selectedCategory}
  on:close={() => { selectedCategory = null; }}
/>