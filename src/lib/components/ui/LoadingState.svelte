<script lang="ts">
  export let message: string = 'Ачааллаж байна...';
  export let containerClass: string = 'bg-white rounded-lg border border-gray-200 p-8';
</script>

<div class={containerClass}>
  <div class="flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
    <span class="ml-3 text-gray-600">{message}</span>
  </div>
</div>