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
		<label for="name" class="label">Name</label>
		<input type="text" id="name" bind:value={name} class="input input-bordered w-full" />
	</div>
	<div>
		<label for="category" class="label">Category</label>
		<input type="text" id="category" bind:value={category} class="input input-bordered w-full" />
	</div>
	<div>
		<label for="price" class="label">Price</label>
		<input type="number" id="price" bind:value={price} class="input input-bordered w-full" />
	</div>
	<div>
		<label for="description" class="label">Description</label>
		<textarea id="description" bind:value={description} class="textarea textarea-bordered w-full"></textarea>
	</div>
	<div class="flex justify-end space-x-2">
		<button type="button" class="btn" on:click={() => dispatch('close')}>Cancel</button>
		<button type="submit" class="btn btn-primary">Save</button>
	</div>
</form>