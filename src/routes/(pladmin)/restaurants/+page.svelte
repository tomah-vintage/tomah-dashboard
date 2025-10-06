<script lang="ts">
	import { createGetAdminRestaurantsQuery } from '$lib/queries/restaurant-queries';
	import {
		RestaurantsTableHeader,
		RestaurantsTable,
		RestaurantsTableSkeleton
	} from '$lib/components/restaurants';
	  import { Pagination } from '$lib/components/ui/pagination';
  import { base } from "$app/paths";

	let currentPage = 1;
	let page_size = 10;

	$: getRestaurants = createGetAdminRestaurantsQuery(currentPage, page_size);

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
			<div class="text-center py-16">
				<div class="flex flex-col items-center space-y-4">
					{#if searchQuery}
						<!-- Search no results -->
						<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<div class="space-y-2">
							<h3 class="text-lg font-semibold text-gray-700">Хайлтын үр дүн олдсонгүй</h3>
							<p class="text-gray-500">"{searchQuery}" хайлтад тохирох ресторан байхгүй байна.</p>
							<button 
								class="text-blue-600 hover:text-blue-700 text-sm font-medium"
								on:click={() => searchQuery = ''}
							>
								Хайлтыг арилгах
							</button>
						</div>
					{:else}
						<!-- Empty state -->
						<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<div class="space-y-2">
							<h3 class="text-lg font-semibold text-gray-700">Ресторан байхгүй байна</h3>
							<p class="text-gray-500">Эхний ресторангаа нэмж эхлээрэй.</p>
						</div>
						<a 
							href="{base}/restaurants/new" 
							class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
						>
							Шинэ ресторан нэмэх
						</a>
					{/if}
				</div>
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