<script lang="ts">
  export let for_: string | undefined = undefined;
</script>

<label for={for_} class="block text-sm font-medium text-gray-700 mb-1">
  <slot />
</label>