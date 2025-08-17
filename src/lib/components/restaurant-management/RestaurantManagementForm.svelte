<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

	export let restaurant: Restaurant | null = null;

	const dispatch = createEventDispatcher<{ submit: RestaurantFormData; close: void }>();

	let name: string = restaurant?.name || '';
	let address: string = restaurant?.address || '';
	let phone: string = restaurant?.phone || '';
	let email: string = restaurant?.email || '';

	function handleSubmit() {
		dispatch('submit', { name, address, phone, email });
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
		<input type="text" id="name" bind:value={name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
		<input type="text" id="address" bind:value={address} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
		<input type="text" id="phone" bind:value={phone} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
		<input type="email" id="email" bind:value={email} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div class="flex justify-end space-x-4 mt-6">
		<button type="button" class="bg-white text-black border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-100 transition-colors duration-200" on:click={() => dispatch('close')}>Cancel</button>
		<button type="submit" class="bg-primary-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-200">Save</button>
	</div>
</form>