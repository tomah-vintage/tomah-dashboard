<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { stats, restaurants } = data;
</script>

<svelte:head>
	<title>Dashboard | Tomah</title>
	<meta name="description" content="Admin dashboard with key statistics and restaurant list." />
</svelte:head>

<div class="w-full p-6 font-sans min-h-screen">
	<div class="max-w-7xl mx-auto space-y-8">
		<h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

		<!-- Statistics Cards -->
		<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="rounded-lg bg-card-background p-6 shadow-md">
				<h2 class="text-lg font-medium text-gray-800">Total Restaurants</h2>
				<p class="text-4xl font-bold text-primary-blue mt-2">{stats.totalRestaurants}</p>
			</div>
			<div class="rounded-lg bg-card-background p-6 shadow-md">
				<h2 class="text-lg font-medium text-gray-800">Active Restaurants</h2>
				<p class="text-4xl font-bold text-status-success mt-2">{stats.activeRestaurants}</p>
			</div>
			<div class="rounded-lg bg-card-background p-6 shadow-md">
				<h2 class="text-lg font-medium text-gray-800">Disabled Restaurants</h2>
				<p class="text-4xl font-bold text-status-error mt-2">{stats.disabledRestaurants}</p>
			</div>
			<div class="rounded-lg bg-card-background p-6 shadow-md">
				<h2 class="text-lg font-medium text-gray-800">New Orders Today</h2>
				<p class="text-4xl font-bold text-primary-blue mt-2">{stats.newOrdersToday}</p>
			</div>
		</section>

		<!-- Restaurant List -->
		<section class="rounded-lg bg-card-background p-6 shadow-md">
			<h2 class="text-2xl font-bold text-gray-800 mb-4">Registered Restaurants</h2>
			{#if restaurants.length > 0}
				<ul class="space-y-3">
					{#each restaurants as restaurant (restaurant.id)}
						<li class="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0">
							<div>
								<p class="text-lg font-medium text-gray-800">{restaurant.name}</p>
								<p class="text-sm text-gray-600">{restaurant.address}</p>
							</div>
							<button
								class="rounded-md bg-primary-blue px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-opacity-50"
								>View Details</button
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-800">No restaurants registered yet.</p>
			{/if}
		</section>
	</div>
</div>