<script lang="ts">
  import { Trash2, ChevronUp, ChevronDown } from "@lucide/svelte";
  import type { MenuItem } from "$lib/types/menu";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    createUpdateMenuItemMutation,
    createDeleteMenuItemMutation,
  } from "$lib/queries/menu-queries";
  import { createEventDispatcher } from "svelte";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";

  let { menuItems, onsort } = $props<{
    menuItems: MenuItem[];
    onsort?: (event: { column: string; direction: "asc" | "desc" }) => void;
  }>();

  let selectedItems = $state<Set<number>>(new Set());
  let selectAllChecked = $state(false);
  let sortColumn = $state<string | null>(null);
  let sortDirection = $state<"asc" | "desc">("asc");
  let showDeleteDialog = $state(false);
  let itemToDelete = $state<MenuItem | null>(null);

  const dispatch = createEventDispatcher();
  const updateMenuItemMutation = createUpdateMenuItemMutation();
  const deleteMenuItemMutation = createDeleteMenuItemMutation();

  function navigateToDetail(id: number) {
    goto(`${base}/menu/${id}`);
  }

  function deleteMenuItem(id: number, event: Event) {
    event.stopPropagation();
    const item = menuItems.find((item) => item.id === id);
    if (item) {
      itemToDelete = item;
      showDeleteDialog = true;
    }
  }

  function confirmDelete() {
    if (itemToDelete) {
      $deleteMenuItemMutation.mutate(itemToDelete.id, {
        onSuccess: () => {
          showDeleteDialog = false;
          itemToDelete = null;
        },
        onError: () => {
          // Keep dialog open on error so user can retry
        },
      });
    }
  }

  function cancelDelete() {
    itemToDelete = null;
  }

  function toggleSelectItem(id: number, event: Event) {
    event.stopPropagation();
    if (selectedItems.has(id)) {
      selectedItems.delete(id);
    } else {
      selectedItems.add(id);
    }
    selectedItems = selectedItems;
    updateSelectAllState();
  }

  function toggleSelectAll(event: Event) {
    event.stopPropagation();
    if (selectAllChecked) {
      selectedItems.clear();
    } else {
      menuItems.forEach((item: MenuItem) => selectedItems.add(item.id));
    }
    selectedItems = selectedItems;
    selectAllChecked = !selectAllChecked;
  }

  function updateSelectAllState() {
    selectAllChecked =
      menuItems.length > 0 &&
      menuItems.every((item: MenuItem) => selectedItems.has(item.id));
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
    onsort?.({ column, direction: sortDirection });
  }

  $effect(() => {
    updateSelectAllState();
  });
</script>

<div class="overflow-x-auto" role="table" tabindex="0">
  <table class="w-full text-sm text-left text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <Input
              id="checkbox-all"
              type="checkbox"
              label=""
              checked={selectAllChecked}
              onchange={toggleSelectAll}
            />
          </div>
        </th>
        <th scope="col" class="px-6 py-3">
          <button
            type="button"
            class="flex items-center hover:text-gray-900 transition-colors"
            onclick={() => handleSort("name")}
          >
            Нэр
            {#if sortColumn === "name"}
              {#if sortDirection === "asc"}
                <ChevronUp class="w-3 h-3 ml-1.5" />
              {:else}
                <ChevronDown class="w-3 h-3 ml-1.5" />
              {/if}
            {:else}
              <ChevronUp class="w-3 h-3 ml-1.5 opacity-50" />
            {/if}
          </button>
        </th>
        <th scope="col" class="px-6 py-3">Зураг</th>
        <th scope="col" class="px-6 py-3">Ангилал</th>
        <th scope="col" class="px-6 py-3">
          <button
            type="button"
            class="flex items-center hover:text-gray-900 transition-colors"
            onclick={() => handleSort("price")}
          >
            Үнэ
            {#if sortColumn === "price"}
              {#if sortDirection === "asc"}
                <ChevronUp class="w-3 h-3 ml-1.5" />
              {:else}
                <ChevronDown class="w-3 h-3 ml-1.5" />
              {/if}
            {:else}
              <ChevronUp class="w-3 h-3 ml-1.5 opacity-50" />
            {/if}
          </button>
        </th>
        <th scope="col" class="px-6 py-3">Статус</th>
        <th scope="col" class="px-6 py-3">Үйлдэл</th>
      </tr>
    </thead>
    <tbody>
      {#each menuItems as item (item.id)}
        <tr
          class="bg-white border-b hover:bg-gray-50 cursor-pointer transition-colors"
          class:bg-blue-50={selectedItems.has(item.id)}
          onclick={() => navigateToDetail(item.id)}
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <Input
                id="checkbox-table-{item.id}"
                type="checkbox"
                label=""
                checked={selectedItems.has(item.id)}
                onchange={(e: Event) => toggleSelectItem(item.id, e)}
              />
            </div>
          </td>
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          >
            {item.name}
          </th>
          <td class="px-6 py-4">
            {#if item.img_urls && item.img_urls.length > 0}
              <img
                class="w-10 h-10 rounded-md object-cover shadow-sm"
                src={item.img_urls[0]}
                alt={item.name}
                loading="lazy"
              />
            {:else}
              <div
                class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center"
              >
                <span class="text-gray-400 text-xs">Зураг</span>
              </div>
            {/if}
          </td>
          <td class="px-6 py-4">
            <div class="flex flex-wrap gap-1">
              {#each item.categories.slice(0, 2) as category}
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {category}
                </span>
              {/each}
              {#if item.categories.length > 2}
                <span class="text-gray-500 text-xs"
                  >+{item.categories.length - 2}</span
                >
              {/if}
            </div>
          </td>
          <td class="px-6 py-4 font-medium">{item.price.toLocaleString()}₮</td>
          <td class="px-6 py-4">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              class:bg-green-100={item.is_available}
              class:text-green-800={item.is_available}
              class:bg-red-100={!item.is_available}
              class:text-red-800={!item.is_available}
            >
              {item.is_available ? "Идэвхтэй" : "Идэвхгүй"}
            </span>
          </td>
          <td class="px-6 py-4">
            <Button
              onclick={(e: Event) => deleteMenuItem(item.id, e)}
              variant="tertiary"
              class="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
              title="Устгах"
            >
              <Trash2 class="w-5 h-5" />
            </Button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Delete Confirmation Dialog -->
<ConfirmDialog
  bind:open={showDeleteDialog}
  title="Хоол устгах"
  description={itemToDelete
    ? `"${itemToDelete.name}" хоолыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`
    : ""}
  confirmText={$deleteMenuItemMutation.isPending ? "Устгаж байна..." : "Устгах"}
  cancelText="Цуцлах"
  variant="destructive"
  loading={$deleteMenuItemMutation.isPending}
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>
