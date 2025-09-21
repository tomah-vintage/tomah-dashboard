<script lang="ts">
  import type { DefaultCategory } from "$lib/types/category";
  import { createDeleteDefaultCategoryMutation } from "$lib/queries/menu-queries";
  import { Button } from "$lib/components/ui/button";
  import { Edit, Trash2 } from "@lucide/svelte";
  import DefaultCategoryFormModal from "./DefaultCategoryFormModal.svelte";

  export let categories: DefaultCategory[];

  const deleteDefaultCategoryMutation = createDeleteDefaultCategoryMutation();

  let showEditModal = false;
  let editingCategory: DefaultCategory | null = null;

  function editCategory(category: DefaultCategory) {
    editingCategory = category;
    showEditModal = true;
  }

  function deleteCategory(categoryId: number) {
    if (confirm('Энэ үндсэн ангиллыг устгахдаа итгэлтэй байна уу?')) {
      $deleteDefaultCategoryMutation.mutate(categoryId);
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'Тодорхойгүй';
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="p-4 text-left text-sm font-medium text-gray-600">Нэр</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Тайлбар</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Үүссэн</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Засварласан</th>
        <th class="p-4 text-right text-sm font-medium text-gray-600">Үйлдэл</th>
      </tr>
    </thead>
    <tbody>
      {#each categories as category (category.id)}
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="p-4">
            <div class="font-medium text-gray-900">{category.name}</div>
          </td>
          <td class="p-4">
            <div class="text-sm text-gray-600">
              {category.description || 'Тайлбар байхгүй'}
            </div>
          </td>
          <td class="p-4">
            <div class="text-sm text-gray-600">{formatDate(category.created_at)}</div>
          </td>
          <td class="p-4">
            <div class="text-sm text-gray-600">{formatDate(category.updated_at)}</div>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                on:click={() => editCategory(category)}
              >
                <Edit class="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                on:click={() => deleteCategory(category.id)}
                disabled={$deleteDefaultCategoryMutation.isPending}
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<DefaultCategoryFormModal 
  bind:showModal={showEditModal} 
  category={editingCategory}
  on:close={() => { editingCategory = null; }}
/>