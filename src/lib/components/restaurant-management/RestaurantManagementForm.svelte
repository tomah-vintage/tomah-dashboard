<script lang="ts">
	import type { RestaurantFormData } from '$lib/types/restaurant';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: RestaurantFormData;
		cancel: void;
	}>();

	export let initialData: Partial<RestaurantFormData> = {};
	export let isEditing = false;

	let formData: RestaurantFormData = {
		name: '',
		address: '',
		...initialData
	};

	let errors: Record<string, string | undefined> = {};

	// Zod validation will be implemented here later
	const handleSubmit = () => {
		// if (validation passes)
		dispatch('submit', formData);
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<div>
		<label for="name" class="label">Restaurant Name</label>
		<input id="name" name="name" type="text" class="input" bind:value={formData.name} />
	</div>

	<div>
		<label for="address" class="label">Address</label>
		<textarea id="address" name="address" class="textarea" bind:value={formData.address} />
	</div>

	<footer class="flex justify-end gap-2 pt-4">
		<button type="button" class="btn variant-ghost" on:click={() => dispatch('cancel')}>Cancel</button>
		<button type="submit" class="btn variant-filled-primary">{isEditing ? 'Update' : 'Create'}</button>
	</footer>
</form>