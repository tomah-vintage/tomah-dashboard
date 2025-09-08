<script lang="ts">
  import { getContext } from "svelte";
  
  const { isOpen } = getContext('select') || {};
</script>

{#if isOpen}
  <div class="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
    <div class="max-h-60 overflow-auto rounded-md py-1">
      <slot />
    </div>
  </div>
{/if}