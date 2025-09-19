<script lang="ts">
  export let title: string = 'Алдаа гарлаа';
  export let message: string;
  export let containerClass: string = 'bg-white rounded-lg border border-red-200 p-6';
</script>

<div class={containerClass}>
  <div class="text-center">
    <p class="text-red-600 font-medium">{title}</p>
    <p class="text-red-500 text-sm mt-1">{message}</p>
  </div>
</div>