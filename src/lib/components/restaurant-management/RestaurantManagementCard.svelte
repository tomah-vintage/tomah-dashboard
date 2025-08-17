<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	export let item: Restaurant;
</script>

<a
	href="/restaurants/{item.id}"
	class="block bg-card-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
>
	<div class="flex items-center">
		{#if item.logo}
			<img
				src={item.logo}
				alt="{item.name} Logo"
				class="w-16 h-16 rounded-lg object-cover mr-4"
			/>
		{/if}
		<div class="flex-grow">
			<h3 class="text-xl font-bold text-gray-800">{item.name}</h3>
			<p class="text-gray-500">{item.address}</p>
		</div>
	</div>
</a>
