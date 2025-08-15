<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Restaurant } from '$lib/types/restaurant';

	export let item: Restaurant;

	const dispatch = createEventDispatcher();
</script>

<div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
	<div class="card-body p-0">
		<h3 class="text-xl font-bold text-[#2C2C2C] mb-2">{item.name}</h3>
		<p class="text-gray-700 text-sm mb-1">ID: {item.id}</p>
		{#if item.logo}
			<img src={item.logo} alt="Restaurant Logo" class="w-24 h-24 object-cover rounded-full mb-2" />
		{/if}
		<p class="text-gray-700 mb-1">Address: {item.address}</p>
		{#if item.restaurant_img_urls && item.restaurant_img_urls.length > 0}
			<img src={item.restaurant_img_urls[0]} alt="Restaurant Image" class="w-full h-32 object-cover rounded-md mb-2" />
		{/if}
		<p class="text-gray-700 text-sm mb-1">Created At: {new Date(item.created_at).toLocaleString()}</p>
		<p class="text-gray-700 text-sm mb-4">Updated At: {new Date(item.updated_at).toLocaleString()}</p>
		<p class="text-gray-700 text-sm mb-4">User ID: {item.user}</p>
		<div class="flex justify-end space-x-2">
			<button class="bg-white text-[#2C2C2C] border border-[#2C2C2C] rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200" on:click={() => dispatch('edit', item)}>Edit</button>
			<button class="bg-[#F44336] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#D32F2F] transition-colors duration-200" on:click={() => dispatch('delete', item.id)}>Delete</button>
		</div>
	</div>
</div>