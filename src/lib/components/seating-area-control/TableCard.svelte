<script lang="ts">
    import type { Table } from "$lib/types/seating";
    import { createEventDispatcher } from "svelte";

    export let table: Table;

    const dispatch = createEventDispatcher();

</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between">
    <h3 class="font-bold text-lg mb-4">{table.name}</h3>
    <div class="flex space-x-2">
        <button on:click={() => dispatch('viewQR')} class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">View QR</button>
        <form method="POST" action="?/removeTable" class="flex-1">
            <input type="hidden" name="tableId" value={table.id} />
            <button type="submit" class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Remove</button>
        </form>
    </div>
</div>
