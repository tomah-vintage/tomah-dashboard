<script lang="ts">
  import type { RestaurantPerformanceData } from "$lib/types/dashboard";

  let { data }: { data: RestaurantPerformanceData[] } = $props();

  // Calculate total for percentage display
  let total = $derived(data.reduce((sum, item) => sum + item.percentage, 0));

  // Transform data for pie chart visualization
  let chartData = $derived(
    data.map((item, index) => ({
      name: item.name,
      value: item.percentage,
      color: item.color,
      startAngle: data
        .slice(0, index)
        .reduce((sum, d) => sum + (d.percentage / total) * 360, 0),
      endAngle: data
        .slice(0, index + 1)
        .reduce((sum, d) => sum + (d.percentage / total) * 360, 0),
    })),
  );

  let hoveredIndex = $state<number | null>(null);
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-xl font-bold text-gray-800 mb-4">Рестораны гүйцэтгэл</h2>
  <div class="flex items-center gap-8">
    <div class="relative w-64 h-64">
      <svg viewBox="0 0 200 200" class="w-full h-full">
        {#each chartData as item, index (item.name)}
          {@const startRad = ((item.startAngle - 90) * Math.PI) / 180}
          {@const endRad = ((item.endAngle - 90) * Math.PI) / 180}
          {@const largeArc = item.endAngle - item.startAngle > 180 ? 1 : 0}
          {@const radius = hoveredIndex === index ? 85 : 80}
          {@const hx1 = 100 + radius * Math.cos(startRad)}
          {@const hy1 = 100 + radius * Math.sin(startRad)}
          {@const hx2 = 100 + radius * Math.cos(endRad)}
          {@const hy2 = 100 + radius * Math.sin(endRad)}
          <path
            d="M 100 100 L {hx1} {hy1} A {radius} {radius} 0 {largeArc} 1 {hx2} {hy2} Z"
            fill={item.color}
            stroke="white"
            stroke-width="2"
            class="transition-all cursor-pointer"
            style="opacity: {hoveredIndex === null || hoveredIndex === index
              ? 1
              : 0.6}"
            role="button"
            tabindex="0"
            onmouseenter={() => (hoveredIndex = index)}
            onmouseleave={() => (hoveredIndex = null)}
          >
            <title>{item.name}: {item.value}%</title>
          </path>
        {/each}
      </svg>
    </div>
    <div class="flex-1">
      <div class="space-y-2">
        {#each data as item, index (item.name)}
          <button
            class="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
            onmouseenter={() => (hoveredIndex = index)}
            onmouseleave={() => (hoveredIndex = null)}
          >
            <div
              class="w-3 h-3 rounded-sm flex-shrink-0"
              style="background-color: {item.color}"
            ></div>
            <span class="text-sm text-gray-700 flex-1">{item.name}</span>
            <span class="text-sm font-semibold text-gray-800"
              >{item.percentage}%</span
            >
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>
