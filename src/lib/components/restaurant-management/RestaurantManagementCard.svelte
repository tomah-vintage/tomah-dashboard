<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Restaurant } from '$lib/types/restaurant';

	export let item: Restaurant;

	const dispatch = createEventDispatcher();
</script>

<div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
	<div class="card-body p-0">
		<h3 class="text-xl font-bold text-[#2C2C2C] mb-2">{item.name}</h3>
		<p class="text-gray-700 mb-1">{item.address}</p>
		<p class="text-gray-700 mb-1">Phone: {item.phone}</p>
		<p class="text-gray-700 mb-4">Email: {item.email}</p>
		<div class="flex justify-end space-x-2">
			<button class="bg-white text-[#2C2C2C] border border-[#2C2C2C] rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200" on:click={() => dispatch('edit', item)}>Edit</button>
			<button class="bg-[#F44336] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#D32F2F] transition-colors duration-200" on:click={() => dispatch('delete', item.id)}>Delete</button>
		</div>
	</div>
</div>