<script lang="ts">
  import type { DefaultCategory } from "$lib/types/category";
  import { createDeleteDefaultCategoryMutation } from "$lib/queries/menu-queries";
  import DefaultCategoryFormModal from "./DefaultCategoryFormModal.svelte";
  import DefaultCategoryTableRow from "./DefaultCategoryTableRow.svelte";

  export let categories: DefaultCategory[];

  const deleteDefaultCategoryMutation = createDeleteDefaultCategoryMutation();

  let showEditModal = false;
  let editingCategory: DefaultCategory | null = null;

  function handleEdit(event: CustomEvent<DefaultCategory>) {
    editingCategory = event.detail;
    showEditModal = true;
  }

  function handleDelete(event: CustomEvent<number>) {
    $deleteDefaultCategoryMutation.mutate(event.detail);
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="p-4 text-left text-sm font-medium text-gray-600">Зураг</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Нэр</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Тайлбар</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Үүссэн</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Засварласан</th>
        <th class="p-4 text-right text-sm font-medium text-gray-600">Үйлдэл</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as category (category.id)}
        <DefaultCategoryTableRow 
          {category}
          isDeleting={$deleteDefaultCategoryMutation.isPending}
          on:edit={handleEdit}
          on:delete={handleDelete}
        />
      {/each}
    </tbody>
  </table>
</div>

<DefaultCategoryFormModal 
  bind:showModal={showEditModal} 
  category={editingCategory}
  on:close={() => { editingCategory = null; }}
/>
