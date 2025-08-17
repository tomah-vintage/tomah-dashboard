<script lang="ts">
    import type { Table } from "$lib/types/seating";
    import { createEventDispatcher } from "svelte";

    export let table: Table;

    const dispatch = createEventDispatcher();

</script>

<div class="bg-card-background rounded-lg shadow p-6 flex flex-col justify-between">
    <h3 class="font-bold text-lg mb-4 text-gray-800">{table.name}</h3>
    <div class="flex space-x-2">
        <button on:click={() => dispatch('viewQR')} class="flex-1 bg-primary-blue text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">View QR</button>
        <form method="POST" action="?/removeTable" class="flex-1">
            <input type="hidden" name="tableId" value={table.id} />
            <button type="submit" class="w-full bg-status-error text-white px-4 py-2 rounded hover:bg-red-700 text-sm">Remove</button>
        </form>
    </div>
</div>
