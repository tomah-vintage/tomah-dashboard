<script lang="ts">
  export let value = "";
  export let placeholder = "";
  export let rows = 3;
  export let disabled = false;
  export let readonly = false;
  export let id = "";
  export let name = "";
  export let required = false;
</script>

<textarea
  {id}
  {name}
  {placeholder}
  {rows}
  {disabled}
  {readonly}
  {required}
  bind:value
  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
  {...$$restProps}
  on:input
  on:change
  on:focus
  on:blur
></textarea>