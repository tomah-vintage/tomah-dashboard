<script lang="ts">
  import { DAY_NAMES_MN, REVERSE_DAY_MAPPING } from "$lib/utils/day-mapping";

  interface OpenHoursEntry {
    day_of_week: number;
    opening_time: string;
    closing_time: string;
  }

  export let value: OpenHoursEntry[] = [];
  export let onChange: (hours: OpenHoursEntry[]) => void = () => {};

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
    1: { open: "09:00", close: "22:00", isClosed: false }, // Monday
    2: { open: "09:00", close: "22:00", isClosed: false }, // Tuesday
    3: { open: "09:00", close: "22:00", isClosed: false }, // Wednesday
    4: { open: "09:00", close: "22:00", isClosed: false }, // Thursday
    5: { open: "09:00", close: "22:00", isClosed: false }, // Friday
    6: { open: "09:00", close: "22:00", isClosed: false }, // Saturday
    7: { open: "09:00", close: "22:00", isClosed: false }, // Sunday
  };

  // Parse existing value when component loads
  $: if (value && value.length > 0) {
    parseOpeningHours(value);
  }

  function parseOpeningHours(hoursArray: OpenHoursEntry[]) {
    try {
      // Reset all days to closed first
      for (let day = 1; day <= 7; day++) {
        weeklyHours[day] = { open: "", close: "", isClosed: true };
      }

      hoursArray.forEach((entry) => {
        // Convert API day (0=Monday, 1=Tuesday, ..., 6=Sunday) to ISO day (1=Monday, 7=Sunday)
        const isoDay = entry.day_of_week === 6 ? 7 : entry.day_of_week + 1;

        if (isoDay >= 1 && isoDay <= 7) {
          // Remove seconds from time format (09:00:00 -> 09:00)
          const openTime = entry.opening_time?.substring(0, 5) || "";
          const closeTime = entry.closing_time?.substring(0, 5) || "";

          weeklyHours[isoDay] = {
            open: openTime,
            close: closeTime,
            isClosed: false,
          };
        }
      });

      // Trigger reactivity
      weeklyHours = { ...weeklyHours };
    } catch (error) {
      console.error("Error parsing opening hours:", error);
    }
  }

  function generateOpeningHours(): OpenHoursEntry[] {
    const hoursArray: OpenHoursEntry[] = [];

    for (let day = 1; day <= 7; day++) {
      const hours = weeklyHours[day];
      // Convert ISO day (1=Monday, 7=Sunday) to API format (0=Monday, 1=Tuesday, ..., 6=Sunday)
      const apiDay = day === 7 ? 6 : day - 1;

      if (!hours.isClosed && hours.open && hours.close) {
        hoursArray.push({
          day_of_week: apiDay,
          opening_time: `${hours.open}:00`,
          closing_time: `${hours.close}:00`,
        });
      }
    }

    return hoursArray;
  }

  function updateHours() {
    const newValue = generateOpeningHours();
    value = newValue;
    onChange(newValue);
  }

  function toggleDayClosed(day: number) {
    weeklyHours[day].isClosed = !weeklyHours[day].isClosed;
    if (
      !weeklyHours[day].isClosed &&
      (!weeklyHours[day].open || !weeklyHours[day].close)
    ) {
      weeklyHours[day].open = "09:00";
      weeklyHours[day].close = "22:00";
    }
    weeklyHours = { ...weeklyHours };
    updateHours();
  }

  function updateDayHours(day: number, field: "open" | "close", value: string) {
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
      <p class="text-sm text-gray-600">
        Долоо хоногийн өдөр бүрийн ажлын цагийг тохируулна уу
      </p>
    </div>
  </div>

  <div class="space-y-3">
    {#each [1, 2, 3, 4, 5, 6, 7] as day (day)}
      {@const dayId = REVERSE_DAY_MAPPING[day]}
      {@const dayName = dayId ? DAY_NAMES_MN[dayId] : ""}
      {@const hours = weeklyHours[day]}

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-gray-900 w-16">{dayName}</span
            >
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
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Нээх цаг</label
              >
              <input
                type="time"
                value={hours.open}
                step="60"
                on:input={(e) =>
                  updateDayHours(day, "open", e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm [&::-webkit-datetime-edit-ampm-field]:hidden"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1"
                >Хаах цаг</label
              >
              <input
                type="time"
                value={hours.close}
                step="60"
                on:input={(e) =>
                  updateDayHours(day, "close", e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm [&::-webkit-datetime-edit-ampm-field]:hidden"
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
</div>
