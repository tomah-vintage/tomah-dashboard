<script lang="ts">
  export let images: string[] | undefined = [];
</script>

{#if images && images.length > 0}
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    {#each images as image, i (image)}
      <button
        class="w-full h-40 relative group focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg"
      >
        <img
          src={image}
          alt="Restaurant gallery image {i + 1}"
          class="w-full h-full object-cover rounded-lg shadow-md"
        />
      </button>
    {/each}
  </div>
{:else}
  <div
    class="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300"
  >
    <p class="text-gray-500">Зураг оруулаагүй байна.</p>
  </div>
{/if}
