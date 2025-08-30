<script lang="ts">
  import Modal from '$lib/components/ui/modal/Modal.svelte';
  import Button from '$lib/components/ui/button/Button.svelte';
  import { TableShape, type SeatingTable } from '$lib/types/seating';
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let table: SeatingTable | null = null; // New prop for editing

  let shape: TableShape = TableShape.Rectangle;
  let capacity = 4;

  // Pre-fill form if editing an existing table
  $: if (table) {
    shape = table.shape;
    capacity = table.capacity;
  } else {
    // Reset form if adding a new table
    shape = TableShape.Rectangle;
    capacity = 4;
  }

  const dispatch = createEventDispatcher();

  function handleSave() {
    dispatch('save', { id: table?.id, shape, capacity }); // Dispatch id for editing
    closeModal();
  }

  function closeModal() {
    dispatch('close');
  }
</script>

<Modal isOpen={open} onClose={closeModal}> <!-- Corrected prop names -->
  <h2 class="text-xl font-bold mb-4">{table ? 'Ширээ засах' : 'Шинэ ширээ нэмэх'}</h2>
  
  <form on:submit|preventDefault={handleSave}>
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
      <label for="capacity" class="block text-sm font-medium text-gray-700">Суудлын тоо</label>
      <input type="number" id="capacity" bind:value={capacity} min="1" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <Button type="button" variant="secondary" on:click={closeModal}>Болих</Button>
      <Button type="submit">Хадгалах</Button>
    </div>
  </form>
</Modal>