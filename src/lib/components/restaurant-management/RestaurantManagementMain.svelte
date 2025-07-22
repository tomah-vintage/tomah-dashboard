<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import RestaurantManagementList from './RestaurantManagementList.svelte';

	export let items: Restaurant[] = [];
	export let loading = false;
	export let error: string | null = null;
</script>

<div class="restaurant-management-main">
	<!-- Header aligned with design guidelines: improved spacing and added subheading -->
	<header class="mb-8">
		<div class="flex justify-between items-start">
			<div>
				<h1 class="h1">Restaurant Management</h1>
				<p class="text-base text-surface-500">Add, edit, and manage all restaurants in the system.</p>
			</div>
			<button class="btn variant-filled-primary">Add New Restaurant</button>
		</div>
	</header>

	<main>
		{#if loading}
			<div class="loading-spinner" />
		{:else if error}
			<div class="alert variant-filled-error">{error}</div>
		{:else}
			<RestaurantManagementList {items} />
		{/if}
	</main>
</div>