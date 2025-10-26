<script lang="ts">
  import { DAY_NAMES_MN, REVERSE_DAY_MAPPING } from '$lib/utils/day-mapping';
  import { Input } from '$lib/components/ui/input';

  export let value: string = '';
  export let onChange: (hours: string) => void = () => {};

  interface DayHours {
    open: string;
    close: string;
    isClosed: boolean;
  }

  type WeeklyHours = {
    [key: number]: DayHours;
  };

  // Initialize weekly hours (ISO 8601: Monday=1, Sunday=7)
  let weeklyHours: WeeklyHours = {
    1: { open: '09:00', close: '22:00', isClosed: false }, // Monday
    2: { open: '09:00', close: '22:00', isClosed: false }, // Tuesday
    3: { open: '09:00', close: '22:00', isClosed: false }, // Wednesday
    4: { open: '09:00', close: '22:00', isClosed: false }, // Thursday
    5: { open: '09:00', close: '22:00', isClosed: false }, // Friday
    6: { open: '09:00', close: '22:00', isClosed: false }, // Saturday
    7: { open: '09:00', close: '22:00', isClosed: false }, // Sunday
  };

  // Parse existing value when component loads
  $: if (value && value.trim()) {
    parseOpeningHours(value);
  }

  function parseOpeningHours(hoursString: string) {
    try {
      // Expected format: "1:09:00-22:00,2:09:00-22:00,3:closed,..."
      const dayEntries = hoursString.split(',');
      
      dayEntries.forEach(entry => {
        const [dayStr, timeStr] = entry.split(':');
        const dayNum = parseInt(dayStr);
        
        if (dayNum >= 1 && dayNum <= 7) {
          if (timeStr === 'closed') {
            weeklyHours[dayNum] = { open: '', close: '', isClosed: true };
          } else {
            const [openTime, closeTime] = timeStr.split('-');
            if (openTime && closeTime) {
              weeklyHours[dayNum] = { 
                open: openTime, 
                close: closeTime, 
                isClosed: false 
              };
            }
          }
        }
      });
      
      // Trigger reactivity
      weeklyHours = { ...weeklyHours };
    } catch (error) {
      console.error('Error parsing opening hours:', error);
    }
  }

  function generateOpeningHours(): string {
    const hoursArray: string[] = [];
    
    for (let day = 1; day <= 7; day++) {
      const hours = weeklyHours[day];
      if (hours.isClosed) {
        hoursArray.push(`${day}:closed`);
      } else if (hours.open && hours.close) {
        hoursArray.push(`${day}:${hours.open}-${hours.close}`);
      }
    }
    
    return hoursArray.join(',');
  }

  function updateHours() {
    const newValue = generateOpeningHours();
    value = newValue;
    onChange(newValue);
  }

  function toggleDayClosed(day: number) {
    weeklyHours[day].isClosed = !weeklyHours[day].isClosed;
    if (!weeklyHours[day].isClosed && (!weeklyHours[day].open || !weeklyHours[day].close)) {
      weeklyHours[day].open = '09:00';
      weeklyHours[day].close = '22:00';
    }
    weeklyHours = { ...weeklyHours };
    updateHours();
  }

  function updateDayHours(day: number, field: 'open' | 'close', value: string) {
    weeklyHours[day][field] = value;
    weeklyHours = { ...weeklyHours };
    updateHours();
  }

  function copyToAllDays(sourceDay: number) {
    const sourceHours = weeklyHours[sourceDay];
    for (let day = 1; day <= 7; day++) {
      if (day !== sourceDay) {
        weeklyHours[day] = { ...sourceHours };
      }
    }
    weeklyHours = { ...weeklyHours };
    updateHours();
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-medium text-gray-900">Ажлын цаг</h3>
      <p class="text-sm text-gray-600">Долоо хоногийн өдөр бүрийн ажлын цагийг тохируулна уу</p>
    </div>
  </div>

  <div class="space-y-3">
    {#each [1, 2, 3, 4, 5, 6, 7] as day}
      {@const dayId = REVERSE_DAY_MAPPING[day]}
      {@const dayName = dayId ? DAY_NAMES_MN[dayId] : ''}
      {@const hours = weeklyHours[day]}
      
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-gray-900 w-16">{dayName}</span>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hours.isClosed}
                on:change={() => toggleDayClosed(day)}
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-600">Амралтын өдөр</span>
            </label>
          </div>
          
          {#if !hours.isClosed}
            <button
              type="button"
              on:click={() => copyToAllDays(day)}
              class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Бүгдэд хуулах
            </button>
          {/if}
        </div>

        {#if !hours.isClosed}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Нээх цаг</label>
              <input
                type="time"
                value={hours.open}
                on:input={(e) => updateDayHours(day, 'open', e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Хаах цаг</label>
              <input
                type="time"
                value={hours.close}
                on:input={(e) => updateDayHours(day, 'close', e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        {:else}
          <div class="text-center py-4">
            <span class="text-sm text-gray-500 italic">Амралтын өдөр</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Preview of generated value -->
  <div class="bg-gray-50 rounded-lg p-3">
    <label class="block text-xs font-medium text-gray-700 mb-1">Үүссэн утга (API-д илгээгдэх)</label>
    <code class="text-xs text-gray-600 font-mono break-all">{value || generateOpeningHours()}</code>
  </div>
</div>