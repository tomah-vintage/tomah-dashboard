<script lang="ts">
  import type { DefaultCategory } from "$lib/types/category";
  import { Button } from "$lib/components/ui/button";
  import { Edit, Trash2 } from "@lucide/svelte";
  import { formatDisplayDate } from "$lib/utils/default-category";
  import { createEventDispatcher } from "svelte";

  export let category: DefaultCategory;
  export let isDeleting = false;

  const dispatch = createEventDispatcher<{
    edit: DefaultCategory;
    delete: number;
  }>();

  function handleEdit() {
    dispatch("edit", category);
  }

  function handleDelete() {
    if (confirm("Энэ үндсэн ангиллыг устгахдаа итгэлтэй байна уу?")) {
      dispatch("delete", category.id);
    }
  }
</script>

<tr class="border-b border-gray-100 hover:bg-gray-50">
  <td class="p-4">
    <div
      class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
    >
      {#if category.image_url}
        <img
          src={category.image_url}
          alt={category.mongolian_name || category.name}
          class="w-full h-full object-cover"
        />
      {:else}
        <div class="text-gray-400 text-xs">Зураг байхгүй</div>
      {/if}
    </div>
  </td>
  <td class="p-4">
    <div class="font-medium text-gray-900">
      {category.mongolian_name || "Нэр байхгүй"}
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {category.description || "Тайлбар байхгүй"}
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {formatDisplayDate(category.created_at)}
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {formatDisplayDate(category.updated_at)}
    </div>
  </td>
  <td class="p-4 text-right">
    <div class="flex items-center justify-end space-x-2">
      <Button variant="secondary" size="sm" on:click={handleEdit}>
        <Edit class="w-4 h-4" />
      </Button>
      <Button
        variant="error"
        size="sm"
        on:click={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 class="w-4 h-4" />
      </Button>
    </div>
  </td>
</tr>
