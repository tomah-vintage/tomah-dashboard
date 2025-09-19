<script lang="ts">
  import { Clock } from "@lucide/svelte";

  export let openingHours: Array<{
    day_of_week_display: string;
    opening_time: string;
    closing_time: string;
  }> = [];
</script>

<section>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-6 flex items-center">
      <Clock class="w-6 h-6 mr-2" />
      Ажиллах цаг
    </h2>
    <div class="space-y-3">
      {#each openingHours as day (day.day_of_week_display)}
        <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700">
            {day.day_of_week_display}
          </span>
          <span class="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
            {day.opening_time} - {day.closing_time}
          </span>
        </div>
      {/each}
    </div>
  </div>
</section>