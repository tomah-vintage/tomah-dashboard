<script lang="ts">
  import type { OpeningHours, DailyHours } from '$lib/types/restaurant';
  import { createEventDispatcher } from 'svelte';
  import TimePicker from '../time-picker/TimePicker.svelte';
  import { Plus, X } from 'lucide-svelte';

  export let value: OpeningHours = {};

  const dispatch = createEventDispatcher();

  const daysOfWeek = [
    { id: 'monday', label: 'Даваа' },
    { id: 'tuesday', label: 'Мягмар' },
    { id: 'wednesday', label: 'Лхагва' },
    { id: 'thursday', label: 'Пүрэв' },
    { id: 'friday', label: 'Баасан' },
    { id: 'saturday', label: 'Бямба' },
    { id: 'sunday', label: 'Ням' }
  ];

  function handleDayToggle(day: string, enabled: boolean) {
    if (enabled) {
      value = { ...value, [day]: [{ open: '09:00', close: '17:00' }] };
    } else {
      const newValue = { ...value };
      delete newValue[day];
      value = newValue;
    }
    dispatch('change', value);
  }

  function handleTimeChange(day: string, index: number, type: 'open' | 'close', time: string) {
    if (value[day] && value[day][index]) {
      const updatedDayHours = [...value[day]];
      updatedDayHours[index] = { ...updatedDayHours[index], [type]: time };
      value = { ...value, [day]: updatedDayHours };
      dispatch('change', value);
    }
  }

  function addTimeSlot(day: string) {
    if (value[day]) {
      value = { ...value, [day]: [...value[day], { open: '09:00', close: '17:00' }] };
      dispatch('change', value);
    }
  }

  function removeTimeSlot(day: string, index: number) {
    if (value[day]) {
      const updatedDayHours = [...value[day]];
      updatedDayHours.splice(index, 1);
      value = { ...value, [day]: updatedDayHours };
      dispatch('change', value);
    }
  }
</script>

<div class="space-y-4">
  <h2 class="text-lg font-bold mb-4">Ажлын цаг</h2>
  {#each daysOfWeek as day}
    <div class="flex items-center space-x-4 mb-2">
      <input
        type="checkbox"
        id="{day.id}-checkbox"
        checked={!!value[day.id] && value[day.id].length > 0}
        on:change={(e) => handleDayToggle(day.id, e.target.checked)}
        class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-blue focus:ring-primary-blue"
      />
      <label for="{day.id}-checkbox" class="w-24 text-sm text-gray-900">{day.label}</label>
      <div class="flex flex-col space-y-2 flex-grow">
        {#if value[day.id]}
          {#each value[day.id] as timeSlot, index (index)}
            <div class="flex items-center space-x-2">
              <TimePicker
                value={timeSlot.open}
                on:change={(e) => handleTimeChange(day.id, index, 'open', e.detail)}
              />
              <span>to</span>
              <TimePicker
                value={timeSlot.close}
                on:change={(e) => handleTimeChange(day.id, index, 'close', e.detail)}
              />
              {#if value[day.id].length > 1}
                <button type="button" on:click={() => removeTimeSlot(day.id, index)} class="p-1 rounded-full hover:bg-gray-200">
                  <X class="h-4 w-4 text-gray-500" />
                </button>
              {/if}
              {#if index === value[day.id].length - 1}
                <button type="button" on:click={() => addTimeSlot(day.id)} class="p-1 rounded-full hover:bg-gray-200">
                  <Plus class="h-4 w-4 text-gray-500" />
                </button>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/each}
</div>
