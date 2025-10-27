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
  import { debounce } from "$lib/utils/debounce";

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

  // Debounced search to avoid too many API calls
  const debouncedSearch = debounce((term: string) => {
    searchTerm = term;
    currentPage = 1; // Reset to first page when searching
  }, 300);

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

  // Event handlers
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    debouncedSearch(target.value);
  }

  function toggleFilter() {
    showFilters = !showFilters;
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
    console.log('Export menu items');
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

<div class="p-4 sm:p-6 bg-content-background">
  <div class="p-4 rounded-lg shadow bg-card-background sm:p-6">
    <!-- Header with Search, Filters, and Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <SearchAndFilters
        bind:searchTerm
        bind:showFilters
        bind:selectedCategories
        bind:availabilityFilter
        {categories}
        {hasActiveFilters}
        onSearchInput={handleSearchInput}
        onToggleFilter={toggleFilter}
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
    <Pagination
      {currentPage}
      totalPages={Math.ceil(paginatedData.count / page_size)}
      onPageChange={handlePageChange}
      totalItems={paginatedData.count}
      {page_size}
    />
  {/if}
</div>
