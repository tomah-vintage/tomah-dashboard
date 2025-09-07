<script lang="ts">
  import { seatingStore } from "$lib/stores/seating-store";
  import { Table } from "$lib/components/seating";
  import { createEventDispatcher } from 'svelte';
  import type { SeatingTable } from '$lib/types/seating'; // Import SeatingTable type

  const dispatch = createEventDispatcher();

  export let tables: SeatingTable[]; // Now receives tables as a prop
  export let showGrid = true;
  
  let canvasTransform = { x: 0, y: 0, scale: 1 };
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let lastPanPoint = { x: 0, y: 0 };

  let containerElement: HTMLDivElement;
  let canvasElement: HTMLDivElement;
  let dragging = false;
  let draggedTableId: string | null = null;
  let dragOffset = { x: 0, y: 0 };

  function handleMouseDown(event: MouseEvent, tableId: string) {
    if (event.button !== 0) return; // Only left mouse button
    
    // Stop propagation to prevent canvas panning when dragging tables
    event.stopPropagation();

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
    if (isPanning && !dragging) {
      const deltaX = event.clientX - lastPanPoint.x;
      const deltaY = event.clientY - lastPanPoint.y;
      
      canvasTransform.x += deltaX;
      canvasTransform.y += deltaY;
      canvasTransform = canvasTransform; // Trigger reactivity
      
      lastPanPoint = { x: event.clientX, y: event.clientY };
      return;
    }
    
    if (!dragging || !draggedTableId || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();

    // Calculate new position relative to container, accounting for canvas transform
    const newX = (event.clientX - containerRect.left - dragOffset.x - canvasTransform.x) / canvasTransform.scale;
    const newY = (event.clientY - containerRect.top - dragOffset.y - canvasTransform.y) / canvasTransform.scale;

    // Update table position in store (local UI update)
    seatingStore.moveTable(draggedTableId, Math.max(0, newX), Math.max(0, newY));
  }

  function handleMouseUp(event: MouseEvent) {
    if (isPanning) {
      isPanning = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      return;
    }
    
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
  function handleTouchStart(_event: TouchEvent, tableId: string) {
    const touch = _event.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
      button: 0,
    });
    handleMouseDown(mouseEvent, tableId);
  }

  function handleTouchMove(_event: TouchEvent) {
    if (!dragging) return;
    _event.preventDefault();
    const touch = _event.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleMouseMove(mouseEvent);
  }

  function handleTouchEnd(_event: TouchEvent) {
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
  
  // Canvas panning functions
  function handleCanvasMouseDown(event: MouseEvent) {
    if (event.button !== 0 || dragging) return; // Only left mouse button and not dragging tables
    
    isPanning = true;
    panStart = { x: event.clientX, y: event.clientY };
    lastPanPoint = { x: event.clientX, y: event.clientY };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    event.preventDefault();
  }
  
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    
    const scaleChange = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(2, canvasTransform.scale * scaleChange));
    
    // Zoom towards mouse cursor
    const rect = containerElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const scaleDelta = newScale - canvasTransform.scale;
    canvasTransform.x -= (mouseX - canvasTransform.x) * (scaleDelta / canvasTransform.scale);
    canvasTransform.y -= (mouseY - canvasTransform.y) * (scaleDelta / canvasTransform.scale);
    canvasTransform.scale = newScale;
    canvasTransform = canvasTransform; // Trigger reactivity
  }
  
  function resetView() {
    canvasTransform = { x: 0, y: 0, scale: 1 };
  }
  
  function fitToView() {
    if (tables.length === 0) return;
    
    const padding = 50;
    let minX = Math.min(...tables.map(t => t.x));
    let maxX = Math.max(...tables.map(t => t.x + t.width));
    let minY = Math.min(...tables.map(t => t.y));
    let maxY = Math.max(...tables.map(t => t.y + t.height));
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const containerRect = containerElement?.getBoundingClientRect();
    
    if (containerRect) {
      const scaleX = (containerRect.width - padding * 2) / contentWidth;
      const scaleY = (containerRect.height - padding * 2) / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
      
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const contentCenterX = (minX + maxX) / 2;
      const contentCenterY = (minY + maxY) / 2;
      
      canvasTransform = {
        x: centerX - contentCenterX * scale,
        y: centerY - contentCenterY * scale,
        scale: scale
      };
    }
  }
</script>

<svelte:window on:touchmove={(_event) => handleTouchMove(_event)} on:touchend={(_event) => handleTouchEnd(_event)} />

<div class="relative">
  <!-- Canvas Controls -->
  <div class="absolute top-4 right-4 z-40 flex flex-col space-y-2">
    <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col space-y-1">
      <button 
        class="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
        on:click={resetView}
        title="Анхны байрлалд шилжих"
      >
        Reset
      </button>
      <button 
        class="px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
        on:click={fitToView}
        title="Бүх ширээг харах"
      >
        Fit All
      </button>
      <div class="text-xs text-gray-600 text-center py-1">
        {Math.round(canvasTransform.scale * 100)}%
      </div>
    </div>
  </div>
  
  <div
    bind:this={containerElement}
    class="relative w-full h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md border border-gray-200 overflow-hidden select-none cursor-grab"
    class:cursor-grabbing={isPanning}
    style="{showGrid ? 'background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px); background-size: 20px 20px;' : ''}"
    on:mousedown={handleCanvasMouseDown}
    on:wheel={handleWheel}
  >
    <!-- Canvas content with transform -->
    <div 
      bind:this={canvasElement}
      class="absolute inset-0 origin-top-left"
      style="transform: translate({canvasTransform.x}px, {canvasTransform.y}px) scale({canvasTransform.scale}); transition: {isPanning || dragging ? 'none' : 'transform 0.2s ease'};"
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
      
      <!-- Canvas info overlay -->
      {#if tables.length === 0}
        <div class="absolute inset-0 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p class="text-lg font-medium">Ширээ байхгүй байна</p>
            <p class="text-sm">"Шинэ ширээ нэмэх" товчийг дарж эхлээрэй</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>