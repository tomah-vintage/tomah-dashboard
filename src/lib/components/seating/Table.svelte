<script lang="ts">
  import type { SeatingTable } from '$lib/types/seating';
  import { TableShape } from '$lib/types/seating';
  import { createEventDispatcher } from 'svelte';
  import { Edit, Trash2, QrCode } from 'lucide-svelte';

  export let table: SeatingTable;

  const dispatch = createEventDispatcher();

  let isHovered = false;

  $: tableSizeStyles = `
    width: ${table.width}px;
    height: ${table.height}px;
  `;

  $: isCircle = table.shape === TableShape.Circle;
  $: isSquare = table.shape === TableShape.Square;
  $: isOval = table.shape === TableShape.Oval;

  const SEAT_SIZE = 20;
  const PADDING_OFFSET = 10; // Distance from table edge to seat center

  function getSeatStyle(index: number): string {
    if (isCircle || isOval) {
      const angle = (index / table.seat_capacity) * 2 * Math.PI; // Changed from table.capacity
      const radiusX = table.width / 2;
      const radiusY = table.height / 2;
      
      // Calculate the radius for seat placement
      const seatPlacementRadiusX = radiusX + PADDING_OFFSET;
      const seatPlacementRadiusY = radiusY + PADDING_OFFSET;

      const x = Math.cos(angle) * seatPlacementRadiusX + radiusX;
      const y = Math.sin(angle) * seatPlacementRadiusY + radiusY;
      return `left: ${x}px; top: ${y}px; transform: translate(-50%, -50%);`;
    } else { // Rectangle or Square
      const { width, height, seat_capacity } = table; // Changed from capacity
      const perimeter = 2 * (width + height);
      const distance = (perimeter / seat_capacity) * (index + 0.5); // Changed from capacity

      if (distance < width) { // Top edge
        return `left: ${distance}px; top: -${SEAT_SIZE + PADDING_OFFSET}px; transform: translateX(-50%);`;
      } else if (distance < width + height) { // Right edge
        return `top: ${distance - width}px; right: -${SEAT_SIZE + PADDING_OFFSET}px; transform: translateY(-50%);`;
      } else if (distance < 2 * width + height) { // Bottom edge
        return `left: ${width - (distance - (width + height))}px; bottom: -${SEAT_SIZE + PADDING_OFFSET}px; transform: translateX(-50%);`;
      } else { // Left edge
        return `top: ${height - (distance - (2 * width + height))}px; left: -${SEAT_SIZE + PADDING_OFFSET}px; transform: translateY(-50%);`;
      }
    }
  }

  function handleEditClick() {
    dispatch('editTableRequest', table);
  }

  function handleRemoveClick() {
    dispatch('removeTableRequest', table.id);
  }

  function handlePrintQrClick() {
    dispatch('printQrRequest', table);
  }
</script>

<div 
  class="relative group" 
  style="{tableSizeStyles}"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  role="button"
  tabindex="0"
>
  <div 
    class="absolute text-white flex items-center justify-center font-bold text-lg cursor-grab shadow-lg hover:shadow-xl transition-all duration-200 w-full h-full z-10 border-2"
    class:bg-green-500={table.status === 'available'}
    class:border-green-400={table.status === 'available'}
    class:bg-red-500={table.status === 'occupied'}
    class:border-red-400={table.status === 'occupied'}
    class:bg-yellow-500={table.status === 'reserved'}
    class:border-yellow-400={table.status === 'reserved'}
    class:bg-gray-500={!table.status}
    class:border-gray-400={!table.status}
    class:rounded-full={isCircle}
    class:rounded-lg={isSquare || table.shape === TableShape.Rectangle}
    class:hover:scale-105={isHovered}
    style="{isOval ? 'border-radius: 50%;' : ''}" 
  >
    <div class="text-center">
      <div class="text-xl font-bold">{table.table_number}</div>
      <div class="text-xs opacity-90">{table.seat_capacity} seats</div>
    </div>
  </div>

  {#each Array(table.seat_capacity) as _, i (i)} <!-- Changed from table.capacity -->
    <div 
      style="{getSeatStyle(i)} width: {SEAT_SIZE}px; height: {SEAT_SIZE}px;"
      class="absolute rounded-full z-20 border-2 border-white shadow-sm transition-colors"
      class:bg-gray-600={table.status === 'available'}
      class:bg-red-300={table.status === 'occupied'}
      class:bg-yellow-300={table.status === 'reserved'}
      class:bg-gray-400={!table.status}
    ></div>
  {/each}

  {#if isHovered}
    <div class="absolute -top-2 -right-2 flex space-x-1 z-30">
      <button 
        on:click|stopPropagation={handlePrintQrClick} 
        class="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 text-blue-600 hover:text-blue-700"
        title="QR код хэвлэх"
      >
        <QrCode size="14" />
      </button>
      <button 
        on:click|stopPropagation={handleEditClick} 
        class="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 text-gray-600 hover:text-gray-700"
        title="Ширээ засах"
      >
        <Edit size="14" />
      </button>
      <button 
        on:click|stopPropagation={handleRemoveClick} 
        class="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 text-red-600 hover:text-red-700"
        title="Ширээ устгах"
      >
        <Trash2 size="14" />
      </button>
    </div>
  {/if}
  
  <!-- Status indicator -->
  <div class="absolute -bottom-1 -right-1 z-30">
    <div 
      class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
      class:bg-green-500={table.status === 'available'}
      class:bg-red-500={table.status === 'occupied'}
      class:bg-yellow-500={table.status === 'reserved'}
      class:bg-gray-500={!table.status}
    ></div>
  </div>
</div>