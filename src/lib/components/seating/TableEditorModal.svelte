<script lang="ts">
  import Modal from '$lib/components/ui/modal/Modal.svelte';
  import Button from '$lib/components/ui/button/Button.svelte';
  import { Input } from '$lib/components/ui/input'; // Import Input component
  import { TableShape, type SeatingTable } from '$lib/types/seating';
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let table: SeatingTable | null = null; // New prop for editing

  let shape: TableShape = TableShape.Rectangle;
  let seat_capacity = 4; // Changed from 'capacity' to 'seat_capacity'
  let table_number = '';

  // Pre-fill form if editing an existing table
  $: if (table) {
    shape = table.shape;
    seat_capacity = table.seat_capacity; // Changed from 'capacity' to 'seat_capacity'
    table_number = table.table_number;
  } else {
    // Reset form if adding a new table
    shape = TableShape.Rectangle;
    seat_capacity = 4; // Changed from 'capacity' to 'seat_capacity'
    table_number = '';
  }

  const dispatch = createEventDispatcher();

  function handleSave() {
    dispatch('save', { id: table?.id, shape, seat_capacity, table_number }); // Changed from 'capacity' to 'seat_capacity'
    closeModal();
  }

  function closeModal() {
    dispatch('close');
  }
</script>

<Modal isOpen={open} onClose={closeModal}>
  <h2 class="text-xl font-bold mb-4">{table ? 'Ширээ засах' : 'Шинэ ширээ нэмэх'}</h2>

  <form on:submit|preventDefault={handleSave}>
    <div class="mb-4">
      <label for="table_number" class="block text-sm font-medium text-gray-700">Ширээний дугаар</label>
      <Input type="text" id="table_number" bind:value={table_number} placeholder="Жишээ нь: А1, 101" />
    </div>

    <div class="mb-4">
      <label for="shape" class="block text-sm font-medium text-gray-700">Ширээний хэлбэр</label>
      <select id="shape" bind:value={shape} class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
        <option value="{TableShape.Rectangle}">Тэгш өнцөгт</option>
        <option value="{TableShape.Square}">Дөрвөлжин</option>
        <option value="{TableShape.Circle}">Дугуй</option>
        <option value="{TableShape.Oval}">Зууван</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="seat_capacity" class="block text-sm font-medium text-gray-700">Суудлын тоо</label>
      <input type="number" id="seat_capacity" bind:value={seat_capacity} min="1" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <Button type="button" variant="secondary" on:click={closeModal}>Болих</Button>
      <Button type="submit">Хадгалах</Button>
    </div>
  </form>
</Modal>