<script lang="ts">
  import { Search } from "@lucide/svelte";

  export let placeholder = "Хайх...";
  export let value = "";
  export let disabled = false;
  export let size: 'sm' | 'md' | 'lg' = 'md';

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-48',
      input: 'py-1.5 pl-8 pr-3 text-sm',
      icon: 'w-3 h-3 left-2.5'
    },
    md: {
      container: 'w-64',
      input: 'py-2 pl-10 pr-4 text-sm',
      icon: 'w-4 h-4 left-3'
    },
    lg: {
      container: 'w-80',
      input: 'py-3 pl-12 pr-5 text-base',
      icon: 'w-5 h-5 left-4'
    }
  };

  $: config = sizeConfig[size];
</script>

<div class="relative {config.container}">
  <Search
    class="absolute {config.icon} text-gray-400 -translate-y-1/2 top-1/2"
  />
  <input
    type="text"
    {placeholder}
    {disabled}
    bind:value
    class="{config.input} w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
  />
</div>