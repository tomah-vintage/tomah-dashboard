<script lang="ts">
  import { Grid3X3, List } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button";

  let { 
    viewMode = $bindable("table"),
    onViewModeChange
  } = $props<{
    viewMode: 'table' | 'grid';
    onViewModeChange: (mode: 'table' | 'grid') => void;
  }>();

  function handleTableView() {
    viewMode = 'table';
    onViewModeChange('table');
  }

  function handleGridView() {
    viewMode = 'grid';
    onViewModeChange('grid');
  }
</script>

<!-- View Toggle -->
<div class="hidden sm:flex border rounded-lg overflow-hidden">
  <Button 
    variant={viewMode === 'table' ? 'primary' : 'tertiary'}
    class_="rounded-none border-0"
    onclick={handleTableView}
  >
    <List class="w-4 h-4" />
  </Button>
  <Button 
    variant={viewMode === 'grid' ? 'primary' : 'tertiary'}
    class_="rounded-none border-0"
    onclick={handleGridView}
  >
    <Grid3X3 class="w-4 h-4" />
  </Button>
</div>