<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { generatePageNumbers } from "$lib/utils/pagination";

  export let currentPage: number;
  export let totalPages: number;
  export let totalCount: number;
  export let hasNext: boolean = false;
  export let hasPrevious: boolean = false;
  export let onPageChange: (page: number) => void;

  $: pageNumbers = generatePageNumbers(currentPage, totalPages);
</script>

<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
  <div class="flex items-center justify-between">
    <div class="text-sm text-gray-700">
      {currentPage}/{totalPages} хуудас ({totalCount} нийт захиалга)
    </div>
    <div class="flex space-x-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrevious}
        on:click={() => onPageChange(currentPage - 1)}
      >
        Өмнөх
      </Button>
      {#each pageNumbers as pageNum}
        <Button
          variant={pageNum === currentPage ? "primary" : "secondary"}
          size="sm"
          on:click={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      {/each}
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNext}
        on:click={() => onPageChange(currentPage + 1)}
      >
        Дараах
      </Button>
    </div>
  </div>
</div>