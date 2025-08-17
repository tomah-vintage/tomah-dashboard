<script lang="ts">
    import type { PageData } from '../../../routes/(rsadmin)/seating/$types';
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
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Add New Table</h2>
        <form method="POST" action="?/addTable" class="flex items-center space-x-4 bg-card-background p-4 rounded-lg shadow">
            <div class="flex-grow">
                <label for="name" class="sr-only">Table Name</label>
                <input type="text" name="name" id="name" placeholder="e.g., Patio 1" class="w-full p-2 border rounded">
            </div>
            <button type="submit" class="bg-primary-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700">Add Table</button>
        </form>
    </div>

    <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Existing Tables</h2>
        <TableList tables={data.tables} on:viewQR={(e) => viewQR(e.detail)} />
    </div>
</div>

{#if selectedTable}
    <QRCodeModal table={selectedTable} on:close={clearSelectedTable} />
{/if}
