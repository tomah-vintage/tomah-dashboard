<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import type { RestaurantPerformanceData } from "$lib/types/dashboard";

  export let data: RestaurantPerformanceData[];

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(() => {
    chart = new Chart(canvas, {
      type: "pie",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.percentage),
            backgroundColor: data.map((d) => d.color),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
            },
          },
        },
      },
    });
  });
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-xl font-bold text-gray-800 mb-4">Ресторанууд үзүүлэлт</h2>
  <div class="relative h-80">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
