<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantManagementCard from './RestaurantManagementCard.svelte';
	import SkeletonCard from './SkeletonCard.svelte';

	export let items: Restaurant[] = [];
	export let loading = false;
	export let emptyMessage = 'No restaurants found. Add one to get started!';

	const dispatch = createEventDispatcher();

	function handleEdit(event: CustomEvent<Restaurant>) {
		dispatch('edit', event.detail);
	}

	function handleDelete(event: CustomEvent<string>) {
		dispatch('delete', event.detail);
	}
</script>

<div class="restaurant-list">
	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<SkeletonCard />
			{/each}
		</div>
	{:else if items.length === 0}
		<div class="card p-10 text-center">
			<p>{emptyMessage}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each items as item (item.id)}
				<RestaurantManagementCard {item} on:edit={handleEdit} on:delete={handleDelete} on:view />
			{/each}
		</div>
	{/if}
</div>