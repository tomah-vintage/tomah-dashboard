<script lang="ts">
  import { seatingStore } from "$lib/stores/seating-store";
  import { Table } from "$lib/components/seating";
  import { createEventDispatcher } from 'svelte';
  import type { SeatingTable } from '$lib/types/seating'; // Import SeatingTable type

  const dispatch = createEventDispatcher();

  export let tables: SeatingTable[]; // Now receives tables as a prop

  let containerElement: HTMLDivElement;
  let dragging = false;
  let draggedTableId: string | null = null;
  let dragOffset = { x: 0, y: 0 };

  function handleMouseDown(event: MouseEvent, tableId: string) {
    if (event.button !== 0) return; // Only left mouse button

    dragging = true;
    draggedTableId = tableId;

    const tableElement = event.currentTarget as HTMLElement;
    const rect = tableElement.getBoundingClientRect();

    // Calculate offset from mouse to top-left corner of table
    dragOffset.x = event.clientX - rect.left;
    dragOffset.y = event.clientY - rect.top;

    // Prevent text selection
    event.preventDefault();

    // Add event listeners to document for smooth dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Add dragging class for visual feedback
    tableElement.style.zIndex = "1000";
    tableElement.style.opacity = "0.8";
  }

  function handleMouseMove(event: MouseEvent) {
    if (!dragging || !draggedTableId || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();

    // Calculate new position relative to container
    const newX = event.clientX - containerRect.left - dragOffset.x;
    const newY = event.clientY - containerRect.top - dragOffset.y;

    // Constrain to container bounds
    const constrainedX = Math.max(0, Math.min(newX, containerRect.width - 100)); // Assuming table width ~100px
    const constrainedY = Math.max(
      0,
      Math.min(newY, containerRect.height - 100)
    ); // Assuming table height ~100px

    // Update table position in store (local UI update)
    seatingStore.moveTable(draggedTableId, constrainedX, constrainedY);
  }

  function handleMouseUp(event: MouseEvent) {
    if (!dragging || !draggedTableId) return;

    dragging = false;

    // Reset visual feedback
    const tableElement = document.querySelector(
      `[data-table-id="${draggedTableId}"]`
    ) as HTMLElement;
    if (tableElement) {
      tableElement.style.zIndex = "10";
      tableElement.style.opacity = "1";
    }

    // Dispatch event with final position for persistence
    const movedTable = tables.find(t => t.id === draggedTableId);
    if (movedTable) {
      dispatch('tableMoveEnd', { tableId: movedTable.id, x: movedTable.x, y: movedTable.y });
    }

    draggedTableId = null;

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

  // Handle touch events for mobile
  function handleTouchStart(event: TouchEvent, tableId: string) {
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
      button: 0,
    });
    handleMouseDown(mouseEvent, tableId);
  }

  function handleTouchMove(event: TouchEvent) {
    if (!dragging) return;
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleMouseMove(mouseEvent);
  }

  function handleTouchEnd(event: TouchEvent) {
    const mouseEvent = new MouseEvent("mouseup", {});
    handleMouseUp(mouseEvent);
  }

  // Handle events from Table component
  function handleEditTableRequest(event: CustomEvent) {
    dispatch('editTableRequest', event.detail);
  }

  function handleRemoveTableRequest(event: CustomEvent) {
    dispatch('removeTableRequest', event.detail);
  }

  function handlePrintQrRequest(event: CustomEvent) {
    dispatch('printQrRequest', event.detail);
  }
</script>

<svelte:window on:touchmove={handleTouchMove} on:touchend={handleTouchEnd} />

<div
  bind:this={containerElement}
  class="relative w-full h-[600px] bg-gray-100 rounded-md border border-gray-300 overflow-hidden select-none"
>
  {#each tables as table (table.id)}
    <div
      class="absolute cursor-move transition-opacity duration-200"
      style="left: {table.x}px; top: {table.y}px; z-index: 10;"
      data-table-id={table.id}
      role="button"
      tabindex="0"
      on:mousedown={(e) => handleMouseDown(e, table.id)}
      on:touchstart={(e) => handleTouchStart(e, table.id)}
      on:keydown={(e) => {
        // Handle keyboard navigation for accessibility
        if (e.key === "ArrowUp") {
          e.preventDefault();
          seatingStore.moveTable(
            table.id,
            table.x,
            Math.max(0, table.y - 10)
          );
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          seatingStore.moveTable(table.id, table.x, table.y + 10);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          seatingStore.moveTable(
            table.id,
            Math.max(0, table.x - 10),
            table.y
          );
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          seatingStore.moveTable(table.id, table.x + 10, table.y);
        }
      }}
    >
      <Table {table} on:editTableRequest={handleEditTableRequest} on:removeTableRequest={handleRemoveTableRequest} on:printQrRequest={handlePrintQrRequest} />
    </div>
  {/each}
</div>