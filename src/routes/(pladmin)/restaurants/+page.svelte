<script lang="ts">
	import { createGetRestaurantsQuery } from '$lib/queries/restaurant-queries';
	import {
		RestaurantsTableHeader,
		RestaurantsTable,
		RestaurantsTablePagination,
		RestaurantsTableSkeleton
	} from '$lib/components/restaurants';

	const getRestaurants = createGetRestaurantsQuery();

	$: ({ data: restaurants, isLoading, isError, error } = $getRestaurants);

	let searchQuery = '';

	$: filteredRestaurants = restaurants ? restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

</script>

<svelte:head>
	<title>Ресторанууд | Tomah</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-content-background min-h-screen font-sans text-gray-800">
	<div class="bg-card-background rounded-lg shadow-md p-4 sm:p-6 space-y-6">
		<RestaurantsTableHeader bind:searchQuery={searchQuery} />

		{#if isLoading}
			<RestaurantsTableSkeleton />
		{:else if isError}
			<div class="text-center py-10">
				<p class="text-status-error">Алдаа гарлаа: {error.message}</p>
			</div>
		{:else if filteredRestaurants.length === 0}
			<div class="text-center py-10">
				<p>Ресторан олдсонгүй.</p>
			</div>
		{:else}
			<RestaurantsTable restaurants={filteredRestaurants} />
		{/if}
	</div>

	{#if !isLoading && !isError && filteredRestaurants.length > 0}
		<RestaurantsTablePagination />
	{/if}
</div>