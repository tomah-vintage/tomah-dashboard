<script lang="ts">
    import type { Table } from "$lib/types/seating";
    import { createEventDispatcher } from "svelte";
    import { Button } from "$lib/components/ui/button";

    export let table: Table;

    const dispatch = createEventDispatcher();

</script>

<div class="bg-card-background rounded-lg shadow p-6 flex flex-col justify-between">
    <h3 class="font-bold text-lg mb-4 text-gray-800">{table.name}</h3>
    <div class="flex space-x-2">
        <Button on:click={() => dispatch('viewQR')} class="flex-1 text-sm">View QR</Button>
        <form method="POST" action="?/removeTable" class="flex-1">
            <input type="hidden" name="tableId" value={table.id} />
            <Button type="submit" variant="error" class="w-full text-sm">Remove</Button>
        </form>
    </div>
</div>
