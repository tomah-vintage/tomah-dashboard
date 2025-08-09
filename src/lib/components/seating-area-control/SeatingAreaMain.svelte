<script lang="ts">
    import type { PageData } from '../../../routes/dashboard/restaurants/[restaurantId]/seating/$types';
    import TableList from './TableList.svelte';
    import QRCodeModal from './QRCodeModal.svelte';
    import type { Table } from '$lib/types/seating';

    export let data: PageData;

    let selectedTable: Table | null = null;

    function viewQR(table: Table) {
        selectedTable = table;
    }

    function clearSelectedTable() {
        selectedTable = null;
    }
</script>

<div class="space-y-8">
    <div>
        <h2 class="text-xl font-semibold mb-4">Add New Table</h2>
        <form method="POST" action="?/addTable" class="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div class="flex-grow">
                <label for="name" class="sr-only">Table Name</label>
                <input type="text" name="name" id="name" placeholder="e.g., Patio 1" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            </div>
            <button type="submit" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Add Table</button>
        </form>
    </div>

    <div>
        <h2 class="text-xl font-semibold mb-4">Existing Tables</h2>
        <TableList tables={data.tables} on:viewQR={(e) => viewQR(e.detail)} />
    </div>
</div>

{#if selectedTable}
    <QRCodeModal table={selectedTable} on:close={clearSelectedTable} />
{/if}
