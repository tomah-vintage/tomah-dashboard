<script lang="ts">
  import { AlertCircle, RefreshCw } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  let { 
    error,
    onRetry
  } = $props<{
    error: Error | null;
    onRetry?: () => void;
  }>();
</script>

<div class="text-center py-8">
  <div class="flex flex-col items-center gap-4">
    <AlertCircle class="w-12 h-12 text-red-500" />
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Алдаа гарлаа</h3>
      <p class="text-gray-500">
        {error?.message || "Тодорхойгүй алдаа гарлаа. Дахин оролдоно уу."}
      </p>
    </div>
    {#if onRetry}
      <Button variant="secondary" onclick={onRetry} class_="flex items-center gap-2">
        <RefreshCw class="w-4 h-4" />
        Дахин оролдох
      </Button>
    {/if}
  </div>
</div>