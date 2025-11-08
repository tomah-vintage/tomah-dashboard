<script lang="ts">
  import { Plus, FileDown } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";
  import ViewToggle from "./ViewToggle.svelte";

  let { 
    viewMode = $bindable("table"),
    onViewModeChange,
    onExport
  } = $props<{
    viewMode: 'table' | 'grid';
    onViewModeChange: (mode: 'table' | 'grid') => void;
    onExport?: () => void;
  }>();
</script>

<div class="flex items-center gap-2">
  <ViewToggle {viewMode} {onViewModeChange} />
  
  <Button href="/menu/new">
    <Plus class="w-4 h-4" />
    <span>Хоол нэмэх</span>
  </Button>
  
  <Button variant="tertiary" onclick={onExport}>
    <FileDown class="w-4 h-4" />
    <span>Экспорт</span>
  </Button>
</div>