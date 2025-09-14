<script lang="ts">
  import { getContext } from "svelte";
  
  export let placeholder = "Select...";
  
  const context = getContext('select') || {};
  const { value } = context;
</script>

{#if $value}
  <slot value={$value}>{$value}</slot>
{:else}
  {placeholder}
{/if}