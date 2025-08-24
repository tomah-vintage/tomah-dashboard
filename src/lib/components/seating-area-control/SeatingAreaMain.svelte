<script lang="ts">
    import type { PageData } from '../../../routes/(rsadmin)/seating/$types';
    import TableList from './TableList.svelte';
    import QRCodeModal from './QRCodeModal.svelte';
    import type { Table } from '$lib/types/seating';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';

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
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Шинэ ширээ нэмэх</h2>
        <form method="POST" action="?/addTable" class="flex items-center space-x-4 bg-card-background p-4 rounded-lg shadow">
            <div class="flex-grow">
                <Input type="text" name="name" id="name" placeholder="Жишээ нь, Тагт 1" label="" />
            </div>
            <Button type="submit">Ширээ нэмэх</Button>
        </form>
    </div>

    <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Одоо байгаа ширээнүүд</h2>
        <TableList tables={data.tables} on:viewQR={(e) => viewQR(e.detail)} />
    </div>
</div>

{#if selectedTable}
    <QRCodeModal table={selectedTable} on:close={clearSelectedTable} />
{/if}