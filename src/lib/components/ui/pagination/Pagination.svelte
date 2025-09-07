<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let onPageChange: (page: number) => void;
  export let totalItems: number;
  export let page_size: number;

  $: pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }
</script>

<div class="flex items-center justify-between px-4 py-3 sm:px-6">
  <div class="flex flex-1 justify-between sm:hidden">
    <button
      type="button"
      on:click={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Өмнөх
    </button>
    <button
      type="button"
      on:click={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Дараах
    </button>
  </div>
  <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    <div>
      <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Харуулж байна <span class="font-semibold text-gray-900 dark:text-white"
          >{(currentPage - 1) * page_size + 1}- {Math.min(currentPage * page_size, totalItems)}</span
        >
        нийт
        <span class="font-semibold text-gray-900 dark:text-white"
          >{totalItems}</span
        >
      </p>
    </div>
    <div>
      <ul class="inline-flex -space-x-px text-sm h-8">
        <li>
          <button
            type="button"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            on:click={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Өмнөх
          </button>
        </li>
        {#each pages as page (page)}
          <li>
            <button
              type="button"
              class="flex items-center justify-center px-3 h-8 {page === currentPage ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}"
              on:click={() => goToPage(page)}
            >
              {page}
            </button>
          </li>
        {/each}
        <li>
          <button
            type="button"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            on:click={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Дараах
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>