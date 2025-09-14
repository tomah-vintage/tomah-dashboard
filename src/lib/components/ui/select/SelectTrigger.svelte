<script lang="ts">
  import { getContext } from "svelte";
  import { ChevronDown } from "@lucide/svelte";

  export let class_ = "";
  
  const context = getContext('select') || {};
  const { isOpen, toggleOpen } = context;
</script>

<button
  type="button"
  class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {class_}"
  on:click={toggleOpen}
>
  <span class="block truncate">
    <slot />
  </span>
  <ChevronDown class="h-4 w-4 text-gray-400 {$isOpen ? 'rotate-180' : ''} transition-transform" />
</button>