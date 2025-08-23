<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import { UploadCloud } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';

	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
		if (target.files) {
			dispatch('select', { files: Array.from(target.files) });
		} else {
			dispatch('select', { files: [] });
		}
	}

</script>

<div class="w-full">
    <label for="image-upload" class="cursor-pointer w-full h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
        <p class="text-lg text-gray-500 mb-4">Та бүтээгдэхүүний зураг оруулна уу</p>
        <UploadCloud class="w-12 h-12 text-gray-400 mb-4" />
        <Button type="button" variant="secondary">Зураг татах</Button>
    </label>
    <input type="file" name="image" id="image-upload" class="hidden" accept="image/*" multiple on:change={handleChange} />
</div>