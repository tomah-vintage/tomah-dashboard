<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { RefreshCw } from "@lucide/svelte";

  export let totalCount: number;
  export let isLoading: boolean;
  export let onRefresh: () => void;
</script>

<div class="bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Захиалгын удирдлага</h1>
        <p class="mt-1 text-sm text-gray-500">
          Рестораны бүх захиалгыг харах, удирдах
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center text-sm text-gray-600">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Нийт захиалга: {totalCount}</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          on:click={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          Шинэчлэх
        </Button>
      </div>
    </div>
  </div>
</div>