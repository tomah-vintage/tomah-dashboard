<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let files: FileList;
	let previewUrl: string | null = null;

	const dispatch = createEventDispatcher();

	function handleChange() {
		if (files && files[0]) {
			const file = files[0];
			previewUrl = URL.createObjectURL(file);
			dispatch('select', { file });
		} else {
			previewUrl = null;
			dispatch('select', { file: null });
		}
	}

	export function clear() {
		const input = document.querySelector('#image-upload') as HTMLInputElement;
		if(input) input.value = '';
		previewUrl = null;
		dispatch('select', { file: null });
	}

	$: if(files) handleChange();
</script>

<label for="image-upload" class="cursor-pointer w-56 h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center p-8 text-center aspect-square bg-gray-50 hover:bg-gray-100 transition-colors">
	{#if previewUrl}
		<img src={previewUrl} alt="Image preview" class="w-full h-full object-cover rounded-md" on:load={() => URL.revokeObjectURL(previewUrl)} />
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
			<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
		</svg>
		<p class="mt-4 text-gray-500">Зураг татах</p>
	{/if}
</label>

<input type="file" name="image" id="image-upload" class="hidden" accept="image/*" bind:files on:change={handleChange} />