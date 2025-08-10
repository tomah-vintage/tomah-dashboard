<script lang="ts">
  import type { PageData } from './$types';
  import { SeatingAreaMain } from '$lib/components/seating-area-control';

  export let data: PageData;
</script>

<svelte:head>
  <title>Seating Area Control</title>
  <meta name="description" content="Manage your restaurant's tables and QR codes." />
</svelte:head>

<div class="p-4 md:p-8">
  <h1 class="text-2xl font-bold mb-4">Seating Area Control</h1>
  <SeatingAreaMain data={data} />
</div>

<style>
  @media print {
    :global(body > *:not(.print-area)) {
      display: none;
    }
    .print-area {
      display: block;
    }
  }
</style>
