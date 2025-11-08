<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SeatingTable } from "$lib/types/seating";
  import { Modal } from "$lib/components/ui/modal";
  import { Button } from "$lib/components/ui/button";
  import { Printer } from "@lucide/svelte";

  export let open: boolean;
  export let table: SeatingTable | null;
  export let siteUrl: string;
  export let restaurantId: string;

  const dispatch = createEventDispatcher();

  let qrCodeUrl = "";
  let iframe: HTMLIFrameElement;

  $: {
    if (table && restaurantId) {
      const menuUrl = `tomah.mn/restaurant/${restaurantId}?table=${table.id}`;
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        menuUrl
      )}&size=200x200`;
    }
  }

  function handlePrint() {
    if (!iframe) return;

    const content = `
      <html>
        <head>
          <title>QR код хэвлэх - Ширээ ${table?.table_number}</title>
          <style>
            @page {
              size: 3in 3in;
              margin: 0.1in;
            }
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100%;
              margin: 0;
              font-family: sans-serif;
            }
            img {
              max-width: 80%;
              max-height: 80%;
            }
            p {
              margin-top: 0.2in;
              font-size: 14px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <img src="${qrCodeUrl}" alt="QR Code for table ${table?.table_number}" />
          <p>Ширээ: ${table?.table_number}</p>
        </body>
      </html>
    `;

    iframe.srcdoc = content;

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 100);
    };
  }
</script>

<Modal isOpen={open} onClose={() => dispatch("close")}>
  <div class="flex justify-between items-center">
    <h2 class="text-xl font-bold">Ширээний QR цэс {table?.table_number}</h2>
  </div>

  <div class="mt-4 text-center">
    {#if qrCodeUrl}
      <div class="flex justify-center" id="qr-code-container">
        <img src={qrCodeUrl} alt="QR Code for table {table?.table_number}" />
      </div>
      <p class="text-sm text-gray-500 mt-2">
        Энэ QR кодыг уншуулж, энэ ширээний цэсийг харна уу.
      </p>
    {:else}
      <p>QR код үүсгэж байна...</p>
    {/if}
  </div>

  <div class="mt-6 flex justify-end space-x-2">
    <Button variant="secondary" on:click={() => dispatch("close")}
      >Болих</Button
    >
    <Button on:click={handlePrint}>
      <Printer class="w-4 h-4 mr-2" />
      Хэвлэх
    </Button>
  </div>
</Modal>

<iframe bind:this={iframe} style="display: none;" title="QR код хэвлэх - Ширээ ${table?.table_number}"></iframe>
