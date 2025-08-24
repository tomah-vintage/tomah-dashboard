<script lang="ts">
  import { createGetCategoriesQuery } from "$lib/queries/menu-queries";
  import CategoryList from "./CategoryList.svelte";
  import CategoryFormModal from "./CategoryFormModal.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Plus, Upload, Search } from "lucide-svelte";

  export let restaurantId: number;

  const categoriesQuery = createGetCategoriesQuery();

  let searchValue = "";
  let showAddCategoryModal = false;

  function openAddCategoryModal() {
    showAddCategoryModal = true;
  }
</script>

<div class="min-h-screen p-6 font-sans bg-gray-100">
  <!-- Breadcrumbs -->
  <div class="mb-4">
    <span class="text-sm text-gray-500">
      <a href="/(rsadmin)/menu" class="hover:underline">Menu</a> &gt; Categories
    </span>
  </div>

  <div class="p-6 bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <span class="w-1 h-6 mr-3 bg-blue-600"></span>
        <h1 class="text-2xl font-bold">Categories</h1>
      </div>
      <div class="flex items-center space-x-2">
        <div class="relative">
          <Search
            class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
          />
          <input
            type="text"
            placeholder="Search..."
            class="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            bind:value={searchValue}
          />
        </div>
        <Button on:click={openAddCategoryModal}>
          <Plus class="w-4 h-4 mr-1" />
          Add Category
        </Button>
        <Button variant="secondary">
          <Upload class="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
    </div>

    <!-- Category List -->
    {#if $categoriesQuery.isLoading}
      <div>Loading categories...</div>
    {:else if $categoriesQuery.isError}
      <div>Error: {$categoriesQuery.error?.message}</div>
    {:else if $categoriesQuery.data}
      <CategoryList categories={$categoriesQuery.data} />
    {:else}
      <div>No categories found.</div>
    {/if}
  </div>
</div>

<CategoryFormModal bind:showModal={showAddCategoryModal} {restaurantId} />
