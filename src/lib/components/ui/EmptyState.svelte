<script lang="ts">
  import type { ComponentType } from "svelte";

  export let icon: ComponentType;
  export let title: string;
  export let description: string;
</script>

<div class="text-center py-12">
  <svelte:component this={icon} class="w-16 h-16 mx-auto text-gray-300 mb-4" />
  <h3 class="text-lg font-medium text-gray-900 mb-2">{title}</h3>
  <p class="text-gray-500">{description}</p>
</div>