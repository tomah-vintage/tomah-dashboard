<script lang="ts">
  import type { PlatformBanner } from "$lib/types/platform-banner";
  import { formatDate } from "$lib/utils/date";
  import { createEventDispatcher } from "svelte";
  import { Edit, Trash2 } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  export let banner: PlatformBanner;
  export let isDeleting = false;

  const dispatch = createEventDispatcher<{
    edit: PlatformBanner;
    delete: number;
  }>();

  function handleEdit() {
    dispatch("edit", banner);
  }

  function handleDelete() {
    if (confirm("Та энэ баннерыг устгахдаа итгэлтэй байна уу?")) {
      dispatch("delete", banner.id);
    }
  }
</script>

<tr class="border-b border-gray-100 hover:bg-gray-50">
  <td class="p-4">
    <img
      src={banner.image_url}
      alt="Banner for {banner.restaurant_name}"
      class="w-20 h-12 object-cover rounded border"
    />
  </td>
  <td class="p-4">
    <div class="font-medium text-gray-900">{banner.restaurant_name}</div>
    <div class="text-sm text-gray-500">ID: {banner.restaurant}</div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {banner.order_index}
    </div>
  </td>
  <td class="p-4">
    <div class="text-sm text-gray-600">
      {formatDate(banner.created_at)}
    </div>
  </td>
  <td class="p-4">
    <div class="flex items-center justify-end space-x-2">
      <Button
        variant="secondary"
        size="sm"
        on:click={handleEdit}
        disabled={isDeleting}
      >
        <Edit class="w-4 h-4 mr-1" />
        Засах
      </Button>
      <Button
        variant="error"
        size="sm"
        on:click={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 class="w-4 h-4 mr-1" />
        {isDeleting ? "Устгаж байна..." : "Устгах"}
      </Button>
    </div>
  </td>
</tr>
