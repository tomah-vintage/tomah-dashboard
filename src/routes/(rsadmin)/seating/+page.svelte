<script lang="ts">
  import type { PageData } from './$types';
  import { SeatingCanvas, TableToolbar, TableEditorModal } from '$lib/components/seating';
  import { seatingStore } from '$lib/stores/seating-store';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import type { SeatingTable, TableShape } from '$lib/types/seating';

  export let data: PageData;

  let showTableEditorModal = false;
  let editingTable: SeatingTable | null = null; // New state for editing

  onMount(() => {
    if (data.layout && !get(seatingStore)) {
      seatingStore.set(data.layout);
    }
  });

  function handleAddTableRequest() {
    editingTable = null; // Clear editing state for new table
    showTableEditorModal = true;
  }

  function handleEditTableRequest(event: CustomEvent<SeatingTable>) {
    editingTable = event.detail; // Set table to be edited
    showTableEditorModal = true;
  }

  function handleSaveTable(event: CustomEvent<{ shape: TableShape; capacity: number; id?: string }>) {
    const { shape, capacity, id } = event.detail;
    if (id && editingTable) {
      seatingStore.updateTable(id, shape, capacity);
    } else {
      seatingStore.addTable(shape, capacity);
    }
    showTableEditorModal = false;
    editingTable = null; // Clear editing state
  }

  function handleCloseTableEditorModal() {
    showTableEditorModal = false;
    editingTable = null; // Clear editing state
  }

  function handleRemoveTableRequest(event: CustomEvent<string>) {
    const tableId = event.detail;
    seatingStore.removeTable(tableId);
  }
</script>

<svelte:head>
  <title>Захиалгын ширээний зохион байгуулалт</title>
</svelte:head>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Ширээний зохион байгуулалт</h1>
    
    <TableToolbar on:addTableRequest={handleAddTableRequest} />

    <div class="mt-4">
        <SeatingCanvas on:editTableRequest={handleEditTableRequest} on:removeTableRequest={handleRemoveTableRequest} />
    </div>
</div>

<TableEditorModal 
  open={showTableEditorModal}
  table={editingTable} 
  on:save={handleSaveTable}
  on:close={handleCloseTableEditorModal}
/>