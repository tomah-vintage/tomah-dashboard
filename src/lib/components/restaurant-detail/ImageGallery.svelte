<script lang="ts">
	export let images: string[] | undefined = [];
</script>

{#if images && images.length > 0}
	<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
		{#each images as image, i}
			<button class="w-full h-40 relative group focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg">
				<img
					src={image}
					alt="Restaurant gallery image {i + 1}"
					class="w-full h-full object-cover rounded-lg shadow-md"
				/>
				<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
				</div>
			</button>
		{/each}
	</div>
{:else}
	<div class="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
		<p class="text-gray-500">No images have been uploaded.</p>
	</div>
{/if}
