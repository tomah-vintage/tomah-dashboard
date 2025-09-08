<script lang="ts">
  import type { PageData } from "./$types";
  import {
    SeatingCanvas,
    TableToolbar,
    TableEditorModal,
    QrCodeModal,
  } from "$lib/components/seating";
  import { seatingStore } from "$lib/stores/seating-store";
  import { sessionStore } from "$lib/stores/sessionStore"; // Import sessionStore
  import type { SeatingTable, TableShape } from "$lib/types/seating";
  import { TableStatus } from "$lib/types/seating"; // Import TableStatus
  import {
    createGetTablesQuery,
    createAddTableMutation,
    createUpdateTableMutation,
    createDeleteTableMutation,
  } from "$lib/queries/seating-queries";
  import { PUBLIC_SITE_URL } from "$env/static/public";

  export let data: PageData;

  let showQrModal = false;
  let selectedTableForQr: SeatingTable | null = null;
  let showGrid = true;
  let selectedTables: Set<string> = new Set();
  let filterStatus: string = "all";

  // Filtered tables based on status filter
  $: filteredTables = $seatingStore.tables.filter((table) => {
    if (filterStatus === "all") return true;
    return table.status === filterStatus;
  });

  // Initialize queries and mutations with server data as initial data
  const getTablesQuery = createGetTablesQuery(data.tables || []);
  const addTableMutation = createAddTableMutation();
  const updateTableMutation = createUpdateTableMutation();
  const deleteTableMutation = createDeleteTableMutation();

  // Update store when tables data changes from query but avoid overwriting with same data
  $: if ($getTablesQuery.data && JSON.stringify($getTablesQuery.data) !== JSON.stringify($seatingStore.tables)) {
    seatingStore.setTables($getTablesQuery.data);
  }
  
  // Initialize store with server data immediately
  if (data.tables && $seatingStore.tables.length === 0) {
    seatingStore.setTables(data.tables);
  }

  function handleAddTableRequest() {
    seatingStore.setEditingTable(null); // Clear editing state for new table
    seatingStore.toggleTableEditorModal(true);
  }

  function handleEditTableRequest(event: CustomEvent<SeatingTable>) {
    seatingStore.setEditingTable(event.detail); // Set table to be edited
    seatingStore.toggleTableEditorModal(true);
  }

  function handlePrintQrRequest(event: CustomEvent<SeatingTable>) {
    selectedTableForQr = event.detail;
    showQrModal = true;
  }

  function handleCloseQrModal() {
    showQrModal = false;
    selectedTableForQr = null;
  }

  async function handleSaveTable(
    event: CustomEvent<{
      shape: TableShape;
      seat_capacity: number;
      id?: string;
      table_number: string;
    }>
  ) {
    const { shape, seat_capacity, id, table_number } = event.detail; // Get seat_capacity from event detail

    // Get restaurantId from sessionStore
    const restaurantId = $sessionStore.user?.restaurant?.id;
    if (!restaurantId) {
      console.error("Restaurant ID not found in session.");
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
    } else {
      // Add new table
      const newTable: Omit<SeatingTable, "id"> = {
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

  function toggleGrid() {
    showGrid = !showGrid;
  }

  function centerTables() {
    // Logic to center all tables in the canvas
    const canvas = { width: 800, height: 600 };
    const tables = $seatingStore.tables;

    if (tables.length === 0) return;

    // Calculate bounding box of all tables
    let minX = Math.min(...tables.map((t) => t.x));
    let maxX = Math.max(...tables.map((t) => t.x + t.width));
    let minY = Math.min(...tables.map((t) => t.y));
    let maxY = Math.max(...tables.map((t) => t.y + t.height));

    // Calculate center offset
    const currentCenterX = (minX + maxX) / 2;
    const currentCenterY = (minY + maxY) / 2;
    const targetCenterX = canvas.width / 2;
    const targetCenterY = canvas.height / 2;

    const offsetX = targetCenterX - currentCenterX;
    const offsetY = targetCenterY - currentCenterY;

    // Move all tables
    tables.forEach(async (table) => {
      const newX = Math.round(Math.max(
        0,
        Math.min(canvas.width - table.width, table.x + offsetX)
      ));
      const newY = Math.round(Math.max(
        0,
        Math.min(canvas.height - table.height, table.y + offsetY)
      ));

      const updatedTable: SeatingTable = {
        ...table,
        x: newX,
        y: newY,
      };
      await $updateTableMutation.mutateAsync(updatedTable);
    });
  }

  function handleBulkDelete(tableIds: string[]) {
    tableIds.forEach(async (id) => {
      await $deleteTableMutation.mutateAsync(id);
    });
    selectedTables.clear();
  }

  function handleFilterChange(status: string) {
    filterStatus = status;
  }

  function handleTableSelect(
    event: CustomEvent<{ tableId: string; selected: boolean }>
  ) {
    const { tableId, selected } = event.detail;
    if (selected) {
      selectedTables.add(tableId);
    } else {
      selectedTables.delete(tableId);
    }
    selectedTables = selectedTables; // Trigger reactivity
  }

  function handleCloseTableEditorModal() {
    seatingStore.toggleTableEditorModal(false);
    seatingStore.clearEditingTable();
  }

  async function handleRemoveTableRequest(event: CustomEvent<string>) {
    const tableId = event.detail;
    await $deleteTableMutation.mutateAsync(tableId);
  }

  async function handleTableMoveEnd(
    event: CustomEvent<{ tableId: string; x: number; y: number }>
  ) {
    const { tableId, x, y } = event.detail;
    const tableToUpdate = $seatingStore.tables.find((t) => t.id === tableId);
    if (tableToUpdate) {
      const updatedTable: SeatingTable = {
        ...tableToUpdate,
        x: Math.round(x),
        y: Math.round(y),
      };
      await $updateTableMutation.mutateAsync(updatedTable);
    }
  }
</script>

<svelte:head>
  <title>Ширээний менежмент | Qpick</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ширээний менежмент</h1>
          <p class="mt-1 text-sm text-gray-500">
            Ресторанаа ширээг удирдаж, QR код үүсгэх
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span
              >Боломжтой: {$seatingStore.tables.filter(
                (t) => t.status === "available"
              ).length}</span
            >
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span
              >Эзлэгдсэн: {$seatingStore.tables.filter(
                (t) => t.status === "occupied"
              ).length}</span
            >
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span
              >Захиалга хүлээж буй: {$seatingStore.tables.filter(
                (t) => t.status === "reserved"
              ).length}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-80 flex-shrink-0">
        <TableToolbar
          on:addTableRequest={handleAddTableRequest}
          tables={$seatingStore.tables}
          on:bulkDelete={(e) => handleBulkDelete(e.detail)}
          on:filterChange={(e) => handleFilterChange(e.detail)}
        />
      </div>

      <!-- Canvas Area -->
      <div class="flex-1">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  Ресторанаа зураг
                </h3>
                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    on:click={toggleGrid}
                  >
                    Grid {showGrid ? "нуух" : "харуулах"}
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    on:click={centerTables}
                  >
                    Ширээг төвлөх
                  </button>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                Нийт ширээ: {$seatingStore.tables.length} • Нийт суудал: {$seatingStore.tables.reduce(
                  (sum, t) => sum + t.seat_capacity,
                  0
                )}
              </div>
            </div>
          </div>

          <SeatingCanvas
            tables={filteredTables}
            {showGrid}
            on:editTableRequest={handleEditTableRequest}
            on:removeTableRequest={handleRemoveTableRequest}
            on:tableMoveEnd={handleTableMoveEnd}
            on:printQrRequest={handlePrintQrRequest}
            on:tableSelect={handleTableSelect}
          />
        </div>
      </div>
    </div>
  </div>
</div>

<TableEditorModal
  open={$seatingStore.showTableEditorModal}
  table={$seatingStore.editingTable}
  on:save={handleSaveTable}
  on:close={handleCloseTableEditorModal}
/>

<QrCodeModal
  open={showQrModal}
  table={selectedTableForQr}
  siteUrl={PUBLIC_SITE_URL}
  on:close={handleCloseQrModal}
/>
