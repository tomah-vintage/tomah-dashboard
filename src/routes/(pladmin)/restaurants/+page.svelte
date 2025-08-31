<script lang="ts">
	import { createGetRestaurantsQuery } from '$lib/queries/restaurant-queries';
	import {
		RestaurantsTableHeader,
		RestaurantsTable,
		RestaurantsTableSkeleton
	} from '$lib/components/restaurants';
	import type { PaginatedResponse } from '$lib/types/auth';
	import type { Restaurant } from '$lib/types/restaurant';
	import { Pagination } from '$lib/components/ui/pagination';

	let currentPage = 1;
	let page_size = 10;

	$: getRestaurants = createGetRestaurantsQuery(currentPage, page_size);

	$: ({ data: paginatedData, isLoading, isError, error } = $getRestaurants);

	$: restaurants = paginatedData?.results || [];

	let searchQuery = '';

	$: filteredRestaurants = restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

	function handlePageChange(page: number) {
		currentPage = page;
	}
</script>

<svelte:head>
	<title>Ресторанууд | Qpick</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
	<div class="bg-card-background rounded-lg shadow-md p-4 sm:p-6 space-y-6">
		<RestaurantsTableHeader bind:searchQuery={searchQuery} />

		{#if isLoading}
			<RestaurantsTableSkeleton />
		{:else if isError}
			<div class="text-center py-10">
				<p class="text-status-error">Алдаа гарлаа: {error?.message || 'Тодорхойгүй алдаа'}</p>
			</div>
		{:else if filteredRestaurants.length === 0}
			<div class="text-center py-10">
				<p>Ресторан олдсонгүй.</p>
			</div>
		{:else}
			<RestaurantsTable restaurants={filteredRestaurants} />
		{/if}
	</div>

	{#if !isLoading && !isError && paginatedData}
		<Pagination
			currentPage={currentPage}
			totalPages={Math.ceil(paginatedData.count / page_size)}
			onPageChange={handlePageChange}
			totalItems={paginatedData.count}
			page_size={page_size}
		/>
	{/if}
</div>