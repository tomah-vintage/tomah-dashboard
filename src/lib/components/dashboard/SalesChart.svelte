<script lang="ts">
  let { data }: { data: any } = $props();

  // Transform the data
  let labels = $derived(data?.labels || []);
  let values = $derived(data?.datasets?.[0]?.data || []);
  let maxValue = $derived(Math.max(...values, 1));

  let hoveredIndex = $state<number | null>(null);
</script>

<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
  <div class="flex justify-between items-center mb-4">
    <h3 class="font-semibold text-gray-800">Борлуулалтын график</h3>
    <span class="text-sm text-gray-500">Сүүлийн 30 хоног</span>
  </div>
  <div
    class="h-64 flex items-end justify-between gap-2 px-4 py-2 border-b border-l border-gray-200 relative"
  >
    {#each values as value, index (index)}
      {@const height = (value / maxValue) * 100}
      <div class="flex-1 flex flex-col items-center gap-1 group relative">
        <div
          class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer relative"
          style="height: {height}%"
          role="button"
          tabindex="0"
          onmouseenter={() => (hoveredIndex = index)}
          onmouseleave={() => (hoveredIndex = null)}
        >
          {#if hoveredIndex === index}
            <div
              class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
            >
              {value.toLocaleString()}
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-800"
              ></div>
            </div>
          {/if}
        </div>
        <span class="text-xs text-gray-600 mt-1 truncate w-full text-center"
          >{labels[index]}</span
        >
      </div>
    {/each}
  </div>
</div>
