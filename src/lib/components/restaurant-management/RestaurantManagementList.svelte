<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantManagementCard from './RestaurantManagementCard.svelte';

	export let items: Restaurant[] = [];
	export let emptyMessage = 'No restaurants found. Add one to get started!';
</script>

<div class="restaurant-list">
	{#if items.length === 0}
		<div class="card p-10 text-center">
			<p>{emptyMessage}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each items as item (item.id)}
				<RestaurantManagementCard {item} on:edit on:delete on:view />
			{/each}
		</div>
	{/if}
</div>