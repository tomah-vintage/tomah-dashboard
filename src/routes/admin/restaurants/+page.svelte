<script lang="ts">
	import type { PageData } from './$types';
	import { RestaurantManagementMain } from '$lib/components/restaurant-management';

	export let data: PageData;
</script>

<svelte:head>
	<title>Restaurant Management | Tomah</title>
	<meta name="description" content="Manage restaurants in the system." />
</svelte:head>

<!-- Page container for consistent layout, padding, and max-width -->
<div class="w-full p-4 md:p-6 lg:p-8">
	<div class="max-w-7xl mx-auto">
		{#if data.items}
			<RestaurantManagementMain items={data.items} />
		{/if}
	</div>
</div>