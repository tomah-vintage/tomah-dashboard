<script lang="ts">
  import WeeklyHoursInput from "$lib/components/ui/WeeklyHoursInput.svelte";
  import { restaurantSettingsStore } from "$lib/stores/restaurantSettingsStore";

  interface OpenHoursEntry {
    day_of_week: number;
    opening_time: string;
    closing_time: string;
  }

  let openHours: OpenHoursEntry[] = [];

  // Subscribe to store
  restaurantSettingsStore.subscribe(state => {
    openHours = state.formData.open_hours || [];
  });

  function handleHoursChange(hours: OpenHoursEntry[]) {
    restaurantSettingsStore.updateField('open_hours', hours);
  }
</script>

<div id="section-hours" class="scroll-mt-24">
  <div class="flex items-center mb-6">
    <div class="w-2 h-8 bg-orange-600 rounded-sm mr-3"></div>
    <div>
      <h2 class="text-xl font-semibold text-gray-900">Ажлын цаг</h2>
      <p class="text-sm text-gray-600 mt-1">
        7 хоногийн ажлын цагийн хуваарийг эндээс тохируулна уу
      </p>
    </div>
  </div>

  <WeeklyHoursInput value={openHours} onChange={handleHoursChange} />
</div>
