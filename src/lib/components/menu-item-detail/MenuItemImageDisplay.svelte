<script lang="ts">
  export let imageUrl: string | undefined;
</script>

<div class="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
  {#if imageUrl}
    <img src={imageUrl} alt="Menu Item" class="w-full h-full object-cover" />
  {:else}
    <span class="text-gray-500">Зураг байхгүй</span>
  {/if}
</div>
