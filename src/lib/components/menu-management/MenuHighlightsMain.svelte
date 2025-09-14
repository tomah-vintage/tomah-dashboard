<script lang="ts">
  import { Search, Sparkles, Save } from "@lucide/svelte";
  import MenuHighlightsList from "./MenuHighlightsList.svelte";
  import {
    createGetMenuItemsQuery,
    createUpdateEmphasizedMenuItemsMutation,
  } from "$lib/queries/menu-queries";
  import { useQueryClient } from '@tanstack/svelte-query';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Pagination } from "$lib/components/ui/pagination";
  import toast from "svelte-french-toast";

  let currentPage = 1;
  let page_size = 50;
  let showAll = false;
  let searchTerm = "";
  let selectedItems = new Set<number>();
  let hasChanges = false;

  $: effectivePageSize = showAll ? 1000 : page_size;
  $: menuItemsQuery = createGetMenuItemsQuery(currentPage, effectivePageSize, searchTerm);
  $: ({ data: paginatedData, isLoading, isError, error } = $menuItemsQuery);
  $: menuItems = paginatedData?.results || [];

  const updateEmphasizedMutation = createUpdateEmphasizedMenuItemsMutation();
  const queryClient = useQueryClient();

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function handleShowAll() {
    showAll = !showAll;
    currentPage = 1;
  }

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchTerm = target.value;
    currentPage = 1; // Reset to first page on search
  }

  function handleItemToggle(itemId: number, isEmphasized: boolean) {
    if (isEmphasized) {
      selectedItems.add(itemId);
    } else {
      selectedItems.delete(itemId);
    }
    selectedItems = new Set(selectedItems); // Trigger reactivity
    hasChanges = true;
  }

  function handleSaveChanges() {
    const menuItemIds = Array.from(selectedItems);

    $updateEmphasizedMutation.mutate(
      { menu_item_ids: menuItemIds },
      {
        onSuccess: () => {
          toast.success("Онцлох хоолнууд амжилттай хадгалагдлаа!");
          hasChanges = false;
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        },
        onError: (error: Error) => {
          toast.error(`Алдаа гарлаа: ${error?.message || "Тодорхойгүй алдаа"}`);
        },
      }
    );
  }

  // Initialize selected items when data loads
  $: if (menuItems.length > 0) {
    const currentlyEmphasized = menuItems
      .filter((item: any) => item.is_emphasized)
      .map((item: any) => item.id);

    if (selectedItems.size === 0) {
      selectedItems = new Set(currentlyEmphasized);
    }
  }
</script>

<div class="p-4 sm:p-6 bg-content-background">
  <div class="p-4 rounded-lg shadow bg-card-background sm:p-6">
    <div
      class="flex flex-col items-start justify-between mb-4 sm:flex-row sm:items-center"
    >
      <div class="flex items-center mb-4 sm:mb-0">
        <Sparkles class="w-6 h-6 mr-2 text-yellow-500" />
        <h1 class="text-xl font-bold text-gray-800">Онцлох хоолны цэс</h1>
      </div>
      <div class="flex items-center w-full space-x-2 sm:w-auto">
        <div class="relative flex-grow">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Хоол хайх..."
            class="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            oninput={handleSearchInput}
          />
        </div>
        <Button variant="secondary" onclick={handleShowAll}>
          {showAll ? "Хуудаслах" : "Бүгдийг харах"}
        </Button>
        <Button
          variant="primary"
          disabled={!hasChanges || $updateEmphasizedMutation.isPending}
          onclick={handleSaveChanges}
        >
          {#if $updateEmphasizedMutation.isPending}
            Хадгалж байна...
          {:else}
            <Save class="w-4 h-4 mr-2" />
            Хадгалах
          {/if}
        </Button>
      </div>
    </div>

    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <p class="text-sm text-blue-700">
          <Sparkles class="w-4 h-4 inline mr-1" />
          Онцлох хоолнууд нүүр хуудсанд тусгайлан харагдана. Сонгосон хоолнуудаа
          хадгалахыг бүү мартаарай.
        </p>
        {#if menuItems.length > 0}
          <div class="text-sm text-blue-600">
            <strong>{selectedItems.size}</strong> сонгогдсон /
            <strong>{menuItems.length}</strong>
            хоол
            {#if paginatedData?.count && paginatedData.count > menuItems.length && !showAll}
              (нийт {paginatedData.count})
            {/if}
          </div>
        {/if}
      </div>
    </div>

    {#if isLoading}
      <p class="text-center py-8">Ачааллаж байна...</p>
    {:else if isError}
      <p class="text-center py-8 text-red-600">
        Алдаа: {error?.message || "Тодорхойгүй алдаа"}
      </p>
    {:else if menuItems.length === 0}
      <p class="text-center py-8 text-gray-500">
        {searchTerm
          ? `"${searchTerm}" хайлтаар хоол олдсонгүй.`
          : "Хоолны цэс олдсонгүй."}
      </p>
    {:else}
      <MenuHighlightsList {menuItems} {selectedItems} {handleItemToggle} />
    {/if}
  </div>

  {#if !isLoading && !isError && paginatedData && !showAll}
    <Pagination
      {currentPage}
      totalPages={Math.ceil(paginatedData.count / effectivePageSize)}
      onPageChange={handlePageChange}
      totalItems={paginatedData.count}
      page_size={effectivePageSize}
    />
  {/if}
</div>
