<script lang="ts">
    import type { Table } from "$lib/types/seating";
    import { createEventDispatcher } from "svelte";
    import { X } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button";

    export let table: Table | null;

    const dispatch = createEventDispatcher();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            dispatch('close');
        }
    }

    function printQR() {
        const printContents = document.getElementById('printable-qr-code')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            // Re-attach svelte app
            // This is a simple and brute-force way, a more elegant solution might be needed
            window.location.reload(); 
        }
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" on:click|self={() => dispatch('close')} on:keydown={handleKeydown} role="dialog" aria-modal="true">
    <div class="bg-card-background p-6 rounded-lg shadow-2xl max-w-sm w-full relative">
        <Button on:click={() => dispatch('close')} variant="tertiary" class="absolute top-4 right-4 p-1 rounded-full">
            <X />
        </Button>
        {#if table}
            <div id="printable-qr-code" class="text-center">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">{table.name}</h2>
                <img src={table.qrCodeUrl} alt={`QR Code for ${table.name}`} class="mx-auto w-64 h-64">
                <p class="mt-2 text-sm text-gray-500">{table.orderUrl}</p>
            </div>
            <Button on:click={printQR} class="mt-6 w-full">QR код хэвлэх</Button>
        {/if}
    </div>
</div>
