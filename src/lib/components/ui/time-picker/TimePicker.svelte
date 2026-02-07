<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string = '09:00';

  const dispatch = createEventDispatcher();

  let selectedHour = 9;
  let selectedMinute = 0;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  $: {
    const parts = (value || '09:00').split(':');
    selectedHour = parseInt(parts[0], 10);
    const rawMin = parseInt(parts[1], 10);
    selectedMinute = Math.round(rawMin / 5) * 5;
    if (selectedMinute >= 60) selectedMinute = 55;
  }

  function handleHourChange(e: Event) {
    selectedHour = parseInt((e.target as HTMLSelectElement).value, 10);
    emitChange();
  }

  function handleMinuteChange(e: Event) {
    selectedMinute = parseInt((e.target as HTMLSelectElement).value, 10);
    emitChange();
  }

  function emitChange() {
    value = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    dispatch('change', value);
  }
</script>

<div class="flex items-center gap-1">
  <select
    value={selectedHour}
    on:change={handleHourChange}
    class="appearance-none bg-blue-50 text-blue-700 font-medium text-sm pl-3 pr-7 py-1.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-chevron"
  >
    {#each hours as h}
      <option value={h}>{String(h).padStart(2, '0')}</option>
    {/each}
  </select>

  <span class="text-gray-400 font-medium text-sm">:</span>

  <select
    value={selectedMinute}
    on:change={handleMinuteChange}
    class="appearance-none bg-white text-gray-700 font-medium text-sm pl-3 pr-7 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-chevron"
  >
    {#each minutes as m}
      <option value={m}>{String(m).padStart(2, '0')}</option>
    {/each}
  </select>
</div>

<style>
  .select-chevron {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
  }
</style>
