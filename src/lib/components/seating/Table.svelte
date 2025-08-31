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
    class="absolute bg-blue-500 text-white flex items-center justify-center font-bold text-lg cursor-grab shadow-md hover:shadow-lg transition-shadow w-full h-full z-10"
    class:rounded-full={isCircle}
    class:rounded-lg={isSquare || table.shape === TableShape.Rectangle}
    style="{isOval ? 'border-radius: 50%;' : ''}" 
  >
    <span>{table.table_number}</span>
  </div>

  {#each Array(table.seat_capacity) as _, i} <!-- Changed from table.capacity -->
    <div 
      style="{getSeatStyle(i)} width: {SEAT_SIZE}px; height: {SEAT_SIZE}px;"
      class="absolute bg-gray-400 rounded-md z-20"
    ></div>
  {/each}

  {#if isHovered}
    <div class="absolute top-0 right-0 flex space-x-1 p-1 bg-gray-800 bg-opacity-75 rounded-bl-lg z-30">
      <button on:click|stopPropagation={handlePrintQrClick} class="text-white hover:text-blue-300">
        <QrCode size="16" />
      </button>
      <button on:click|stopPropagation={handleEditClick} class="text-white hover:text-blue-300">
        <Edit size="16" />
      </button>
      <button on:click|stopPropagation={handleRemoveClick} class="text-white hover:text-red-300">
        <Trash2 size="16" />
      </button>
    </div>
  {/if}
</div>