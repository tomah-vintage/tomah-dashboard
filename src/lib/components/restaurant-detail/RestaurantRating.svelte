<script lang="ts">
  export let rating: number | undefined = undefined;
</script>

<div class="text-center">
  {#if rating}
    <div class="bg-blue-50 px-4 py-2 rounded-lg">
      <div class="text-2xl font-bold text-blue-600">
        {rating}
      </div>
      <div class="text-sm text-blue-600">Үнэлгээ</div>
    </div>
  {:else}
    <div class="bg-gray-100 px-4 py-2 rounded-lg">
      <div class="text-lg font-medium text-gray-500">
        Үнэлгээ байхгүй
      </div>
    </div>
  {/if}
</div>