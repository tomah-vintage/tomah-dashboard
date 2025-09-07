<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string; // e.g., "10:00"

  const dispatch = createEventDispatcher();

  let displayTime: string;

  // Reactive declaration to parse 'value' into 'displayTime'
  // This runs whenever 'value' changes (e.g., from parent component)
  $: {
    displayTime = value || '09:00';
  }

  // Function to handle changes from the time input
  function handleTimeInput(event: Event) {
    const target = event.target as HTMLInputElement;
    displayTime = target.value;
    value = displayTime;
    dispatch('change', value);
  }
</script>

<div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
  <input
    type="time"
    value={displayTime}
    on:input={handleTimeInput}
    class="px-2 py-1 focus:outline-none w-24"
  />
</div>
