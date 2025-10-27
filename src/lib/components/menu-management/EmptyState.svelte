<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let { 
    type = "no-items",
    onClearFilters
  } = $props<{
    type: "no-items" | "no-results";
    onClearFilters?: () => void;
  }>();
</script>

<div class="text-center py-8">
  {#if type === "no-items"}
    <p class="text-gray-500 mb-4">Хоолны цэс олдсонгүй.</p>
    <Button href="/menu/new">Эхний хоол нэмэх</Button>
  {:else if type === "no-results"}
    <p class="text-gray-500 mb-4">Шүүлтэд тохирох хоол олдсонгүй.</p>
    <Button variant="tertiary" onclick={onClearFilters}>
      Шүүлтийг арилгах
    </Button>
  {/if}
</div>