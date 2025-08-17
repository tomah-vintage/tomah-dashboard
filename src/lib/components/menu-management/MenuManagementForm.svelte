<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let name = '';
	let category = '';
	let price = 0;
	let description = '';

	function handleSubmit() {
		// Handle form submission
		dispatch('close');
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
		<input type="text" id="name" bind:value={name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
		<input type="text" id="category" bind:value={category} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price</label>
		<input type="number" id="price" bind:value={price} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue" />
	</div>
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
		<textarea id="description" bind:value={description} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"></textarea>
	</div>
	<div class="flex justify-end space-x-2">
		<button type="button" class="bg-white text-black border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-100 transition-colors duration-200" on:click={() => dispatch('close')}>Cancel</button>
		<button type="submit" class="bg-primary-blue text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors duration-200">Save</button>
	</div>
</form>