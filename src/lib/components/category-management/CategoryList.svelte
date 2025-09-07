<script lang="ts">
  import type { Category } from "$lib/types/category";
  import { FilePen, Trash2 } from "lucide-svelte";
  import CategoryDeleteModal from "./CategoryDeleteModal.svelte";
  import { createDeleteCategoryMutation } from "$lib/queries/menu-queries";
  import toast from "svelte-french-toast";

  export let categories: Category[];

  let deleteModal: CategoryDeleteModal;

  const deleteCategoryMutation = createDeleteCategoryMutation();

  function handleDelete(event: CustomEvent<Category>) {
    const categoryToDelete = event.detail;

    if (
      categoryToDelete.menu_item_count &&
      categoryToDelete.menu_item_count > 0
    ) {
      toast.error("Cannot delete a category with associated menu items.");
      return;
    }

    $deleteCategoryMutation.mutate(categoryToDelete.id, {
      onSuccess: () => {
        deleteModal.closeModal();
      },
    });
  }
</script>

<div class="w-full text-sm">
  <!-- Table Header -->
  <div
    class="flex items-center px-4 py-3 border-b border-gray-200 rounded-t-lg bg-gray-50"
  >
    <div class="flex-1 font-semibold text-gray-600">Ангиллын нэр</div>
    <div class="w-48 font-semibold text-gray-600">Бүтээгдэхүүн</div>
    <div class="w-32 font-semibold text-center text-gray-600">Үйлдэл</div>
  </div>

  <!-- Table Body -->
  <div>
    {#each categories as category (category.id)}
      <div
        class="flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
      >
        <div class="flex-1 font-medium text-gray-800">{category.name}</div>
        <div class="w-48 text-gray-600">{category.menu_item_count || 0}</div>
        <div class="flex items-center justify-center w-32 space-x-4">
          <button class="text-gray-400 hover:text-blue-600">
            <FilePen class="w-5 h-5" />
          </button>
          <button
            class="text-gray-400 hover:text-red-600"
            on:click={() => deleteModal.openModal(category)}
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>



<CategoryDeleteModal
  bind:this={deleteModal}
  on:delete={handleDelete}
  isLoading={$deleteCategoryMutation.isPending}
/>
