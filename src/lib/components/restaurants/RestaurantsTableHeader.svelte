<script lang="ts">
  import { Search, Filter, Plus, Download } from "lucide-svelte";

  export let searchQuery = "";
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <div class="w-1 h-6 bg-primary-blue rounded-full"></div>
    <h1 class="text-xl font-bold">Ресторанууд</h1>
  </div>
  <div class="flex flex-wrap items-center gap-2 sm:gap-4">
    <div class="relative min-w-[200px]">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
      />
      <input
        type="text"
        placeholder="Хайх..."
        class="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        bind:value={searchQuery}
      />
    </div>
    <button
      class="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
    >
      <Filter class="h-5 w-5" />
      <span>Шүүлгүүр</span>
    </button>
    <a
      href="/restaurants/new"
      class="flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700"
    >
      <Plus class="h-5 w-5" />
      <span>Ресторан нэмэх</span>
    </a>
    <button
      class="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
    >
      <Download class="h-5 w-5" />
      <span>Export</span>
    </button>
  </div>
</div>
