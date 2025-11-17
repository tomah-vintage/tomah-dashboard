<script lang="ts">
  import CircularLoader from "./CircularLoader.svelte";

  export let message: string = "Ачааллаж байна...";
  export let containerClass: string =
    "bg-white rounded-lg border border-gray-200 p-8";
</script>

<div class={containerClass}>
  <div class="flex items-center justify-center">
    <CircularLoader size="md" color="primary" />
    <span class="ml-3 text-gray-600">{message}</span>
  </div>
</div>
