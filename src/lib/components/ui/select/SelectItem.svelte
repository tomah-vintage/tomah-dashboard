<script lang="ts">
  import { getContext } from "svelte";
  
  export let value: string;
  
  const { handleValueChange, value: selectedValue } = getContext('select') || {};
  
  function handleClick() {
    handleValueChange?.(value);
  }
  
  $: isSelected = selectedValue === value;
</script>

<button
  type="button"
  class="relative w-full cursor-pointer select-none px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none {isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}"
  on:click={handleClick}
>
  <slot />
  {#if isSelected}
    <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
      <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </span>
  {/if}
</button>