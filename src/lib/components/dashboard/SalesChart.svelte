<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import type { SalesChartData } from "$lib/types/dashboard";
  import { Button } from "$lib/components/ui/button";
  import { Download } from "lucide-svelte";

  export let data: SalesChartData;

  let canvas: HTMLCanvasElement;
  onMount(() => {
    new Chart(canvas, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#e5e7eb",
            },
          },
        },
      },
    });
  });
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-800">Борлуулалт</h2>
    <div class="flex space-x-2">
      <Button variant="secondary">12 cap</Button>
      <Button variant="secondary">6 cap</Button>
      <Button variant="secondary">3 cap</Button>
      <Button variant="secondary">1 cap</Button>
      <Button variant="secondary">7 хоног</Button>
      <Button variant="secondary">
        <Download class="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    </div>
  </div>
  <div class="relative h-80">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
