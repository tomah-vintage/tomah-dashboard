<script lang="ts">
  import type { RestaurantHighlight } from "$lib/types/restaurant-highlight";
  import { Button } from "$lib/components/ui/button";
  import { Edit, Trash2, Users } from "@lucide/svelte";
  import { createEventDispatcher } from "svelte";

  export let highlight: RestaurantHighlight;
  export let isDeleting = false;

  const dispatch = createEventDispatcher<{
    edit: RestaurantHighlight;
    delete: number;
    manageRestaurants: RestaurantHighlight;
  }>();

  function handleEdit() {
    dispatch('edit', highlight);
  }

  function handleDelete() {
    if (confirm('Энэ онцлох ресторанг устгахдаа итгэлтэй байна уу?')) {
      dispatch('delete', highlight.id);
    }
  }

  function handleManageRestaurants() {
    dispatch('manageRestaurants', highlight);
  }
</script>

<td class="p-4 text-right" on:click={(e) => e.stopPropagation()}>
  <div class="flex items-center justify-end space-x-2">
    <Button
      variant="secondary"
      size="sm"
      on:click={handleManageRestaurants}
      title="Ресторан удирдах"
    >
      <Users class="w-4 h-4" />
    </Button>
    <Button
      variant="secondary"
      size="sm"
      on:click={handleEdit}
      title="Засах"
    >
      <Edit class="w-4 h-4" />
    </Button>
    <Button
      variant="destructive"
      size="sm"
      on:click={handleDelete}
      disabled={isDeleting}
      title="Устгах"
    >
      <Trash2 class="w-4 h-4" />
    </Button>
  </div>
</td>