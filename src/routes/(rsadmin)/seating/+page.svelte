<script lang="ts">
  import type { PageData } from './$types';
  import { SeatingCanvas, TableToolbar, TableEditorModal } from '$lib/components/seating';
  import { seatingStore } from '$lib/stores/seating-store';
  import { sessionStore } from '$lib/stores/sessionStore'; // Import sessionStore
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { SeatingTable, TableShape } from '$lib/types/seating';
  import { TableStatus } from '$lib/types/seating'; // Import TableStatus
  import {
    createGetTablesQuery,
    createAddTableMutation,
    createUpdateTableMutation,
    createDeleteTableMutation
  } from '$lib/queries/seating-queries';

  export let data: PageData;

  // Initialize queries and mutations
  const getTablesQuery = createGetTablesQuery();
  const addTableMutation = createAddTableMutation();
  const updateTableMutation = createUpdateTableMutation();
  const deleteTableMutation = createDeleteTableMutation();

  // Update store when tables data changes from query
  $: if ($getTablesQuery.data) {
    seatingStore.setTables($getTablesQuery.data);
  }

  onMount(() => {
    // Initialize tables from server-side data if available
    if (data.tables && data.tables.length > 0) {
      seatingStore.setTables(data.tables);
    }
  });

  function handleAddTableRequest() {
    seatingStore.setEditingTable(null); // Clear editing state for new table
    seatingStore.toggleTableEditorModal(true);
  }

  function handleEditTableRequest(event: CustomEvent<SeatingTable>) {
    seatingStore.setEditingTable(event.detail); // Set table to be edited
    seatingStore.toggleTableEditorModal(true);
  }

  async function handleSaveTable(event: CustomEvent<{ shape: TableShape; seat_capacity: number; id?: string; table_number: string }>) {
    const { shape, seat_capacity, id, table_number } = event.detail; // Get seat_capacity from event detail

    // Get restaurantId from sessionStore
    const restaurantId = $sessionStore.user?.restaurant?.id;
    if (!restaurantId) {
      console.error('Restaurant ID not found in session.');
      // Optionally show a toast error to the user
      return;
    }

    if (id && $seatingStore.editingTable) {
      // Update existing table
      const updatedTable: SeatingTable = {
        ...$seatingStore.editingTable,
        shape,
        seat_capacity, // Update seat_capacity
        table_number,
      };
      await $updateTableMutation.mutateAsync(updatedTable);
    }
    else {
      // Add new table
      const newTable: Omit<SeatingTable, 'id'> = {
        x: 50, // Default position
        y: 50, // Default position
        width: 100, // Default size
        height: 100, // Default size
        shape: shape,
        seat_capacity, // Use seat_capacity from modal
        table_number,
        status: TableStatus.Available, // Default status
        restaurant: restaurantId.toString(), // Pass restaurantId
      };
      await $addTableMutation.mutateAsync(newTable);
    }
    seatingStore.toggleTableEditorModal(false);
    seatingStore.clearEditingTable();
  }

  function handleCloseTableEditorModal() {
    seatingStore.toggleTableEditorModal(false);
    seatingStore.clearEditingTable();
  }

  async function handleRemoveTableRequest(event: CustomEvent<string>) {
    const tableId = event.detail;
    await $deleteTableMutation.mutateAsync(tableId);
  }

  async function handleTableMoveEnd(event: CustomEvent<{ tableId: string; x: number; y: number }>) {
    const { tableId, x, y } = event.detail;
    const tableToUpdate = $seatingStore.tables.find(t => t.id === tableId);
    if (tableToUpdate) {
      const updatedTable: SeatingTable = {
        ...tableToUpdate,
        x,
        y,
      };
      await $updateTableMutation.mutateAsync(updatedTable);
    }
  }
</script>

<svelte:head>
  <title>Захиалгын ширээний зохион байгуулалт</title>
</svelte:head>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Ширээний зохион байгуулалт</h1>

    <TableToolbar on:addTableRequest={handleAddTableRequest} />

    <div class="mt-4">
        <SeatingCanvas
            tables={$seatingStore.tables}
            on:editTableRequest={handleEditTableRequest}
            on:removeTableRequest={handleRemoveTableRequest}
            on:tableMoveEnd={handleTableMoveEnd}
        />
    </div>
</div>

<TableEditorModal
  open={$seatingStore.showTableEditorModal}
  table={$seatingStore.editingTable}
  on:save={handleSaveTable}
  on:close={handleCloseTableEditorModal}
/>