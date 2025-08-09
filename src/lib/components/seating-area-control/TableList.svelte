<script lang="ts">
    import type { Table } from "$lib/types/seating";
    import TableCard from "./TableCard.svelte";
    import { createEventDispatcher } from "svelte";

    export let tables: Table[] = [];

    const dispatch = createEventDispatcher();

    function viewQR(table: Table) {
        dispatch("viewQR", table);
    }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each tables as table (table.id)}
        <TableCard {table} on:viewQR={() => viewQR(table)} />
    {/each}
</div>
