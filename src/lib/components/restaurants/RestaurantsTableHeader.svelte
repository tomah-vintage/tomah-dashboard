<script lang="ts">
  import { Search, Filter, Plus, Download } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

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
      <Input
        type="text"
        placeholder="Хайх..."
        class="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        bind:value={searchQuery}
        label=""
      />
    </div>
    <Button variant="secondary">
      <Filter class="h-5 w-5" />
      <span>Шүүлгүүр</span>
    </Button>
    <Button href="/restaurants/new">
      <Plus class="h-5 w-5" />
      <span>Ресторан нэмэх</span>
    </Button>
    <Button variant="secondary">
      <Download class="h-5 w-5" />
      <span>Экспорт</span>
    </Button>
  </div>
</div>