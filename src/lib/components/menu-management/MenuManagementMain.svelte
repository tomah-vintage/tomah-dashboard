<script lang="ts">
  import { Search, Filter, Plus, FileDown } from "@lucide/svelte";
  import MenuManagementList from "./MenuManagementList.svelte";
  import { createGetMenuItemsQuery } from "$lib/queries/menu-queries";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Pagination } from "$lib/components/ui/pagination";

  let currentPage = 1;
  let page_size = 10;

  $: menuItemsQuery = createGetMenuItemsQuery(currentPage, page_size);

  $: ({ data: paginatedData, isLoading, isError, error } = $menuItemsQuery);

  $: menuItems = paginatedData?.results || [];

  function handlePageChange(page: number) {
    currentPage = page;
  }
</script>

<div class="p-4 sm:p-6 bg-content-background">
  <div class="p-4 rounded-lg shadow bg-card-background sm:p-6">
    <div
      class="flex flex-col items-start justify-between mb-4 sm:flex-row sm:items-center"
    >
      <h1 class="mb-4 text-xl font-bold text-gray-800 sm:mb-0">
        Хоолны жагсаалт
      </h1>
      <div class="flex items-center w-full space-x-2 sm:w-auto">
        <div class="relative flex-grow">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Хайх..."
            class="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>
        <Button variant="secondary">
          <Filter class="w-4 h-4" />
          <span>Шүүх</span>
        </Button>
        <Button href="/menu/new">
          <Plus class="w-4 h-4" />
          <span>Хоол нэмэх</span>
        </Button>
        <Button variant="tertiary">
          <FileDown class="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
    {#if isLoading}
      <p>Loading...</p>
    {:else if isError}
      <p>Алдаа: {error?.message || "Тодорхойгүй алдаа"}</p>
    {:else if menuItems.length === 0}
      <p>Хоолны цэс олдсонгүй.</p>
    {:else}
      <MenuManagementList {menuItems} />
    {/if}
  </div>

  {#if !isLoading && !isError && paginatedData}
    <Pagination
      {currentPage}
      totalPages={Math.ceil(paginatedData.count / page_size)}
      onPageChange={handlePageChange}
      totalItems={paginatedData.count}
      {page_size}
    />
  {/if}
</div>
