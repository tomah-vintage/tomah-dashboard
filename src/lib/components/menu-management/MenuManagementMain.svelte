<script lang="ts">
  import MenuManagementList from "./MenuManagementList.svelte";
  import MenuCardView from "./MenuCardView.svelte";
  import MenuTableSkeleton from "./MenuTableSkeleton.svelte";
  import SearchAndFilters from "./SearchAndFilters.svelte";
  import ActionButtons from "./ActionButtons.svelte";
  import EmptyState from "./EmptyState.svelte";
  import ErrorState from "./ErrorState.svelte";
  import { createGetMenuItemsQuery, createGetCategoriesQuery } from "$lib/queries/menu-queries";
  import { Pagination } from "$lib/components/ui/pagination";

  let currentPage = $state(1);
  let page_size = $state(10);
  let searchTerm = $state("");
  let showFilters = $state(false);
  let selectedCategories = $state<string[]>([]);
  let availabilityFilter = $state<string>("all"); // all, available, unavailable
  let viewMode = $state<'table' | 'grid'>('table');
  let isMobile = $state(false);
  let sortColumn = $state<string | null>(null);
  let sortDirection = $state<'asc' | 'desc'>('asc');

  // Reset to first page when search term changes
  $effect(() => {
    if (searchTerm !== undefined) {
      currentPage = 1;
    }
  });

  const categoriesQuery = $derived(createGetCategoriesQuery());
  const categories = $derived($categoriesQuery.data || []);

  const menuItemsQuery = $derived(createGetMenuItemsQuery(currentPage, page_size, searchTerm || undefined));

  const { data: paginatedData, isLoading, isError, error } = $derived($menuItemsQuery);

  const menuItems = $derived(paginatedData?.results || []);

  // Client-side filtering and sorting
  function getFilteredMenuItems() {
    let filtered = menuItems.filter(item => {
      let matchesCategory = selectedCategories.length === 0 || 
        item.categories.some((cat: string) => selectedCategories.includes(cat));
      
      let matchesAvailability = availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.is_available) ||
        (availabilityFilter === "unavailable" && !item.is_available);
      
      return matchesCategory && matchesAvailability;
    });

    // Apply sorting
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (sortColumn) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          default:
            return 0;
        }
        
        let comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }
    
    return filtered;
  }

  const filteredMenuItems = $derived(getFilteredMenuItems());

  function handlePageChange(page: number) {
    currentPage = page;
  }

  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter(c => c !== category);
    } else {
      selectedCategories = [...selectedCategories, category];
    }
  }

  function clearFilters() {
    selectedCategories = [];
    availabilityFilter = "all";
    searchTerm = "";
  }

  function handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    const { column, direction } = event;
    sortColumn = column;
    sortDirection = direction;
  }

  function handleViewModeChange(mode: 'table' | 'grid') {
    viewMode = mode;
  }

  function handleExport() {
    // TODO: Implement export functionality
    console.log('Цэсний зүйлсийг экспортлох');
  }

  function handleRetry() {
    // Invalidate and refetch the queries
    $menuItemsQuery.refetch?.();
    $categoriesQuery.refetch?.();
  }

  const hasActiveFilters = $derived(selectedCategories.length > 0 || availabilityFilter !== "all" || searchTerm.length > 0);

  // Check if mobile and auto-switch to grid view
  function checkMobile() {
    isMobile = window.innerWidth < 640; // sm breakpoint
    if (isMobile && viewMode === 'table') {
      viewMode = 'grid';
    }
  }

  // Initialize mobile check
  if (typeof window !== 'undefined') {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-gray-900">Цэсний удирдлага</h1>
        <p class="mt-1 text-sm text-gray-500">Рестораны цэсний бүтээгдэхүүнүүдийг удирдах хэсэг</p>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Title -->
      <h1 class="mb-4 text-xl font-bold text-gray-800">Хоолны жагсаалт</h1>

      <!-- Search, Filters, and Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SearchAndFilters
          bind:searchTerm
          bind:showFilters
          bind:selectedCategories
          bind:availabilityFilter
          {categories}
          {hasActiveFilters}
          onToggleCategory={toggleCategory}
          onClearFilters={clearFilters}
        />

        <ActionButtons
          bind:viewMode
          onViewModeChange={handleViewModeChange}
          onExport={handleExport}
        />
      </div>

      <!-- Content Display -->
      {#if isLoading}
        <MenuTableSkeleton />
      {:else if isError}
        <ErrorState {error} onRetry={handleRetry} />
      {:else if menuItems.length === 0}
        <EmptyState type="no-items" />
      {:else if filteredMenuItems.length === 0}
        <EmptyState type="no-results" onClearFilters={clearFilters} />
      {:else}
        {#if (viewMode === 'table' && !isMobile)}
          <MenuManagementList menuItems={filteredMenuItems} onsort={handleSort} />
        {:else}
          <MenuCardView menuItems={filteredMenuItems} />
        {/if}
      {/if}
    </div>

    {#if !isLoading && !isError && paginatedData}
      <div class="mt-6">
        <Pagination
          {currentPage}
          totalPages={Math.ceil(paginatedData.count / page_size)}
          onPageChange={handlePageChange}
          totalItems={paginatedData.count}
          {page_size}
        />
      </div>
    {/if}
  </div>
</div>
