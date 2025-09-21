<script lang="ts">
  import type { RestaurantHighlight } from "$lib/types/restaurant-highlight";
  import { createDeleteRestaurantHighlightMutation } from "$lib/queries/menu-queries";
  import RestaurantHighlightFormModal from "./RestaurantHighlightFormModal.svelte";
  import RestaurantHighlightTableRow from "./RestaurantHighlightTableRow.svelte";
  import { createEventDispatcher } from "svelte";

  export let highlights: RestaurantHighlight[];

  const deleteRestaurantHighlightMutation = createDeleteRestaurantHighlightMutation();
  const dispatch = createEventDispatcher<{
    manageRestaurants: RestaurantHighlight;
  }>();

  let showEditModal = false;
  let editingHighlight: RestaurantHighlight | null = null;

  function handleEdit(event: CustomEvent<RestaurantHighlight>) {
    editingHighlight = event.detail;
    showEditModal = true;
  }

  function handleDelete(event: CustomEvent<number>) {
    $deleteRestaurantHighlightMutation.mutate(event.detail);
  }

  function handleManageRestaurants(event: CustomEvent<RestaurantHighlight>) {
    dispatch('manageRestaurants', event.detail);
  }
</script>

<div class="overflow-x-auto">
  <table class="w-full border-collapse">
    <thead>
      <tr class="border-b border-gray-200">
        <th class="p-4 text-left text-sm font-medium text-gray-600">Нэр</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Харуулах нэр</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Төрөл</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Өнгө</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Дүрс тэмдэг</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Төлөв</th>
        <th class="p-4 text-left text-sm font-medium text-gray-600">Эрэмбэ</th>
        <th class="p-4 text-right text-sm font-medium text-gray-600">Үйлдэл</th>
      </tr>
    </thead>
    <tbody>
      {#each highlights as highlight (highlight.id)}
        <RestaurantHighlightTableRow 
          {highlight}
          isDeleting={$deleteRestaurantHighlightMutation.isPending}
          on:edit={handleEdit}
          on:delete={handleDelete}
          on:manageRestaurants={handleManageRestaurants}
        />
      {/each}
    </tbody>
  </table>
</div>

<RestaurantHighlightFormModal 
  bind:showModal={showEditModal} 
  highlight={editingHighlight}
  on:close={() => { editingHighlight = null; }}
/>