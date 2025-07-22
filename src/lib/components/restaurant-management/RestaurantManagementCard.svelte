<script lang="ts">
	import type { Restaurant } from '$lib/types/restaurant';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		edit: Restaurant;
		delete: string;
		view: Restaurant;
	}>();

	export let item: Restaurant;
</script>

<div class="card">
	<header class="card-header">
		<h3 class="h3">{item.name}</h3>
	</header>
	<section class="p-6">
		<p class="text-sm">{item.address}</p>
	</section>
	<footer class="card-footer flex justify-end gap-2">
		<button class="btn btn-sm variant-ghost" on:click={() => dispatch('view', item)}>View</button>
		<button class="btn btn-sm variant-ghost" on:click={() => dispatch('edit', item)}>Edit</button>
		<button class="btn btn-sm variant-filled-error" on:click={() => dispatch('delete', item.id)}>Delete</button>
	</footer>
</div>